import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to dynamically manage the canonical URL based on current route
 * This prevents Google from treating all SPA routes as duplicates of the homepage
 */
const CanonicalTag = () => {
  const location = useLocation();
  const baseUrl = 'https://aws-services.synepho.com';

  useEffect(() => {
    // Find existing canonical link or create new one
    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }

    // Build canonical URL from current pathname
    const canonicalUrl = `${baseUrl}${location.pathname}`;
    canonicalLink.setAttribute('href', canonicalUrl);

    // Also update OG URL for social sharing consistency
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }

    // Update Twitter URL
    let twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', canonicalUrl);
    }

  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default CanonicalTag;
