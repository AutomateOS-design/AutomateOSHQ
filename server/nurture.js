import { runSql } from './db.js';
import { sendNurtureEmail } from './email.js';

/**
 * Background worker to process the 5-day automated lead nurture sequence.
 * This should be called periodically (e.g., every hour).
 */
export async function processNurtureSequence() {
  console.log(`[${new Date().toISOString()}] 📬 Processing lead nurture sequence...`);
  
  try {
    // 1. Leads for Day 2 (approx 24h after capture)
    // We check for stage 1 and age > 23 hours
    const day2Leads = runSql(`
      SELECT * FROM leads 
      WHERE nurtureStage = 1 
      AND createdAt < datetime('now', '-23 hours')
      AND email NOT IN (SELECT email FROM purchases WHERE productId LIKE '%Audit%')
    `);
    
    if (day2Leads.length > 0) {
      console.log(`- Sending Day 2 nurture to ${day2Leads.length} leads`);
      for (const lead of day2Leads) {
        const res = await sendNurtureEmail({ 
          email: lead.email, 
          firstName: lead.firstName, 
          agencyName: lead.agencyName,
          day: 2 
        });
        if (res.success) {
          runSql(`UPDATE leads SET nurtureStage = 2 WHERE id = ${lead.id}`);
        }
      }
    }

    // 2. Leads for Day 3 (approx 48h after capture)
    const day3Leads = runSql(`
      SELECT * FROM leads 
      WHERE nurtureStage = 2 
      AND createdAt < datetime('now', '-47 hours')
      AND email NOT IN (SELECT email FROM purchases WHERE productId LIKE '%Audit%')
    `);

    if (day3Leads.length > 0) {
      console.log(`- Sending Day 3 nurture to ${day3Leads.length} leads`);
      for (const lead of day3Leads) {
        const res = await sendNurtureEmail({ 
          email: lead.email, 
          firstName: lead.firstName, 
          agencyName: lead.agencyName,
          day: 3 
        });
        if (res.success) {
          runSql(`UPDATE leads SET nurtureStage = 3 WHERE id = ${lead.id}`);
        }
      }
    }

    // 3. Leads for Day 4 (approx 72h after capture)
    const day4Leads = runSql(`
      SELECT * FROM leads 
      WHERE nurtureStage = 3 
      AND createdAt < datetime('now', '-71 hours')
      AND email NOT IN (SELECT email FROM purchases WHERE productId LIKE '%Audit%')
    `);

    if (day4Leads.length > 0) {
      console.log(`- Sending Day 4 nurture to ${day4Leads.length} leads`);
      for (const lead of day4Leads) {
        const res = await sendNurtureEmail({ 
          email: lead.email, 
          firstName: lead.firstName, 
          agencyName: lead.agencyName,
          day: 4 
        });
        if (res.success) {
          runSql(`UPDATE leads SET nurtureStage = 4 WHERE id = ${lead.id}`);
        }
      }
    }

    // 4. Leads for Day 5 (approx 96h after capture)
    const day5Leads = runSql(`
      SELECT * FROM leads 
      WHERE nurtureStage = 4 
      AND createdAt < datetime('now', '-95 hours')
      AND email NOT IN (SELECT email FROM purchases WHERE productId LIKE '%Audit%')
    `);

    if (day5Leads.length > 0) {
      console.log(`- Sending Day 5 nurture to ${day5Leads.length} leads`);
      for (const lead of day5Leads) {
        const res = await sendNurtureEmail({ 
          email: lead.email, 
          firstName: lead.firstName, 
          agencyName: lead.agencyName,
          day: 5 
        });
        if (res.success) {
          runSql(`UPDATE leads SET nurtureStage = 5 WHERE id = ${lead.id}`);
        }
      }
    }

    console.log('✅ Lead nurture processing complete.');
  } catch (err) {
    console.error('❌ Error processing nurture sequence:', err.message);
  }
}
