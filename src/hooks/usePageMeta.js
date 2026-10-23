import { useEffect } from 'react';

const setMetaContent = (selector, content) => {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute('content', content);
  }
};

/**
 * Sets the document title, description, social tags, and robots directive
 * for the current page. Prerendered HTML already carries the same values;
 * this keeps them correct during client-side navigation.
 *
 * @param {{title?: string, description?: string, noindex?: boolean}} meta
 */
export const usePageMeta = ({ title, description, noindex = false }) => {
  useEffect(() => {
    if (!title) return;

    document.title = title;
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[name="twitter:title"]', title);

    if (description) {
      setMetaContent('meta[name="description"]', description);
      setMetaContent('meta[property="og:description"]', description);
      setMetaContent('meta[name="twitter:description"]', description);
    }

    const robots = noindex ? 'noindex, follow' : 'index, follow';
    setMetaContent('meta[name="robots"]', robots);
    setMetaContent('meta[name="googlebot"]', robots);
  }, [title, description, noindex]);
};
