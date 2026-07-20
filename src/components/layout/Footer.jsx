import { DATA_SOURCE } from "../../config/aws-config";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-light-secondary dark:bg-bg-secondary border-t border-border-light dark:border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-4">
              AWS Services Dashboard
            </h3>
            <p className="text-text-light-secondary dark:text-text-secondary text-sm">
              Real-time AWS infrastructure visualization across 38 regions and
              394+ services. Data updated daily at 2:00 AM UTC.
            </p>
            <a
              href="https://buymeacoffee.com/synepho"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-amber-500 dark:text-yellow-400 hover:text-amber-600 dark:hover:text-yellow-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M10 2v2"></path>
                <path d="M14 2v2"></path>
                <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"></path>
                <path d="M6 2v2"></path>
              </svg>
              Buy me a coffee
            </a>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Data Source
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={DATA_SOURCE.FETCHER_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light-secondary dark:text-text-secondary hover:text-primary text-sm transition-colors"
                >
                  AWS Infrastructure Fetcher
                </a>
              </li>
              <li>
                <a
                  href={DATA_SOURCE.DATA_CONTRACT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light-secondary dark:text-text-secondary hover:text-primary text-sm transition-colors"
                >
                  Data Contract
                </a>
              </li>
              <li>
                <a
                  href="/reports/aws-service-report-latest.xlsx"
                  download
                  className="text-text-light-secondary dark:text-text-secondary hover:text-primary text-sm transition-colors"
                >
                  Download Excel Report
                </a>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Status
            </h3>
            <div className="space-y-2 text-sm text-text-light-secondary dark:text-text-secondary">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-status-success rounded-full mr-2"></div>
                <span>Data Source: Operational</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-status-success rounded-full mr-2"></div>
                <span>CloudFront CDN: Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-status-success rounded-full mr-2"></div>
                <span>Daily Updates: Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border-light dark:border-border">
          <p className="text-center text-text-light-secondary dark:text-text-secondary text-sm">
            © {currentYear} AWS Services Dashboard by Synepho. Data from AWS Systems Manager Parameter Store.
            Not affiliated with AWS, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
