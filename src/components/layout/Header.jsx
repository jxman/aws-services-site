import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-bg-light-secondary dark:bg-bg-secondary border-b border-border-light dark:border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-2xl font-bold text-primary">AWS</div>
              <div className="text-lg sm:text-xl font-semibold text-text-light-primary dark:text-text-primary">
                Services Dashboard
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/regions"
              className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Regions
            </Link>
            <Link
              to="/services"
              className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              to="/coverage"
              className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Coverage
            </Link>
            <Link
              to="/whats-new"
              className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              What's New
            </Link>
            <Link
              to="/about"
              className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Theme Toggle and Report Center */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-bg-light-tertiary dark:bg-bg-tertiary hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                // Sun icon for light mode
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Report Center Button */}
            <Link
              to="/reports"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-white dark:hover:text-bg-primary transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Report Center
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-bg-light-tertiary dark:bg-bg-tertiary hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // Close icon
                <svg
                  className="w-6 h-6 text-text-light-primary dark:text-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="w-6 h-6 text-text-light-primary dark:text-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-light dark:border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1"
              >
                Dashboard
              </Link>
              <Link
                to="/regions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1"
              >
                Regions
              </Link>
              <Link
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1"
              >
                Services
              </Link>
              <Link
                to="/coverage"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1"
              >
                Coverage
              </Link>
              <Link
                to="/whats-new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1"
              >
                What's New
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-light-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1"
              >
                About
              </Link>
              <Link
                to="/reports"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-white dark:hover:text-bg-primary transition-colors w-fit"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Report Center
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
