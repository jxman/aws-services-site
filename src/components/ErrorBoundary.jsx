import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * the entire application.
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * Update state when an error is caught
   * This is called during the render phase
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details after error is caught
   * This is called during the commit phase
   */
  componentDidCatch(error, errorInfo) {
    // Log to console in development
    console.error('🚨 Error caught by ErrorBoundary:', error);
    console.error('📍 Error location:', errorInfo.componentStack);

    // Update state with error info
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // TODO: Send error to monitoring service (Sentry, LogRocket, etc.)
    // this.logErrorToService(error, errorInfo);
  }

  /**
   * Reset error state and attempt recovery
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Reload the entire page (hard reset)
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-bg-light dark:bg-bg flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-8 border border-border-light dark:border-border shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">⚠️</div>
              <div>
                <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-primary">
                  Something Went Wrong
                </h1>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary mt-1">
                  Error #{errorCount} • AWS Services Dashboard
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-6">
              <p className="text-text-light-secondary dark:text-text-secondary mb-4">
                We encountered an unexpected error while loading the AWS Services Dashboard.
                This has been logged and we&apos;re working to fix it.
              </p>

              {isDevelopment && error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                    Error Message:
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                    {error.toString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 border border-border-light dark:border-border rounded-md hover:bg-bg-light dark:hover:bg-bg transition-colors font-medium text-text-light-primary dark:text-text-primary"
              >
                🔙 Try Again
              </button>

              <Link
                to="/"
                onClick={this.handleReset}
                className="px-5 py-2.5 border border-border-light dark:border-border rounded-md hover:bg-bg-light dark:hover:bg-bg transition-colors font-medium text-text-light-primary dark:text-text-primary inline-flex items-center"
              >
                🏠 Go to Home
              </Link>
            </div>

            {/* Support Information */}
            <div className="border-t border-border-light dark:border-border pt-4 mb-4">
              <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                If this problem persists, try:
              </p>
              <ul className="text-sm text-text-light-secondary dark:text-text-secondary mt-2 space-y-1 list-disc list-inside">
                <li>Clear your browser cache and cookies</li>
                <li>Try a different browser</li>
                <li>Check your internet connection</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>

            {/* Developer Error Details (Development Only) */}
            {isDevelopment && errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-text-light-secondary dark:text-text-secondary hover:text-primary transition-colors">
                  🔍 Developer Error Details (Development Only)
                </summary>
                <div className="mt-3 p-4 bg-bg-light dark:bg-bg rounded-md border border-border-light dark:border-border">
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-text-light-secondary dark:text-text-secondary mb-1">
                      Error Stack:
                    </p>
                    <pre className="text-xs text-text-light-secondary dark:text-text-secondary overflow-auto p-2 bg-white dark:bg-gray-900 rounded">
                      {error?.stack}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-light-secondary dark:text-text-secondary mb-1">
                      Component Stack:
                    </p>
                    <pre className="text-xs text-text-light-secondary dark:text-text-secondary overflow-auto p-2 bg-white dark:bg-gray-900 rounded">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            {/* App Info */}
            <div className="mt-6 pt-4 border-t border-border-light dark:border-border text-center">
              <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                AWS Services Dashboard v1.0.0
              </p>
            </div>
          </div>
        </div>
      );
    }

    // No error - render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
