/**
 * Tracking & Analytics Configuration
 * 
 * These values can be overridden via Vite environment variables:
 *   VITE_GA4_MEASUREMENT_ID  — Google Analytics 4 measurement ID
 *   VITE_META_PIXEL_ID       — Meta (Facebook) Pixel ID
 *   VITE_LINKEDIN_PARTNER_ID — LinkedIn Insight Tag partner ID
 * 
 * Example .env:
 *   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID=123456789012345
 *   VITE_LINKEDIN_PARTNER_ID=654321
 */

// Use import.meta.env with fallbacks for dev/staging
// The values in index.html will be injected at build time via Vite's %VITE_*% syntax
// These exports are for runtime use in React components (event tracking)
export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-BP0QQ446CX';
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '123456789012345';
export const LINKEDIN_PARTNER_ID = import.meta.env.VITE_LINKEDIN_PARTNER_ID || '654321';

/**
 * Fire a conversion event across all enabled tracking platforms
 */
export function trackConversion(eventName, params = {}) {
  try {
    // Google Analytics 4
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, { ...params, send_to: GA4_MEASUREMENT_ID });
    }
    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, params);
    }
    // LinkedIn Insight
    if (typeof window.lintrk === 'function') {
      window.lintrk('track', { conversion_id: LINKEDIN_PARTNER_ID });
    }
  } catch (err) {
    console.warn('Tracking event error:', err.message);
  }
}

/**
 * Fire a custom conversion event (for Meta custom events)
 */
export function trackCustomConversion(eventName, params = {}) {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    console.warn('Custom tracking event error:', err.message);
  }
}
