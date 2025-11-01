import { useState, useMemo } from 'react';
import { useInfrastructureChanges } from '../hooks/useInfrastructureChanges';
import { useAWSAnnouncements } from '../hooks/useAWSAnnouncements';
import { useServiceNames } from '../hooks/useAWSData';
import WhatsNewHeader from '../components/whats-new/WhatsNewHeader';
import ContentContainer from '../components/whats-new/ContentContainer';
import MobileTabNavigation from '../components/whats-new/MobileTabNavigation';
import { countTotalChanges } from '../utils/whatsNewHelpers';

function WhatsNew() {
  const [activeTab, setActiveTab] = useState('infrastructure');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: infrastructureData, isLoading: infraLoading, error: infraError, refetch: refetchInfra } = useInfrastructureChanges();
  const { data: announcementsData, isLoading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useAWSAnnouncements();
  const { data: servicesData, isLoading: servicesLoading } = useServiceNames();

  const isLoading = infraLoading || announcementsLoading || servicesLoading;
  const hasError = infraError || announcementsError;

  const handleRetry = () => {
    if (infraError) refetchInfra();
    if (announcementsError) refetchAnnouncements();
  };

  // Calculate filtered counts for mobile tabs
  const filteredInfraCount = useMemo(() => {
    if (!infrastructureData?.changeLog) return 0;

    if (!searchQuery) {
      // No search - count all individual changes across all entries
      return countTotalChanges(infrastructureData.changeLog);
    }

    // With search - count individual changes in filtered entries only
    const query = searchQuery.toLowerCase();
    const filteredEntries = infrastructureData.changeLog.filter((entry) => {
      const dateMatch = entry.date.toLowerCase().includes(query);
      const summaryMatch = entry.summary.toLowerCase().includes(query);
      const servicesMatch = entry.changes.newServices?.some((s) =>
        s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)
      );
      return dateMatch || summaryMatch || servicesMatch;
    });
    return countTotalChanges(filteredEntries);
  }, [infrastructureData, searchQuery]);

  const filteredAnnouncementsCount = useMemo(() => {
    if (!searchQuery || !announcementsData?.announcements) {
      return announcementsData?.announcements?.length || 0;
    }

    const query = searchQuery.toLowerCase();
    return announcementsData.announcements.filter((announcement) => {
      const titleMatch = announcement.title.toLowerCase().includes(query);
      const summaryMatch = announcement.summary.toLowerCase().includes(query);
      const categoriesMatch = announcement.categories?.some((cat) =>
        cat.toLowerCase().includes(query)
      );
      return titleMatch || summaryMatch || categoriesMatch;
    }).length;
  }, [announcementsData, searchQuery]);

  // Convert services array to object keyed by code for lookup
  const servicesMap = useMemo(() => {
    if (!servicesData) return {};
    return servicesData.reduce((acc, service) => {
      acc[service.code] = service;
      return acc;
    }, {});
  }, [servicesData]);

  // Enhance infrastructure data with complete services map
  const enhancedInfraData = useMemo(() => {
    if (!infrastructureData) return null;
    return {
      ...infrastructureData,
      services: servicesMap
    };
  }, [infrastructureData, servicesMap]);

  return (
    <div className="min-h-screen bg-bg-light-primary dark:bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WhatsNewHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-800 dark:text-red-200 mb-4">
              Failed to load latest updates
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <MobileTabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                infrastructureCount={filteredInfraCount}
                announcementsCount={filteredAnnouncementsCount}
              />
            </div>

            <ContentContainer
              infrastructureData={enhancedInfraData}
              announcementsData={announcementsData}
              searchQuery={searchQuery}
              activeTab={activeTab}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default WhatsNew;
