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
            © {currentYear} AWS Services Dashboard. Data sourced from AWS
            Systems Manager Parameter Store.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
