import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInfrastructureChanges } from '../../hooks/useInfrastructureChanges';
import { useAWSAnnouncements } from '../../hooks/useAWSAnnouncements';
import { useServiceNames } from '../../hooks/useAWSData';
import LatestAnnouncementCard from './LatestAnnouncementCard';
import RecentChangesPreview from './RecentChangesPreview';

function WhatsNewPreview() {
  const { data: infrastructureData, isLoading: infraLoading, error: infraError } = useInfrastructureChanges();
  const { data: announcementsData, isLoading: announcementsLoading, error: announcementsError } = useAWSAnnouncements();
  const { data: allServicesData, isLoading: servicesLoading } = useServiceNames();

  const isLoading = infraLoading || announcementsLoading || servicesLoading;
  const hasError = infraError && announcementsError; // Both must fail for error state

  // Convert services array to object keyed by code for lookup
  const servicesMap = useMemo(() => {
    if (!allServicesData) return {};
    return allServicesData.reduce((acc, service) => {
      acc[service.code] = service;
      return acc;
    }, {});
  }, [allServicesData]);

  // Extract data
  const latestAnnouncement = announcementsData?.announcements?.[0];
  const changeLog = infrastructureData?.changeLog || [];
  const metadata = infrastructureData?.metadata;

  return (
    <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary flex items-center gap-2">
          <span>📰</span>
          What&apos;s New
        </h2>
        <Link
          to="/whats-new"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-bg-light-tertiary dark:bg-bg-tertiary rounded w-1/4 mb-3"></div>
            <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-md p-4 space-y-3">
              <div className="h-4 bg-bg-light-primary dark:bg-bg-primary rounded w-3/4"></div>
              <div className="h-3 bg-bg-light-primary dark:bg-bg-primary rounded w-1/2"></div>
              <div className="h-3 bg-bg-light-primary dark:bg-bg-primary rounded w-1/4"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-bg-light-tertiary dark:bg-bg-tertiary rounded w-1/3 mb-3"></div>
            <div className="bg-bg-light-tertiary dark:bg-bg-tertiary rounded-md p-4 space-y-2">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-bg-light-primary dark:bg-bg-primary rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-bg-light-primary dark:bg-bg-primary rounded w-3/4"></div>
                  <div className="h-3 bg-bg-light-primary dark:bg-bg-primary rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State - Only if both APIs fail */}
      {!isLoading && hasError && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-text-light-secondary dark:text-text-secondary mb-4">
            Unable to load latest updates
          </p>
          <Link
            to="/whats-new"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View What&apos;s New Page
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* Content */}
      {!isLoading && !hasError && (
        <div className="space-y-4">
          {/* Latest Announcement - Show if available */}
          {!announcementsError && latestAnnouncement && (
            <LatestAnnouncementCard announcement={latestAnnouncement} />
          )}

          {/* Recent Changes - Show if available */}
          {!infraError && changeLog.length > 0 && (
            <RecentChangesPreview
              changeLog={changeLog}
              servicesData={servicesMap}
              metadata={metadata}
              maxItems={5}
            />
          )}

          {/* Partial failure message */}
          {!announcementsError && announcementsError && !infraError && (
            <p className="text-xs text-text-light-secondary dark:text-text-secondary">
              Latest AWS announcements unavailable. Showing recent changes.
            </p>
          )}
          {!infraError && infraError && !announcementsError && (
            <p className="text-xs text-text-light-secondary dark:text-text-secondary">
              Recent changes unavailable. Showing latest AWS news.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default WhatsNewPreview;
