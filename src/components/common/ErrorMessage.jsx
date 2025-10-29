function ErrorMessage({ error, retry }) {
  const errorMessage = error?.message || 'An unexpected error occurred';

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md w-full bg-bg-light-secondary dark:bg-bg-secondary border border-status-error rounded-lg p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-status-error/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-status-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h3 className="text-xl font-bold text-text-light-primary dark:text-text-primary text-center mb-2">
          Failed to Load Data
        </h3>

        {/* Error Message */}
        <p className="text-text-light-secondary dark:text-text-secondary text-center mb-6">
          {errorMessage}
        </p>

        {/* Retry Button */}
        {retry && (
          <button
            onClick={retry}
            className="w-full bg-primary hover:bg-primary-dark text-white dark:text-bg-primary font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        )}

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-border-light dark:border-border">
          <p className="text-text-light-secondary dark:text-text-secondary text-sm text-center">
            If this issue persists, the data source may be temporarily unavailable.
            Data is updated daily at 2:00 AM UTC.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
