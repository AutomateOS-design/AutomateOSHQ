/**
 * Frontend API client for AutomateOSHQ backend.
 * All API calls go through this module.
 */

const API_BASE = '/api';

async function request(path, options = {}) {
  const { method = 'GET', body, auth } = options;
  const headers = { 'Content-Type': 'application/json' };
  
  if (auth) {
    headers['Authorization'] = `Bearer ${auth}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────
export function adminLogin(password) {
  return request('/admin/login', { method: 'POST', body: { password } });
}

export function adminLogout(token) {
  return request('/admin/logout', { method: 'POST', auth: token });
}

export function checkAdminAuth(token) {
  return request('/admin/check', { auth: token });
}

// ── Clients ───────────────────────────────────────────────────
export function fetchClients() {
  return request('/clients');
}

export function fetchClient(id) {
  return request(`/clients/${id}`);
}

export function createClient(data) {
  return request('/clients', { method: 'POST', body: data });
}

export function updateClient(id, data, token) {
  return request(`/clients/${id}`, { method: 'PUT', body: data, auth: token });
}

export function removeClient(id, token) {
  return request(`/clients/${id}`, { method: 'DELETE', auth: token });
}

// ── Requests ──────────────────────────────────────────────────
export function fetchRequests(clientId = null) {
  const query = clientId ? `?clientId=${clientId}` : '';
  return request(`/requests${query}`);
}

export function createRequest(data) {
  return request('/requests', { method: 'POST', body: data });
}

export function updateRequest(id, data, token) {
  return request(`/requests/${id}`, { method: 'PUT', body: data, auth: token });
}

// ── Leads ─────────────────────────────────────────────────────
export function createLead(data) {
  return request('/leads', { method: 'POST', body: data });
}

export function fetchLeads() {
  return request('/leads');
}

// ── Admin Stats ───────────────────────────────────────────────
export function fetchAdminStats(token) {
  return request('/admin/stats', { auth: token });
}

// ── Stripe Subscriptions ──────────────────────────────────────
export function createCheckoutSession(clientId, plan, utmParams = {}) {
  return request('/stripe/create-checkout-session', {
    method: 'POST',
    body: { 
      clientId, 
      plan, 
      utm_source: utmParams.utm_source || '',
      utm_medium: utmParams.utm_medium || '',
      utm_campaign: utmParams.utm_campaign || ''
    }
  });
}

export function createPortalSession(clientId) {
  return request('/stripe/create-portal-session', {
    method: 'POST',
    body: { clientId }
  });
}

export function fetchSubscription(clientId) {
  return request(`/subscriptions/${clientId}`);
}

export function fetchPriceIds() {
  return request('/stripe/price-ids');
}

// ── Client Portal ─────────────────────────────────────────────
export function portalLogin(email) {
  return request('/portal/login', { method: 'POST', body: { email } });
}
export function fetchPortalClient(clientId) {
  return fetch(`/api/portal/client?clientId=${clientId}`).then(r => r.json());
}
export function fetchPortalMetrics(clientId) {
  return request(`/portal/metrics/${clientId}`);
}
export function fetchPortalWorkflows(clientId) {
  return request(`/portal/workflows/${clientId}`);
}

// ── Stripe One-Time Products ──────────────────────────────────
export function createProductCheckoutSession(productSlug, email, utmParams = {}) {
  return request('/stripe/create-product-checkout-session', {
    method: 'POST',
    body: { 
      productSlug, 
      email,
      utm_source: utmParams.utm_source || '',
      utm_medium: utmParams.utm_medium || '',
      utm_campaign: utmParams.utm_campaign || ''
    }
  });
}

// ── Health ────────────────────────────────────────────────────
export function healthCheck() {
  return request('/health');
}