import { useState } from 'react';
import DOMPurify from 'dompurify';

function AnnouncementCard({ announcement }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { title, summary, link, pubDateFormatted, categories, htmlContent } = announcement;

  // Extract service names from categories
  const services = categories
    ?.filter((cat) => cat.startsWith('general:products/'))
    .map((cat) => cat.replace('general:products/', '').replace(/-/g, ' '))
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1));

  const sanitizedContent = htmlContent ? DOMPurify.sanitize(htmlContent) : '';

  return (
    <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="text-base font-semibold text-text-light-primary dark:text-text-primary mb-2 line-clamp-2">
        {title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-3 line-clamp-3">
        {summary}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-text-light-secondary dark:text-text-secondary">
          {pubDateFormatted}
        </span>
        {services && services.length > 0 && (
          <>
            <span className="text-text-light-secondary dark:text-text-secondary">•</span>
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 2).map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                >
                  {service}
                </span>
              ))}
              {services.length > 2 && (
                <span className="text-xs text-text-light-secondary dark:text-text-secondary">
                  +{services.length - 2} more
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && sanitizedContent && (
        <div
          className="prose prose-sm dark:prose-invert max-w-none mb-3 text-text-light-secondary dark:text-text-secondary"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {sanitizedContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {isExpanded ? 'Show Less ▲' : 'Read More ▼'}
          </button>
        )}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          View on AWS
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default AnnouncementCard;
