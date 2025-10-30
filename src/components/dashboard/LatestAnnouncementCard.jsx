function LatestAnnouncementCard({ announcement }) {
  if (!announcement) {
    return (
      <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-md p-4">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary">
          No recent announcements available
        </div>
      </div>
    );
  }

  const { title, pubDateFormatted, categories, link } = announcement;

  // Extract service names from categories
  const services = categories
    ?.filter((cat) => cat.startsWith('general:products/'))
    .map((cat) => cat.replace('general:products/', '').replace(/-/g, ' '))
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .slice(0, 2); // Show max 2 services

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔥</span>
        <h3 className="text-xs font-semibold text-text-light-secondary dark:text-text-secondary uppercase tracking-wider">
          Latest from AWS
        </h3>
      </div>

      <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-md p-4 hover:border-primary transition-colors border border-border-light dark:border-border">
        <h4 className="text-base font-semibold text-text-light-primary dark:text-text-primary mb-2 line-clamp-2">
          {title}
        </h4>

        <div className="flex flex-wrap items-center gap-2 text-xs text-text-light-secondary dark:text-text-secondary mb-3">
          <span>{pubDateFormatted}</span>
          {services && services.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-1">
                {services.map((service, idx) => (
                  <span key={idx} className="text-primary">
                    {service}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Read More on AWS
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default LatestAnnouncementCard;
