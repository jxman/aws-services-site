import { useMemo, useRef } from 'react';
import TimelineView from './infrastructure/TimelineView';
import AnnouncementsList from './announcements/AnnouncementsList';
import { countTotalChanges } from '../../utils/whatsNewHelpers';
import { parseSearchTerms, matchesAnyTerm } from '../../utils/searchUtils';

function ContentContainer({ infrastructureData, announcementsData, searchQuery, activeTab }) {
  const announcementsScrollRef = useRef(null);
  // Calculate filtered counts for search result display
  const filteredInfraCount = useMemo(() => {
    if (!infrastructureData?.changeLog) return 0;

    const terms = parseSearchTerms(searchQuery);
    if (terms.length === 0) {
      return countTotalChanges(infrastructureData.changeLog);
    }

    const filteredEntries = infrastructureData.changeLog.filter((entry) => {
      const dateMatch = matchesAnyTerm(entry.date, terms);
      const summaryMatch = matchesAnyTerm(entry.summary, terms);
      const servicesMatch = entry.changes.newServices?.some((s) =>
        matchesAnyTerm(s.name, terms) || matchesAnyTerm(s.code, terms)
      );
      return dateMatch || summaryMatch || servicesMatch;
    });
    return countTotalChanges(filteredEntries);
  }, [infrastructureData, searchQuery]);

  const filteredAnnouncementsCount = useMemo(() => {
    if (!announcementsData?.announcements) {
      return 0;
    }

    const terms = parseSearchTerms(searchQuery);
    if (terms.length === 0) {
      return announcementsData.announcements.length;
    }

    return announcementsData.announcements.filter((announcement) => {
      const titleMatch = matchesAnyTerm(announcement.title, terms);
      const summaryMatch = matchesAnyTerm(announcement.summary, terms);
      const categoriesMatch = announcement.categories?.some((cat) =>
        matchesAnyTerm(cat, terms)
      );
      return titleMatch || summaryMatch || categoriesMatch;
    }).length;
  }, [announcementsData, searchQuery]);

  // Total counts (used when not searching)
  const totalInfraCount = useMemo(() => {
    return countTotalChanges(infrastructureData?.changeLog || []);
  }, [infrastructureData]);

  const totalAnnouncementsCount = announcementsData?.announcements?.length || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Infrastructure Panel */}
      <div className={`${activeTab === 'announcements' ? 'hidden lg:block' : ''}`}>
        <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg border border-border-light dark:border-border flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between p-4 sm:p-6 pb-4 border-b border-border-light dark:border-border flex-shrink-0">
            <h2 className="text-xl font-bold text-text-light-primary dark:text-text-primary">
              Recent Changes
            </h2>
            {searchQuery ? (
              <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                {filteredInfraCount} of {totalInfraCount} match
              </span>
            ) : (
              <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                {totalInfraCount} total
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4">
            <TimelineView
              changeLog={infrastructureData?.changeLog || []}
              searchQuery={searchQuery}
              servicesData={infrastructureData?.services || {}}
            />
          </div>
        </div>
      </div>

      {/* Announcements Panel */}
      <div className={`${activeTab === 'infrastructure' ? 'hidden lg:block' : ''}`}>
        <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg border border-border-light dark:border-border flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between p-4 sm:p-6 pb-4 border-b border-border-light dark:border-border flex-shrink-0">
            <h2 className="text-xl font-bold text-text-light-primary dark:text-text-primary">
              AWS Announcements
            </h2>
            {searchQuery ? (
              <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                {filteredAnnouncementsCount} of {totalAnnouncementsCount} match
              </span>
            ) : (
              <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                {totalAnnouncementsCount} recent
              </span>
            )}
          </div>
          <div ref={announcementsScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4">
            <AnnouncementsList
              announcements={announcementsData?.announcements || []}
              searchQuery={searchQuery}
              scrollContainerRef={announcementsScrollRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentContainer;
