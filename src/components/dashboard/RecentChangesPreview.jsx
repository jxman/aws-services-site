import { getLatestChanges, formatChangeSummary, getIconClasses } from '../../utils/whatsNewHelpers';

function RecentChangesPreview({ changeLog, servicesData, metadata, maxItems = 5 }) {
  const changes = getLatestChanges(changeLog, servicesData, maxItems);
  const summary = formatChangeSummary(metadata);

  if (!changes || changes.length === 0) {
    return (
      <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-md p-4">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary">
          No recent infrastructure changes
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📊</span>
        <h3 className="text-xs font-semibold text-text-light-secondary dark:text-text-secondary uppercase tracking-wider">
          Recent Changes
        </h3>
      </div>

      <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-md p-4 border border-border-light dark:border-border">
        <div className="space-y-3">
          {changes.map((change, idx) => (
            <div
              key={`${change.type}-${change.code}-${idx}`}
              className="flex items-start gap-3"
            >
              <span
                className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full ${getIconClasses(
                  change.icon
                )}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {change.type === 'new-service' && (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  )}
                  {change.type === 'regional-expansion' && (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v.878A2.996 2.996 0 0110 16a2.996 2.996 0 01-3-2.122V13a2 2 0 00-2-2H4.332z"
                      clipRule="evenodd"
                    />
                  )}
                  {change.type === 'new-region' && (
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                  {change.title}
                </div>
                <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-0.5">
                  {change.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {summary && (
          <div className="mt-4 pt-3 border-t border-border-light dark:border-border">
            <div className="text-xs text-text-light-secondary dark:text-text-secondary">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentChangesPreview;
