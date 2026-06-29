/**
 * Email delivery module — uses Resend API for transactional email.
 * Initializes lazily when RESEND_API_KEY is available.
 */
import { Resend } from 'resend';

let resend = null;
let initialized = false;

const FROM_EMAIL = process.env.FROM_EMAIL || 'AutomateOS <onboarding@resend.dev>';

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

  const guideUrl = process.env.SITE_URL || 'https://automateoshq.com/lead-magnet';

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
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
            If you'd rather have an elite operations team build and maintain these workflows for a flat monthly fee, <a href="https://automateoshq.com" style="color: #6366f1; font-weight: 600;">check out our plans</a>.
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

/**
 * Send a nurture email to a lead.
 * @param {object} params
 * @param {string} params.email - Lead's email
 * @param {string} params.firstName - Lead's name
 * @param {string} params.agencyName - Lead's agency name
 * @param {number} params.day - Which day in the nurture sequence (2-5)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendNurtureEmail({ email, firstName, agencyName, day }) {
  if (!initialized || !resend) {
    return { success: false, message: 'Email delivery not initialized' };
  }

  const nurtureEmails = {
    2: {
      subject: 'The 20% "Manual Work Tax" (and how to stop paying it) 📉',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 16px;">Hi ${firstName}, quick question for you...</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            How much of your team's day is spent moving data between spreadsheets, chasing content approvals, or manually creating invoices?
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            Most agencies are unknowingly paying a <strong>20% revenue tax</strong> due to manual work. It’s the invisible fee you pay every month that keeps your margins thin.
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            We just published a deep dive on how to identify and recover this tax:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://automateoshq.com/resources/the-hidden-tax" style="display: inline-block; padding: 14px 28px; background: #6366f1; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
              Read: Why Manual Work is Killing Your Margins →
            </a>
          </div>
        </div>
      `
    },
    3: {
      subject: '10 Hours Saved (The ROI of an hour) ⏱️',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 16px;">The math is simple, ${firstName}.</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            When founders think about automation, they often focus on the "cool" tech. But at the end of the day, it's a financial decision. 
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            Every hour we save your team is an hour that can be spent on high-level strategy or closing more deals.
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            We broke down the exact math on how to calculate the ROI of automation:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://automateoshq.com/resources/roi-of-automation" style="display: inline-block; padding: 14px 28px; background: #6366f1; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
              Read: A CFO's Perspective on Automation ROI →
            </a>
          </div>
        </div>
      `
    },
    4: {
      subject: 'How one agency recovered 15 hours/week on onboarding 🚀',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 16px;">"The best hire I never made."</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            One of the biggest bottlenecks for any agency is the "client kickoff."
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            We recently helped a creative agency automate their entire onboarding loop. Result? <strong>15 hours/week saved</strong> and a kickoff time that went from 3 days to 15 minutes.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://automateoshq.com/resources/case-study-onboarding" style="display: inline-block; padding: 14px 28px; background: #6366f1; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
              Read the Full Case Study →
            </a>
          </div>
        </div>
      `
    },
    5: {
      subject: `A prioritized automation roadmap for ${agencyName || 'your agency'}? 🗺️`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 16px;">Where do you start, ${firstName}?</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            You've seen the workflows. You know the ROI. Now it's time to build your own roadmap.
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            If you don't have the time to build these systems yourself, we have a shortcut: The <strong>$299 Automation Audit.</strong>
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            It’s a 60-minute deep dive where we map your entire stack, identify your 3 biggest bottlenecks, and give you a step-by-step roadmap to fix them.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://automateoshq.com/audit" style="display: inline-block; padding: 14px 28px; background: #6366f1; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
              Book Your Audit for $299 →
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            Note: If you decide to join a subscription plan after your audit, the full $299 cost is credited back to your first month.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; text-align: center;">
            AutomateOSHQ &middot; <a href="mailto:unsubscribe@ctomail.io?subject=Unsubscribe" style="color: #94a3b8;">Unsubscribe</a>
          </p>
        </div>
      `
    }
  };

  const nurtureContent = nurtureEmails[day];
  if (!nurtureContent) return { success: false, message: `Invalid nurture day: ${day}` };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: nurtureContent.subject,
      html: nurtureContent.html
    });

    if (error) {
      console.error(`❌ Nurture email error (Day ${day}) for ${email}:`, error);
      return { success: false, message: error.message };
    }

    return { success: true, message: `Day ${day} nurture email sent`, id: data?.id };
  } catch (err) {
    console.error(`❌ Failed to send nurture email to ${email}:`, err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Send a product delivery email with download links for a one-time purchase.
 * @param {object} params
 * @param {string} params.email - Buyer's email
 * @param {string} params.name - Buyer's name
 * @param {string} params.productName - Product name
 * @param {number} params.productPrice - Price paid in cents
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendProductDelivery({ email, name, productName, productPrice }) {
  if (!initialized || !resend) {
    return { success: false, message: 'Email delivery not initialized (no RESEND_API_KEY)' };
  }

  const productTitle = productName || 'AutomateOS Product';
  const priceDisplay = productPrice ? `${(productPrice / 100).toFixed(0)}` : '';

  const downloadUrls = {
    'Template Pack (Lead Gen Essentials)': 'https://automateoshq.com/downloads/template-pack-lead-gen.pdf',
    'Automation Audit (One-time)': 'https://automateoshq.com/downloads/automation-audit-report.pdf',
    'Single Integration Build': 'https://automateoshq.com/downloads/single-integration-guide.pdf',
  };

  const downloadLink = downloadUrls[productTitle] || 'https://automateoshq.com/lead-magnet';

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `📥 Your Download: ${productTitle} is ready!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #6366f1, #14b8a6); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px;">📥</span>
            </div>
          </div>
          <h2 style="font-size: 22px; color: #1e293b; margin-bottom: 8px; text-align: center;">Thanks for your purchase, ${name}!</h2>
          <p style="color: #64748b; font-size: 15px; text-align: center; margin-bottom: 24px;">
            Your <strong style="color: #1e293b;">${productTitle}</strong> ${priceDisplay} is ready to download.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${downloadLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #14b8a6); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
              Download Your Product →
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
            This download link is unique to your purchase. If you have any issues accessing your files, reply to this email and we'll help you right away.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
            Best,<br/>The AutomateOS Team<br/>
            <span style="color: #cbd5e1;">Questions? Contact us at automateos@ctomail.io</span>
          </p>
        </div>
      `
    });

    if (error) {
      console.error(`❌ Product delivery email error for ${email}:`, error);
      return { success: false, message: error.message || 'Resend API error' };
    }

    console.log(`✅ Product "${productTitle}" delivered to ${email} (id: ${data?.id})`);
    return { success: true, message: 'Product delivery email sent', id: data?.id };
  } catch (err) {
    console.error(`❌ Failed to send product delivery to ${email}:`, err.message);
    return { success: false, message: err.message };
  }
}