function MobileTabNavigation({ activeTab, onTabChange, infrastructureCount, announcementsCount }) {
  return (
    <div className="flex space-x-2 border-b border-border-light dark:border-border">
      <button
        onClick={() => onTabChange('infrastructure')}
        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
          activeTab === 'infrastructure'
            ? 'text-primary border-b-2 border-primary'
            : 'text-text-light-secondary dark:text-text-secondary hover:text-text-light-primary dark:hover:text-text-primary'
        }`}
      >
        <span>Recent Changes</span>
        {infrastructureCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {infrastructureCount}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange('announcements')}
        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
          activeTab === 'announcements'
            ? 'text-primary border-b-2 border-primary'
            : 'text-text-light-secondary dark:text-text-secondary hover:text-text-light-primary dark:hover:text-text-primary'
        }`}
      >
        <span>Announcements</span>
        {announcementsCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
            {announcementsCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default MobileTabNavigation;
