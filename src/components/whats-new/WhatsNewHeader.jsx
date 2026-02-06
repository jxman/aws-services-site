function WhatsNewHeader({ searchQuery, onSearchChange }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-light-primary dark:text-text-primary">
            What&apos;s New with AWS
          </h1>
          <p className="mt-2 text-text-light-secondary dark:text-text-secondary">
            Track AWS infrastructure changes and latest product announcements
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search (comma-separated)..."
            maxLength={500}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border bg-bg-light-secondary dark:bg-bg-secondary text-text-light-primary dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default WhatsNewHeader;
