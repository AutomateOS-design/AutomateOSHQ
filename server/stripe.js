/**
 * Stripe Subscription Integration Service
 * 
 * Handles server-side subscription checkout, customer portal, and webhook lifecycle.
 * Reads STRIPE_SECRET_KEY from environment.
 */

import Stripe from 'stripe';
import { runSql } from './db.js';
import { isEmailReady, sendProductDelivery } from './email.js';

let stripe = null;

export function initStripe(secretKey) {
  if (!secretKey) {
    console.warn('⚠️ STRIPE_SECRET_KEY not set — Stripe integration disabled');
    return false;
  }
  stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });
  console.log('✅ Stripe initialized successfully');
  return true;
}

export function isStripeReady() {
  return stripe !== null;
}

export const PRICE_IDS = {
  starter: 'price_1TlkKMDHCeB3dcqLLp62tjFs',
  growth: 'price_1TlkKcDHCeB3dcqLdVy6DFNl',
  dedicated: 'price_1TlkKmDHCeB3dcqL0zgarzuS',
  solo: 'price_1TmHdjDHCeB3dcqL9aypFXcT',
  enterprise: 'price_1TmHdqDHCeB3dcqLURKLxWGA',
};

/**
 * One-time product definitions for bite-sized purchases.
 * Maps product slugs to Stripe Price IDs and display info.
 */
export const ONE_TIME_PRODUCTS = {
  'template-pack': { priceId: 'price_1Tn9BkDHCeB3dcqL3KtQ64bI', name: 'Template Pack (Lead Gen Essentials)', price: 19900, desc: 'Pre-configured automation templates for capturing leads from Facebook/LinkedIn Ads with AI enrichment' },
  'automation-audit': { priceId: 'price_1TmHdYDHCeB3dcqL6bNdTc8x', name: 'Automation Audit (One-time)', price: 29900, desc: '60-minute deep-dive session with prioritized automation roadmap for your business' },
  'single-integration': { priceId: 'price_1Tn9BmDHCeB3dcqLuaDW2YFu', name: 'Single Integration Build', price: 149900, desc: 'Custom high-complexity workflow build with 30 days of post-launch support' },
};

const PLAN_FROM_PRICE = {};
for (const [plan, priceId] of Object.entries(PRICE_IDS)) {
  PLAN_FROM_PRICE[priceId] = plan;
}

/**
 * Create a Stripe Checkout Session for a subscription.
 */
export async function createCheckoutSession(clientId, plan, successUrl, cancelUrl) {
  if (!stripe) throw new Error('Stripe not initialized — check STRIPE_SECRET_KEY');
  const priceId = PRICE_IDS[plan];
  if (!priceId) throw new Error(`Invalid plan: ${plan}`);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: clientId,
    metadata: { clientId, plan },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return { sessionId: session.id, url: session.url };
}

/**
 * Create a Stripe Checkout Session for a one-time product purchase.
 */
export async function createProductCheckoutSession(productSlug, email, successUrl, cancelUrl) {
  if (!stripe) throw new Error('Stripe not initialized — check STRIPE_SECRET_KEY');
  const product = ONE_TIME_PRODUCTS[productSlug];
  if (!product) throw new Error(`Invalid product slug: ${productSlug}`);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: product.priceId, quantity: 1 }],
    customer_email: email,
    metadata: { productName: product.name, priceId: product.priceId },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return { sessionId: session.id, url: session.url, product: product };
}

/**
 * Create a Stripe Customer Portal session for billing management.
 */
export async function createPortalSession(stripeCustomerId, returnUrl) {
  if (!stripe) throw new Error('Stripe not initialized');
  const portal = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return { url: portal.url };
}

/**
 * Get a client's subscription from our database.
 */
export function getClientSubscription(clientId) {
  const safeId = clientId.replace(/'/g, "''");
  const rows = runSql(`SELECT * FROM subscriptions WHERE clientId = '${safeId}' ORDER BY createdAt DESC LIMIT 1`);
  return rows[0] || null;
}

/**
 * Upsert subscription record in our database.
 */
function upsertSubscription({ subscriptionId, clientId, customerId, priceId, plan, status, periodStart, periodEnd }) {
  const esc = (s) => s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL';
  runSql(`DELETE FROM subscriptions WHERE clientId = ${esc(clientId)}`);
  runSql(`INSERT INTO subscriptions (id, clientId, stripeCustomerId, stripePriceId, plan, status, currentPeriodStart, currentPeriodEnd)
    VALUES (${esc(subscriptionId)}, ${esc(clientId)}, ${esc(customerId)}, ${esc(priceId)}, ${esc(plan)},
            ${esc(status)}, ${esc(periodStart)}, ${esc(periodEnd)})`);
}

/**
 * Process Stripe webhook events.
 */
export async function handleWebhook(rawBody, signature, webhookSecret) {
  if (!stripe) throw new Error('Stripe not initialized');

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  const esc = (s) => s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL';

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const clientId = session.metadata?.clientId || session.client_reference_id;
      const customerEmail = session.customer_details?.email || session.metadata?.email || '';

      // Handle one-time payment products (bite-sized purchases)
      if (session.mode === 'payment') {
        const priceId = session.metadata?.priceId || '';
        const productName = session.metadata?.productName || 'AutomateOS Product';
        const amountTotal = session.amount_total || 0;
        const customerName = session.customer_details?.name || customerEmail?.split('@')[0] || 'Valued Customer';

        // Log the purchase
        runSql(`INSERT INTO purchases (sessionId, clientEmail, clientName, productName, productPrice, priceId)
          VALUES (${esc(session.id)}, ${esc(customerEmail)}, ${esc(customerName)}, ${esc(productName)}, ${amountTotal}, ${esc(priceId)})`);
        console.log(`💰 One-time purchase: ${productName} by ${customerEmail} (${session.id})`);

        // Send fulfillment email
        if (isEmailReady()) {
          sendProductDelivery({
            email: customerEmail,
            name: customerName,
            productName,
            productPrice: amountTotal
          }).then(result => {
            if (result.success) {
              runSql(`UPDATE purchases SET fulfilled = 1 WHERE sessionId = ${esc(session.id)}`);
            }
          }).catch(err => console.error('Fulfillment email error:', err.message));
        }
        break;
      }

      // Handle subscription purchases (existing logic)
      if (!clientId) break;

      const subscriptionId = session.subscription;
      const customerId = session.customer;

      let subscription;
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      } catch { break; }

      const priceId = subscription.items.data[0]?.price?.id || '';
      const plan = PLAN_FROM_PRICE[priceId] || 'starter';
      const periodStart = new Date(subscription.current_period_start * 1000).toISOString();
      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      upsertSubscription({
        subscriptionId, clientId, customerId, priceId, plan,
        status: subscription.status, periodStart, periodEnd
      });
      runSql(`UPDATE clients SET status = 'Active', plan = ${esc(plan)} WHERE id = ${esc(clientId)}`);
      console.log(`✅ Subscription created for ${clientId}: ${subscriptionId}`);
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object;
      const subId = sub.id;
      const customerId = sub.customer;
      const priceId = sub.items.data[0]?.price?.id || '';
      const plan = PLAN_FROM_PRICE[priceId] || 'starter';
      const status = sub.status;
      const periodStart = new Date(sub.current_period_start * 1000).toISOString();
      const periodEnd = new Date(sub.current_period_end * 1000).toISOString();

      // Find clientId from existing subscription record
      const existing = runSql(`SELECT clientId FROM subscriptions WHERE id = ${esc(subId)}`);
      let clientId = existing[0]?.clientId;
      
      // If not found by subscription ID, find by customer ID
      if (!clientId) {
        const byCustomer = runSql(`SELECT clientId FROM subscriptions WHERE stripeCustomerId = ${esc(customerId)} LIMIT 1`);
        clientId = byCustomer[0]?.clientId;
      }

      if (clientId) {
        upsertSubscription({ subscriptionId: subId, clientId, customerId, priceId, plan, status, periodStart, periodEnd });
        const clientStatus = status === 'active' ? 'Active' : status === 'past_due' ? 'PastDue' : status === 'canceled' ? 'Canceled' : 'Inactive';
        runSql(`UPDATE clients SET status = ${esc(clientStatus)}, plan = ${esc(plan)} WHERE id = ${esc(clientId)}`);
        console.log(`🔄 Subscription ${subId} updated: ${status}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const exSub = runSql(`SELECT clientId FROM subscriptions WHERE id = ${esc(sub.id)}`);
      if (exSub[0]?.clientId) {
        runSql(`UPDATE clients SET status = 'Inactive' WHERE id = ${esc(exSub[0].clientId)}`);
        runSql(`UPDATE subscriptions SET status = 'canceled' WHERE id = ${esc(sub.id)}`);
        console.log(`❌ Subscription ${sub.id} deleted — client ${exSub[0].clientId} deactivated`);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        const subRows = runSql(`SELECT clientId FROM subscriptions WHERE id = ${esc(subscriptionId)}`);
        if (subRows[0]?.clientId) {
          runSql(`UPDATE clients SET status = 'PastDue' WHERE id = ${esc(subRows[0].clientId)}`);
          console.log(`⚠️ Payment failed for subscription ${subscriptionId}`);
        }
      }
      break;
    }

    case 'customer.subscription.paused': {
      const pausedSub = event.data.object;
      const pRows = runSql(`SELECT clientId FROM subscriptions WHERE id = ${esc(pausedSub.id)}`);
      if (pRows[0]?.clientId) {
        runSql(`UPDATE clients SET status = 'Paused' WHERE id = ${esc(pRows[0].clientId)}`);
      }
      break;
    }
  }

  return { received: true, event: event.type };
}
