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
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
  getClients, getClient, insertClient, updateClient, deleteClient,
  getRequests, insertRequest, updateRequest,
  seedDefaults
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Configuration from environment ──────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'automateos-admin-2026';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Admin Authentication ────────────────────────────────────────
// Simple token-based auth using SHA-256 HMAC tokens stored in a Set
const activeTokens = new Set();

function generateToken() {
  const raw = `${SESSION_SECRET}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — missing or invalid token' });
  }
  const token = authHeader.slice(7);
  if (!activeTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized — token expired or invalid' });
  }
  req.adminToken = token;
  next();
}

// ── Seed default data on startup ────────────────────────────────
const seedResult = seedDefaults();
console.log('Seed:', seedResult);

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

// ─── Clients ───────────────────────────────────────────────────
app.get('/api/clients', (req, res) => {
  try {
    const clients = getClients();
    // Parse numeric fields for JSON response
    const parsed = clients.map(c => ({
      ...c,
      hoursSaved: Number(c.hoursSaved || 0),
      executionsMTD: Number(c.executionsMTD || 0),
      valueCreated: Number(c.valueCreated || 0),
      metrics: {
        hoursSaved: Number(c.hoursSaved || 0),
        executionsMTD: Number(c.executionsMTD || 0),
        valueCreated: Number(c.valueCreated || 0)
      }
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id', (req, res) => {
  try {
    const client = getClient(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({
      ...client,
      hoursSaved: Number(client.hoursSaved || 0),
      executionsMTD: Number(client.executionsMTD || 0),
      valueCreated: Number(client.valueCreated || 0),
      metrics: {
        hoursSaved: Number(client.hoursSaved || 0),
        executionsMTD: Number(client.executionsMTD || 0),
        valueCreated: Number(client.valueCreated || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const { id, companyName, contactName, email, phone, plan, status, metrics } = req.body;
    if (!id || !companyName || !contactName || !email) {
      return res.status(400).json({ error: 'Missing required fields: id, companyName, contactName, email' });
    }
    insertClient({
      id, companyName, contactName, email,
      phone: phone || '',
      plan: plan || 'starter',
      status: status || 'Active',
      hoursSaved: metrics?.hoursSaved || 0,
      executionsMTD: metrics?.executionsMTD || 0,
      valueCreated: metrics?.valueCreated || 0
    });
    const client = getClient(id);
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/clients/:id', requireAdmin, (req, res) => {
  try {
    const { companyName, contactName, email, phone, plan, status, metrics } = req.body;
    const updates = {};
    if (companyName !== undefined) updates.companyName = companyName;
    if (contactName !== undefined) updates.contactName = contactName;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (plan !== undefined) updates.plan = plan;
    if (status !== undefined) updates.status = status;
    if (metrics?.hoursSaved !== undefined) updates.hoursSaved = metrics.hoursSaved;
    if (metrics?.executionsMTD !== undefined) updates.executionsMTD = metrics.executionsMTD;
    if (metrics?.valueCreated !== undefined) updates.valueCreated = metrics.valueCreated;

    updateClient(req.params.id, updates);
    const client = getClient(req.params.id);
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', requireAdmin, (req, res) => {
  try {
    deleteClient(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Requests ──────────────────────────────────────────────────
app.get('/api/requests', (req, res) => {
  try {
    const { clientId } = req.query;
    const requests = getRequests(clientId || null);
    const parsed = requests.map(r => ({
      ...r,
      id: Number(r.id),
      hoursSaved: Number(r.hoursSaved || 0),
      runs: Number(r.runs || 0),
      tools: typeof r.tools === 'string' ? JSON.parse(r.tools) : (r.tools || [])
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', (req, res) => {
  try {
    const reqData = req.body;
    if (!reqData.clientId || !reqData.title) {
      return res.status(400).json({ error: 'Missing required fields: clientId, title' });
    }
    insertRequest({
      ...reqData,
      id: reqData.id || Date.now(),
      tools: typeof reqData.tools === 'string' ? reqData.tools : JSON.stringify(reqData.tools || []),
      updated: 'Just now',
      submitted: reqData.submitted || 'Just now'
    });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/requests/:id', requireAdmin, (req, res) => {
  try {
    const { status, hoursSaved, runs, title, type } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (hoursSaved !== undefined) updates.hoursSaved = hoursSaved;
    if (runs !== undefined) updates.runs = runs;
    if (title !== undefined) updates.title = title;
    if (type !== undefined) updates.type = type;
    updates.updated = 'Just now';

    updateRequest(req.params.id, updates);

    // If activating, also increment client metrics
    if (status === 'Active') {
      const allRequests = getRequests(null);
      const target = allRequests.find(r => Number(r.id) === Number(req.params.id));
      if (target) {
        const client = getClient(target.clientId);
        if (client) {
          const addHours = Number(hoursSaved || 12);
          const addRuns = Number(runs || 150);
          updateClient(target.clientId, {
            hoursSaved: Number(client.hoursSaved || 0) + addHours,
            executionsMTD: Number(client.executionsMTD || 0) + addRuns,
            valueCreated: Number(client.valueCreated || 0) + (addHours * 45)
          });
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin Stats Endpoint ─────────────────────────────────────
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const clients = getClients();
    const requests = getRequests(null);
    const planRates = { starter: 999, growth: 2499, dedicated: 4999 };
    
    const totalClients = clients.length;
    const totalActiveAutomations = requests.filter(r => r.status === 'Active').length;
    const totalHoursSavedAcrossAll = clients.reduce((acc, c) => acc + Number(c.hoursSaved || 0), 0);
    const totalMRR = clients.reduce((acc, c) => {
      if (c.status === 'Active' || c.status === 'active') {
        return acc + (planRates[c.plan] || 0);
      }
      return acc;
    }, 0);

    res.json({
      totalClients,
      totalActiveAutomations,
      totalHoursSavedAcrossAll,
      totalMRR,
      dollarValue: totalHoursSavedAcrossAll * 45
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════════
// STATIC FILE SERVING (React frontend)
// ═══════════════════════════════════════════════════════════════

app.use(express.static(DIST_DIR));

// SPA fallback — serve index.html for any non-API route
app.get('/{*path}', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AutomateOS Production Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static files from: ${DIST_DIR}`);
  console.log(`🔐 Admin login at POST /api/admin/login`);
});