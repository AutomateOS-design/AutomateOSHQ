/**
 * AutomateOS Production Server
 *
 * Serves the built React frontend and provides a REST API backed by
 * Turso (team-db) for persistent storage. Admin authentication uses
 * a password set via environment variable.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

// ── Configuration ────────────────────────────────────────────────
dotenv.config();

import {
  getClients, getClient, insertClient, updateClient, deleteClient,
  getRequests, insertRequest, updateRequest,
  seedDefaults, loginClient, runSql
} from './db.js';

import {
  initStripe, isStripeReady,
  createCheckoutSession, createProductCheckoutSession, createPortalSession, getClientSubscription,
  handleWebhook, PRICE_IDS, ONE_TIME_PRODUCTS
} from './stripe.js';

import { initEmail, isEmailReady, sendLeadMagnet } from './email.js';
import { processNurtureSequence } from './nurture.js';

import {
  lookupClientByEmail, lookupClientById,
  getClientMetrics, getClientWorkflows, upsertClientMetrics
} from './portal.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'automateos-admin-2026';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Middleware ──────────────────────────────────────────────────
app.use(cors());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Webhook endpoint needs raw body — handle before JSON parser
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  try {
    const result = await handleWebhook(req.body, sig, webhookSecret);
    res.json(result);
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.use(express.json());

// ── Session/Auth ────────────────────────────────────────────────
const activeTokens = new Set();
const generateToken = () => crypto.randomBytes(32).toString('hex');

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — missing token' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized — token expired or invalid' });
  }
  req.adminToken = token;
  next();
}

// ── Seed default data on startup ────────────────────────────────
const seedResult = seedDefaults();
console.log('Seed:', seedResult);

// ── Initialize Stripe ─────────────────────────────────────────
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
initStripe(STRIPE_SECRET_KEY);

// ─── Initialize Email (Resend) ─────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
initEmail(RESEND_API_KEY);

// ═══════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════

// ─── Auth ──────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }
  const token = generateToken();
  activeTokens.add(token);
  res.json({ token, expiresIn: SESSION_EXPIRY_MS });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  activeTokens.delete(req.adminToken);
  res.json({ success: true });
});

app.get('/api/admin/check', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

// ─── Client Auth ───────────────────────────────────────────────
app.post('/api/clients/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  try {
    const client = loginClient(email, password);
    if (!client) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // For now, just return the client info. 
    // In a real app, you'd use a JWT or session.
    res.json({ success: true, client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Clients ───────────────────────────────────────────────────
app.get('/api/clients', (req, res) => {
  try {
    const clients = getClients();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id', (req, res) => {
  try {
    const client = getClient(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const client = req.body;
    const result = insertClient(client);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const client = req.body;
    const result = updateClient(req.params.id, client);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const result = deleteClient(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Requests ──────────────────────────────────────────────────
app.get('/api/requests', (req, res) => {
  try {
    const { clientId } = req.query;
    const requests = getRequests(clientId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const request = req.body;
    const result = insertRequest(request);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    const request = req.body;
    const result = updateRequest(req.params.id, request);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Sitemap XML ─────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  const siteUrl = 'https://automateos.io';
  const now = new Date().toISOString().split('T')[0];
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/lead-magnet</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/onboarding</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
});

// ─── Lead Magnet Capture ─────────────────────────────────────
app.post('/api/leads', async (req, res) => {
  try {
    const { firstName, email, agencyName, source = 'landing-page', utm_source = '', utm_medium = '', utm_campaign = '' } = req.body;
    if (!firstName || !email || !agencyName) {
      return res.status(400).json({ error: 'Missing required fields: firstName, email, agencyName' });
    }
    const esc = (s) => s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL';
    runSql(`INSERT INTO leads (firstName, email, agencyName, source, utm_source, utm_medium, utm_campaign) VALUES (${esc(firstName)}, ${esc(email)}, ${esc(agencyName)}, ${esc(source)}, ${esc(utm_source)}, ${esc(utm_medium)}, ${esc(utm_campaign)})`);

    // Send the lead magnet guide via Resend (async, non-blocking)
    let emailResult = null;
    if (isEmailReady()) {
      emailResult = await sendLeadMagnet({ firstName, email, agencyName });
      if (emailResult.success) {
        runSql(`UPDATE leads SET delivered = 1 WHERE rowid IN (SELECT rowid FROM leads WHERE email = ${esc(email)} ORDER BY id DESC LIMIT 1)`);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Lead captured successfully',
      email: emailResult ? (emailResult.success ? 'delivered' : 'pending') : 'unavailable'
    });
  } catch (err) {
    console.error('Lead capture error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leads', (req, res) => {
  try {
    const rows = runSql('SELECT * FROM leads ORDER BY createdAt DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// STRIPE SUBSCRIPTION ROUTES
// ═══════════════════════════════════════════════════════════════

// ─── Create Checkout Session ─────────────────────────────────
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  if (!isStripeReady()) {
    return res.status(503).json({ error: 'Stripe not initialized. Set STRIPE_SECRET_KEY.' });
  }
  try {
    const { clientId, plan, utm_source = '', utm_medium = '', utm_campaign = '' } = req.body;
    if (!clientId || !plan) {
      return res.status(400).json({ error: 'Missing required fields: clientId, plan' });
    }
    const successUrl = `${req.protocol}://${req.get('host')}/dashboard?onboarded=true&clientId=${clientId}&plan=${plan}`;
    const cancelUrl = `${req.protocol}://${req.get('host')}/onboarding?plan=${plan}`;
    const result = await createCheckoutSession(clientId, plan, successUrl, cancelUrl, { utm_source, utm_medium, utm_campaign });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Create Customer Portal Session ───────────────────────────
app.post('/api/stripe/create-portal-session', async (req, res) => {
  if (!isStripeReady()) {
    return res.status(503).json({ error: 'Stripe not initialized' });
  }
  try {
    const { clientId } = req.body;
    if (!clientId) return res.status(400).json({ error: 'Missing clientId' });
    const subscription = getClientSubscription(clientId);
    if (!subscription || !subscription.stripeCustomerId) {
      return res.status(404).json({ error: 'No active subscription found for this client' });
    }
    const returnUrl = `${req.protocol}://${req.get('host')}/dashboard?clientId=${clientId}`;
    const result = await createPortalSession(subscription.stripeCustomerId, returnUrl);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Client Subscription Status ───────────────────────────
app.get('/api/subscriptions/:clientId', (req, res) => {
  try {
    const subscription = getClientSubscription(req.params.clientId);
    if (!subscription) return res.json({ active: false, subscription: null });
    res.json({
      active: subscription.status === 'active' || subscription.status === 'trialing',
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        stripeCustomerId: subscription.stripeCustomerId,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Price IDs for frontend ───────────────────────────────
app.get('/api/stripe/price-ids', (req, res) => {
  res.json(PRICE_IDS);
});

// ─── One-Time Products & Purchases ───────────────────────────
app.get('/api/products', (req, res) => {
  const products = Object.entries(ONE_TIME_PRODUCTS).map(([slug, p]) => ({
    slug, name: p.name, price: p.price, description: p.desc
  }));
  res.json(products);
});

app.post('/api/products/checkout', async (req, res) => {
  try {
    const { productSlug, email, utm_source = '', utm_medium = '', utm_campaign = '' } = req.body;
    if (!productSlug || !email) {
      return res.status(400).json({ error: 'Missing required fields: productSlug, email' });
    }
    const baseUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
    const result = await createProductCheckoutSession(
      productSlug, email,
      `${baseUrl}/dashboard?purchased=${productSlug}`,
      `${baseUrl}/#products`,
      { utm_source, utm_medium, utm_campaign }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/purchases', (req, res) => {
  try {
    const rows = runSql('SELECT * FROM purchases ORDER BY createdAt DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// CLIENT PORTAL ROUTES
// ═══════════════════════════════════════════════════════════════

// ─── Portal Login (email lookup) ──────────────────────────────
app.post('/api/portal/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const client = lookupClientByEmail(email);
    if (!client) return res.status(404).json({ error: 'No client found with that email' });
    // Generate a simple portal token (mock auth)
    const token = Buffer.from(`${client.id}:${Date.now()}`).toString('base64');
    res.json({ success: true, clientId: client.id, companyName: client.companyName, contactName: client.contactName, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Portal Client Info ────────────────────────────────────
app.get('/api/portal/client', (req, res) => {
  try {
    const clientId = req.query.clientId || req.headers['x-client-id'];
    if (!clientId) return res.status(401).json({ error: 'Missing client ID' });
    const client = lookupClientById(clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    const metrics = getClientMetrics(clientId);
    const workflows = getClientWorkflows(clientId);
    res.json({ client, metrics, workflows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Portal Metrics ───────────────────────────────────────────
app.get('/api/portal/metrics/:clientId', (req, res) => {
  try {
    const metrics = getClientMetrics(req.params.clientId);
    res.json(metrics || { workflowsTotal: 0, tasksMTD: 0, hoursSaved: 0, valueCreated: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Portal Workflows ─────────────────────────────────────────
app.get('/api/portal/workflows/:clientId', (req, res) => {
  try {
    const workflows = getClientWorkflows(req.params.clientId);
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Upsert Client Metrics ────────────────────────────
app.post('/api/admin/metrics', (req, res) => {
  try {
    const { clientId, workflowsTotal, tasksMTD, hoursSaved, valueCreated } = req.body;
    if (!clientId) return res.status(400).json({ error: 'clientId required' });
    upsertClientMetrics({ clientId, workflowsTotal, tasksMTD, hoursSaved, valueCreated });
    res.json({ success: true, message: `Metrics updated for ${clientId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Lead Management ──────────────────────────────────
app.get('/api/admin/leads', requireAdmin, (req, res) => {
  try {
    const { search, campaign, agency } = req.query;
    let sql = 'SELECT * FROM leads';
    const conditions = [];
    if (search) conditions.push(`(firstName LIKE '%${search.replace(/'/g, "''")}%' OR email LIKE '%${search.replace(/'/g, "''")}%' OR agencyName LIKE '%${search.replace(/'/g, "''")}%')`);
    if (campaign) conditions.push(`utm_campaign LIKE '%${campaign.replace(/'/g, "''")}%'`);
    if (agency) conditions.push(`agencyName LIKE '%${agency.replace(/'/g, "''")}%'`);
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY createdAt DESC';
    const rows = runSql(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/leads/:id/score', requireAdmin, (req, res) => {
  try {
    const { score } = req.body;
    const id = parseInt(req.params.id);
    if (isNaN(score) || score < 0 || score > 5) return res.status(400).json({ error: 'Score must be 0-5' });
    runSql(`UPDATE leads SET score = ${score} WHERE id = ${id}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/leads/export', requireAdmin, (req, res) => {
  try {
    const rows = runSql('SELECT * FROM leads ORDER BY createdAt DESC');
    const headers = ['ID', 'First Name', 'Email', 'Agency', 'Source', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Score', 'Delivered', 'Created At'];
    const csv = [
      headers.join(','),
      ...rows.map(r => [
        r.id, `"${(r.firstName || '').replace(/"/g, '""')}"`, `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.agencyName || '').replace(/"/g, '""')}"`, `"${(r.source || '')}"`,
        `"${(r.utm_source || '')}"`, `"${(r.utm_medium || '')}"`, `"${(r.utm_campaign || '')}"`,
        r.score || 0, r.delivered || 0, r.createdAt || ''
      ].join(','))
    ].join('\n');
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="automateos-leads-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Resources (Markdown Content) ──────────────────────────────
const RESOURCES_DIR = path.resolve('/home/team/shared/marketing/resources');
const MANIFEST_PATH = path.resolve('/home/team/shared/marketing/resources-manifest.json');

let manifestData = null;
try {
  manifestData = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`📋 Loaded resources manifest: ${manifestData.articles.length} articles`);
} catch (err) {
  console.warn('⚠️ Could not load resources manifest:', err.message);
  manifestData = { articles: [] };
}

function getManifestForSlug(slug) {
  if (!manifestData) return null;
  return manifestData.articles.find(a => a.slug === slug) || null;
}

function parseResourceMeta(slug, content) {
  const lines = content.split('\n');
  const title = lines[0]?.replace(/^#\s+/, '') || slug;
  // Find excerpt — first paragraph after title that's not empty
  let excerpt = '';
  let inBody = false;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!inBody && line === '') continue;
    inBody = true;
    if (line && !line.startsWith('#')) {
      excerpt = line.replace(/\*\*/g, '').slice(0, 200);
      break;
    }
  }
  const manifest = getManifestForSlug(slug);
  return {
    slug,
    title: manifest?.title || title,
    excerpt: manifest?.description || excerpt,
    category: manifest?.category || null,
    thumbnail: manifest?.thumbnail || null,
    hero: manifest?.hero || null
  };
}

app.get('/api/resources', (req, res) => {
  try {
    const files = fs.readdirSync(RESOURCES_DIR).filter(f => f.endsWith('.md'));
    const resources = files.map(file => {
      const slug = file.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(RESOURCES_DIR, file), 'utf-8');
      return parseResourceMeta(slug, content);
    });
    res.json(resources);
  } catch (err) {
    console.error('Resources error:', err.message);
    res.status(500).json({ error: 'Failed to load resources' });
  }
});

app.get('/api/resources/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const filePath = path.join(RESOURCES_DIR, `${slug}.md`);
    // Prevent directory traversal
    if (!filePath.startsWith(RESOURCES_DIR)) {
      return res.status(403).json({ error: 'Invalid path' });
    }
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseResourceMeta(slug, content);
    res.json({ ...meta, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// STATIC FILE SERVING (React frontend)
// ═══════════════════════════════════════════════════════════════

app.use(express.static(DIST_DIR));

// SPA fallback — serve index.html for any non-API route
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ─── Automated Nurture Sequence Worker ───────────────────────
const NURTURE_INTERVAL_MS = 60 * 60 * 1000; // Check every hour
setInterval(() => {
  if (isEmailReady()) {
    processNurtureSequence().catch(err => console.error('Nurture Worker Error:', err.message));
  }
}, NURTURE_INTERVAL_MS);

// Run once on startup after a short delay
setTimeout(() => {
  if (isEmailReady()) {
    processNurtureSequence().catch(err => console.error('Initial Nurture Run Error:', err.message));
  }
}, 10000);

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AutomateOS Production Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static files from: ${DIST_DIR}`);
  console.log(`🔐 Admin login at POST /api/admin/login`);
});
