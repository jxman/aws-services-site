import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-primary">AWS</div>
              <div className="text-xl font-semibold text-text-primary">
                Services Dashboard
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/regions"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Regions
            </Link>
            <Link
              to="/services"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              to="/coverage"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Coverage
            </Link>
            <Link
              to="/about"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Button Link to Report Center */}
          <div className="flex items-center">
            <Link
              to="/reports"
              className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:text-bg-primary transition-colors"
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
