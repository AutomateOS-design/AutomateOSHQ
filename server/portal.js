/**
 * Client Portal Backend Module
 *
 * Handles portal login/lookup, metrics retrieval, and workflow display
 * for the client-facing /portal dashboard.
 */

import { runSql } from './db.js';

const esc = (s) => (s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL');

/**
 * Look up a client by email (simple mock auth for portal access).
 * Returns the client record or null.
 */
export function lookupClientByEmail(email) {
  const rows = runSql(`SELECT * FROM clients WHERE email = ${esc(email)}`);
  return rows[0] || null;
}

/**
 * Look up a client by ID.
 */
export function lookupClientById(clientId) {
  const rows = runSql(`SELECT * FROM clients WHERE id = ${esc(clientId)}`);
  return rows[0] || null;
}

/**
 * Get aggregated metrics for a client's portal.
 */
export function getClientMetrics(clientId) {
  const rows = runSql(`SELECT * FROM client_metrics WHERE clientId = ${esc(clientId)} ORDER BY updatedAt DESC LIMIT 1`);
  return rows[0] || null;
}

/**
 * Get live workflow statuses for a client's portal.
 */
export function getClientWorkflows(clientId) {
  return runSql(`SELECT * FROM portal_workflows WHERE clientId = ${esc(clientId)} ORDER BY status ASC, updatedAt DESC`);
}

/**
 * Upsert client metrics (admin function).
 */
export function upsertClientMetrics({ clientId, workflowsTotal, tasksMTD, hoursSaved, valueCreated }) {
  const existing = runSql(`SELECT id FROM client_metrics WHERE clientId = ${esc(clientId)} ORDER BY updatedAt DESC LIMIT 1`);
  if (existing.length > 0) {
    return runSql(`UPDATE client_metrics SET workflowsTotal = ${Number(workflowsTotal)}, tasksMTD = ${Number(tasksMTD)}, hoursSaved = ${Number(hoursSaved)}, valueCreated = ${Number(valueCreated)}, updatedAt = datetime('now') WHERE id = ${existing[0].id}`);
  }
  return runSql(`INSERT INTO client_metrics (clientId, workflowsTotal, tasksMTD, hoursSaved, valueCreated) VALUES (${esc(clientId)}, ${Number(workflowsTotal)}, ${Number(tasksMTD)}, ${Number(hoursSaved)}, ${Number(valueCreated)})`);
}