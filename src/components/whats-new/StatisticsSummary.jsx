function StatisticsSummary({ infrastructureData, announcementsData }) {
  const metadata = infrastructureData?.metadata || {};
  const changes = metadata.changesSinceInception || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
      {/* Infrastructure Stats */}
      <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-4 border border-border-light dark:border-border">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">
          New Services
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {changes.newServices || 0}
        </div>
        <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
          Since {metadata.created}
        </div>
      </div>

      <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-4 border border-border-light dark:border-border">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">
          Regional Expansions
        </div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {changes.newRegionalServices || 0}
        </div>
        <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
          Service-region mappings
        </div>
      </div>

      {/* AWS Announcements Stats */}
      <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-4 border border-border-light dark:border-border">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">
          Recent Announcements
        </div>
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {announcementsData?.metadata?.count || 0}
        </div>
        <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
          From AWS What's New
        </div>
      </div>

      <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-4 border border-border-light dark:border-border">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">
          Total Services
        </div>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {metadata.totalServices || 0}
        </div>
        <div className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
          Across {metadata.totalRegions || 0} regions
        </div>
      </div>
    </div>
  );
}

export default StatisticsSummary;
