import { useMemo, useState, useEffect } from 'react';
import AnnouncementCard from './AnnouncementCard';

function AnnouncementsList({ announcements, searchQuery, scrollContainerRef }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery) return announcements;

    const query = searchQuery.toLowerCase();
    return announcements.filter((announcement) => {
      const titleMatch = announcement.title.toLowerCase().includes(query);
      const summaryMatch = announcement.summary.toLowerCase().includes(query);
      const categoriesMatch = announcement.categories?.some((cat) =>
        cat.toLowerCase().includes(query)
      );
      return titleMatch || summaryMatch || categoriesMatch;
    });
  }, [announcements, searchQuery]);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Scroll to top when search query changes
  useEffect(() => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [searchQuery, scrollContainerRef]);

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">
          {searchQuery ? '🔍' : '📰'}
        </div>
        <p className="text-text-light-secondary dark:text-text-secondary mb-2">
          {searchQuery
            ? 'No announcements match your search'
            : 'No AWS announcements available'}
        </p>
        {!searchQuery && (
          <a
            href="https://aws.amazon.com/new/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Visit aws.amazon.com/new for latest updates
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {currentAnnouncements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAnnouncements.length)} of {filteredAnnouncements.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-secondary dark:text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                const showEllipsis =
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return (
                    <span key={page} className="px-2 text-text-light-secondary dark:text-text-secondary">
                      ...
                    </span>
                  );
                }

                if (!showPage) {
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-primary dark:text-text-primary hover:bg-bg-light-secondary dark:hover:bg-bg-secondary'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-secondary dark:text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnouncementsList;
