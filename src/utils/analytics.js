/**
 * Google Analytics (GA4) utility functions
 * Centralizes all GA tracking calls for consistent implementation
 *
 * Single source of truth for the measurement ID: set VITE_GA_MEASUREMENT_ID
 * in .env (see .env.example). Falls back to the production ID so a missing
 * .env never breaks the build.
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-2HLT4VSZHW';

/**
 * Load and initialize gtag.js. Only runs in production builds so local
 * dev (`npm run dev`) and Claude's port-3002 test server never send
 * pageviews/events to the live GA property.
 */
export const initGA = () => {
  if (typeof window === 'undefined' || !import.meta.env.PROD || window.gtag) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // send_page_view: false — usePageTracking's initial-mount effect sends the
  // first page_view event itself, so the default auto pageview would double-count it.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
};

/**
 * Send a pageview event to Google Analytics
 * @param {string} url - The page URL or path
 * @param {string} title - The page title
 */
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
      page_location: window.location.href,
    });
  }
};

/**
 * Send a custom event to Google Analytics
 * @param {string} eventName - The name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track user interactions (clicks, downloads, etc.)
 * @param {string} category - Event category (e.g., 'downloads', 'navigation')
 * @param {string} action - Event action (e.g., 'click', 'download')
 * @param {string} label - Event label (e.g., button name, file name)
 */
export const trackInteraction = (category, action, label) => {
  trackEvent(action, {
    event_category: category,
    event_label: label,
  });
};
