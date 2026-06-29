/**
 * Database wrapper — uses `team-db` CLI (Turso sync) for persistence.
 * Every call pulls from Turso, executes, and pushes via the CLI.
 */
import { execSync } from 'child_process';

const TEAM_DB = process.env.TEAM_DB_BIN || 'team-db';

/**
 * Execute a single SQL statement via team-db CLI.
 * @param {string} sql - Single SQL statement
 * @returns {Array} Parsed JSON result array
 */
export function runSql(sql) {
  try {
    const escaped = sql.replace(/'/g, "'\\''");
    const cmd = `${TEAM_DB} '${escaped}'`;
    const stdout = execSync(cmd, { encoding: 'utf-8', timeout: 15000 });
    
    // Attempt to extract the JSON array if there's chatter in stdout
    const start = stdout.indexOf('[');
    const end = stdout.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(stdout.substring(start, end + 1));
    }
    
    const trimmed = stdout.trim();
    if (!trimmed) return [];
    return JSON.parse(trimmed);
  } catch (err) {
    console.error('DB Error:', err.message, 'SQL:', sql);
    throw err;
  }
}

/**
 * Fetch all clients from the database.
 */
export function getClients() {
  return runSql('SELECT * FROM clients ORDER BY companyName ASC');
}

/**
 * Fetch a single client by ID.
 */
export function getClient(id) {
  const rows = runSql(`SELECT * FROM clients WHERE id = '${id.replace(/'/g, "''")}'`);
  return rows[0] || null;
}

/**
 * Insert a new client.
 */
export function insertClient(client) {
  const {
    id, companyName, contactName, email, phone = '',
    plan = 'starter', status = 'Active', password = '',
    hoursSaved = 0, executionsMTD = 0, valueCreated = 0,
    utm_source = '', utm_medium = '', utm_campaign = '', utm_term = '', utm_content = ''
  } = client;

  const esc = (s) => (s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL');
  const sql = `INSERT INTO clients (id, companyName, contactName, email, phone, plan, status, hoursSaved, executionsMTD, valueCreated, password, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
    VALUES (${esc(id)}, ${esc(companyName)}, ${esc(contactName)}, ${esc(email)}, ${esc(phone)},
            ${esc(plan)}, ${esc(status)}, ${Number(hoursSaved)}, ${Number(executionsMTD)}, ${Number(valueCreated)}, ${esc(password)},
            ${esc(utm_source)}, ${esc(utm_medium)}, ${esc(utm_campaign)}, ${esc(utm_term)}, ${esc(utm_content)})`;
  return runSql(sql);
}

/**
 * Attempt to log in a client by email and password.
 */
export function loginClient(email, password) {
  const esc = (s) => (s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL');
  const rows = runSql(`SELECT * FROM clients WHERE email = ${esc(email)} AND password = ${esc(password)}`);
  return rows[0] || null;
}

/**
 * Update an existing client.
 */
export function updateClient(id, updates) {
  const sets = [];
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      const escaped = typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : String(Number(val));
      sets.push(`${key} = ${escaped}`);
    }
  }
  if (sets.length === 0) return [];
  const safeId = id.replace(/'/g, "''");
  return runSql(`UPDATE clients SET ${sets.join(', ')} WHERE id = '${safeId}'`);
}

/**
 * Delete a client by ID.
 */
export function deleteClient(id) {
  const safeId = id.replace(/'/g, "''");
  return runSql(`DELETE FROM clients WHERE id = '${safeId}'`);
}

/**
 * Fetch all requests, optionally filtered by clientId.
 */
export function getRequests(clientId = null) {
  if (clientId) {
    const safe = clientId.replace(/'/g, "''");
    return runSql(`SELECT * FROM requests WHERE clientId = '${safe}' ORDER BY id DESC`);
  }
  return runSql('SELECT * FROM requests ORDER BY id DESC');
}

/**
 * Insert a new request.
 */
export function insertRequest(req) {
  const {
    id, clientId, clientName, title, type = 'Custom Integration',
    tools = '[]', status = 'Pending', hoursSaved = 0,
    runs = 0, updated = 'Just now', submitted = 'Just now',
    description = '', priority = 'normal', category = 'integration'
  } = req;

  const esc = (s) => (s != null ? `'${String(s).replace(/'/g, "''")}'` : 'NULL');
  const toolsStr = typeof tools === 'string' ? tools : JSON.stringify(tools);

  const sql = `INSERT INTO requests (id, clientId, clientName, title, type, tools, status, hoursSaved, runs, updated, submitted, description, priority, category)
    VALUES (${id != null ? Number(id) : 'NULL'}, ${esc(clientId)}, ${esc(clientName)}, ${esc(title)},
            ${esc(type)}, ${esc(toolsStr)}, ${esc(status)}, ${Number(hoursSaved)}, ${Number(runs)},
            ${esc(updated)}, ${esc(submitted)}, ${esc(description)}, ${esc(priority)}, ${esc(category)})`;
  return runSql(sql);
}

/**
 * Update a request.
 */
export function updateRequest(id, updates) {
  const sets = [];
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      const escaped = typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : String(Number(val));
      sets.push(`${key} = ${escaped}`);
    }
  }
  if (sets.length === 0) return [];
  return runSql(`UPDATE requests SET ${sets.join(', ')} WHERE id = ${Number(id)}`);
}

/**
 * Seed default data if the clients table is empty.
 */
export function seedDefaults() {
  const existing = getClients();
  if (existing.length > 0) return { seeded: false, count: existing.length };

  const defaultClients = [
    { id: 'acme', companyName: 'Acme Agency', contactName: 'Sarah Jenkins', email: 'sarah@acmeagency.com', phone: '+1 (555) 321-9876', plan: 'starter', status: 'Active', hoursSaved: 36, executionsMTD: 450, valueCreated: 1620 },
    { id: 'velocity', companyName: 'Velocity Agency', contactName: 'Marcus Thorne', email: 'marcus@velocity.io', phone: '+1 (555) 765-4321', plan: 'growth', status: 'Active', hoursSaved: 96, executionsMTD: 5800, valueCreated: 4320 },
    { id: 'apex', companyName: 'Apex Retail', contactName: 'Elena Rostova', email: 'elena@apexretail.com', phone: '+1 (555) 987-6543', plan: 'dedicated', status: 'Active', hoursSaved: 170, executionsMTD: 11800, valueCreated: 7650 }
  ];

  for (const c of defaultClients) {
    insertClient(c);
  }

  // Seed default requests
  const defaultRequests = [
    { id: 101, clientId: 'acme', clientName: 'Acme Agency', title: 'Airtable to Slack Live Lead Sync', type: 'CRM & Lead Management', tools: JSON.stringify(['Airtable', 'Slack', 'Zapier']), status: 'Active', hoursSaved: 24, runs: 310, updated: '1 hour ago', submitted: '4 days ago' },
    { id: 102, clientId: 'acme', clientName: 'Acme Agency', title: 'Gmail Attachment Auto-Saver to Drive', type: 'File Management', tools: JSON.stringify(['Gmail', 'Google Drive', 'Make.com']), status: 'Active', hoursSaved: 12, runs: 140, updated: 'Yesterday', submitted: '3 days ago' },
    { id: 103, clientId: 'acme', clientName: 'Acme Agency', title: 'Airtable sync to Webflow multi-reference fields', type: 'Reporting & Data Sync', tools: JSON.stringify(['Airtable', 'Webflow']), status: 'Reviewing', hoursSaved: 0, runs: 0, updated: 'Today', submitted: 'Today' },
    { id: 201, clientId: 'velocity', clientName: 'Velocity Agency', title: 'AI Invoice Extractor & QuickBooks Sync', type: 'AI & Document Processing', tools: JSON.stringify(['Gmail', 'GPT-4', 'QuickBooks', 'Airtable']), status: 'Active', hoursSaved: 48, runs: 1240, updated: '2 hours ago', submitted: '6 days ago' },
    { id: 202, clientId: 'velocity', clientName: 'Velocity Agency', title: 'HubSpot to Slack Live Lead Qualifier', type: 'Lead Nurturing', tools: JSON.stringify(['HubSpot', 'Zapier', 'Slack']), status: 'Active', hoursSaved: 36, runs: 4820, updated: 'Yesterday', submitted: '5 days ago' },
    { id: 203, clientId: 'velocity', clientName: 'Velocity Agency', title: 'Customer Support Auto-Reply Draft Bot', type: 'AI Agent / Automation', tools: JSON.stringify(['Gmail', 'Claude 3.5', 'Notion']), status: 'Pending', hoursSaved: 0, runs: 0, updated: '1 day ago', submitted: '1 day ago' },
    { id: 204, clientId: 'velocity', clientName: 'Velocity Agency', title: 'Monthly PDF Analytics Compiler', type: 'Reporting & Data Sync', tools: JSON.stringify(['Google Drive', 'Make.com', 'Slack']), status: 'Active', hoursSaved: 12, runs: 82, updated: '3 days ago', submitted: '3 days ago' },
    { id: 205, clientId: 'velocity', clientName: 'Velocity Agency', title: 'Auto-reply to Instagram DMs via OpenAI integration', type: 'AI Agent / Automation', tools: JSON.stringify(['Instagram', 'OpenAI']), status: 'Reviewing', hoursSaved: 0, runs: 0, updated: '3 days ago', submitted: '3 days ago' },
    { id: 301, clientId: 'apex', clientName: 'Apex Retail', title: 'AI Invoice Extractor & QuickBooks Sync', type: 'AI & Document Processing', tools: JSON.stringify(['Gmail', 'GPT-4', 'QuickBooks', 'Airtable']), status: 'Active', hoursSaved: 48, runs: 1240, updated: '2 hours ago', submitted: '8 days ago' },
    { id: 302, clientId: 'apex', clientName: 'Apex Retail', title: 'HubSpot to Slack Live Lead Qualifier', type: 'Lead Nurturing', tools: JSON.stringify(['HubSpot', 'Zapier', 'Slack']), status: 'Active', hoursSaved: 36, runs: 4820, updated: 'Yesterday', submitted: '7 days ago' },
    { id: 303, clientId: 'apex', clientName: 'Apex Retail', title: 'Customer Support Auto-Reply Draft Bot', type: 'AI Agent / Automation', tools: JSON.stringify(['Gmail', 'Claude 3.5', 'Notion']), status: 'Active', hoursSaved: 40, runs: 2310, updated: 'Yesterday', submitted: '6 days ago' },
    { id: 304, clientId: 'apex', clientName: 'Apex Retail', title: 'Monthly PDF Analytics Compiler', type: 'Reporting & Data Sync', tools: JSON.stringify(['Google Drive', 'Make.com', 'Slack']), status: 'Active', hoursSaved: 24, runs: 110, updated: '3 days ago', submitted: '5 days ago' },
    { id: 305, clientId: 'apex', clientName: 'Apex Retail', title: 'Custom API Multi-Channel Inventory Sync', type: 'Custom API Sync', tools: JSON.stringify(['Node.js', 'Stripe', 'Salesforce', 'Shopify']), status: 'Active', hoursSaved: 60, runs: 8140, updated: '4 days ago', submitted: '4 days ago' },
    { id: 306, clientId: 'apex', clientName: 'Apex Retail', title: 'Automatic High-Priority Support Escalations', type: 'Workflow Routing', tools: JSON.stringify(['Intercom', 'PagerDuty', 'Slack']), status: 'Reviewing', hoursSaved: 0, runs: 0, updated: 'Just now', submitted: 'Just now' }
  ];

  for (const r of defaultRequests) {
    insertRequest(r);
  }

  return { seeded: true, clientsCount: defaultClients.length, requestsCount: defaultRequests.length };
}
