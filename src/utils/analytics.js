/**
 * Google Analytics utility functions
 * Centralizes all GA tracking calls for consistent implementation
 */

/**
 * Send a pageview event to Google Analytics
 * @param {string} url - The page URL or path
 * @param {string} title - The page title
 */
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-2HLT4VSZHW', {
      page_path: url,
      page_title: title,
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
