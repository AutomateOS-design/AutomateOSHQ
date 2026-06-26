/**
 * Email delivery module — uses Resend API for transactional email.
 * Initializes lazily when RESEND_API_KEY is available.
 */
import { Resend } from 'resend';

let resend = null;
let initialized = false;

/**
 * Initialize the Resend client. Must be called with a valid API key.
 * @param {string} apiKey - Resend API key (starts with 're_')
 * @returns {boolean} Whether initialization succeeded
 */
export function initEmail(apiKey) {
  if (!apiKey || !apiKey.startsWith('re_')) {
    console.warn('⚠️ Email delivery disabled: no valid RESEND_API_KEY set');
    initialized = false;
    resend = null;
    return false;
  }
  try {
    resend = new Resend(apiKey);
    initialized = true;
    console.log('✅ Email delivery initialized (Resend)');
    return true;
  } catch (err) {
    console.error('❌ Failed to initialize Resend:', err.message);
    initialized = false;
    return false;
  }
}

export function isEmailReady() {
  return initialized && resend !== null;
}

/**
 * Send the Lead Magnet Guide email to a new lead.
 * @param {string} firstName - Lead's first name
 * @param {string} email - Lead's email address
 * @param {string} agencyName - Lead's agency name
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendLeadMagnet({ firstName, email, agencyName }) {
  if (!initialized || !resend) {
    return { success: false, message: 'Email delivery not initialized (no RESEND_API_KEY)' };
  }

  const guideUrl = process.env.SITE_URL || 'https://automateos-hq.vercel.app/lead-magnet';

  try {
    const { data, error } = await resend.emails.send({
      from: 'AutomateOS <automateos@ctomail.io>',
      to: [email],
      subject: '[Download] Your Agency Automation Guide is here',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 22px; color: #1e293b; margin-bottom: 16px;">
            Hi ${firstName},
          </h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            Thanks for requesting our guide, <strong style="color: #1e293b;">"Top 5 Automation Workflows for High-Growth Agencies."</strong>
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
            Here's a preview of the 5 workflows inside:
          </p>
          <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">✅ The Speed-to-Lead Engine — Automated Intake & AI Qualification</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">✅ Seamless Onboarding — Payment → Project Kickoff in minutes</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">✅ The Hands-Off Reporter — Automated KPI Syncing</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">✅ Frictionless Finance — Automated Invoicing & Collections</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">✅ The Bottleneck Breaker — Content Approval & Feedback Loops</td></tr>
          </table>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${guideUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #14b8a6); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
              View the Full Guide →
            </a>
          </div>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Most agencies plateau because of a <strong>Manual Work Tax</strong> — the hours your team spends copy-pasting data instead of driving client results.
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            If you'd rather have an elite operations team build and maintain these workflows for a flat monthly fee, <a href="https://automateos-hq.vercel.app" style="color: #6366f1; font-weight: 600;">check out our plans</a>.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Best,<br/>The AutomateOS Team<br/>
            <span style="color: #cbd5e1;">${agencyName ? `For ${agencyName} &middot; ` : ''}Join 150+ agency founders who have reclaimed their time.</span>
          </p>
        </div>
      `
    });

    if (error) {
      console.error(`❌ Resend error for ${email}:`, error);
      return { success: false, message: error.message || 'Resend API error' };
    }

    console.log(`✅ Lead magnet delivered to ${email} (id: ${data?.id})`);
    return { success: true, message: 'Email sent successfully', id: data?.id };
  } catch (err) {
    console.error(`❌ Failed to send email to ${email}:`, err.message);
    return { success: false, message: err.message };
  }
}