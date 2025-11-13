import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Custom hook to automatically track page views on route changes
 * This hook should be used once at the app level to track all navigation
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the page title from document or generate from path
    const pageTitle = document.title || location.pathname;

    // Track the page view
    trackPageView(location.pathname + location.search, pageTitle);
  }, [location]);
};
