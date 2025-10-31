import Container from "../components/layout/Container";
import { DATA_SOURCE } from "../config/aws-config";

function About() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-primary mb-6">
          About AWS Services Dashboard
        </h1>

        <div className="space-y-6 text-text-light-secondary dark:text-text-secondary">
          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Why I Built This
            </h2>
            <p className="mb-4">
              As a cloud architect, I found myself constantly needing to answer a seemingly simple question during the design and planning phase: <strong>"Which AWS services are available in which regions?"</strong>
            </p>
            <p className="mb-4">
              In today's ever-growing AWS Cloud landscape, this information is critical for making informed decisions about regional deployments, disaster recovery strategies, and multi-region architectures. Yet traditionally, this effort required countless searches, multiple site lookups, and manually piecing together information from various sources.
            </p>
            <p className="mb-4">
              What I really needed was simple: <strong>the data in an Excel spreadsheet</strong> where I could quickly review services, compare regions, and make strategic deployment decisions without jumping between multiple tabs and documentation pages.
            </p>
            <p>
              So I built this tool. And now I'm sharing it with the wider community, hoping that others find it useful in their day-to-day cloud architecture efforts and cloud development journey. Whether you're designing multi-region applications, planning disaster recovery strategies, or simply exploring AWS service coverage, this dashboard is here to help.
            </p>
          </section>

          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
              What is this?
            </h2>
            <p className="mb-4">
              AWS Services Dashboard is a real-time visualization tool that
              displays AWS infrastructure data across all 38 regions and 394+
              services. It provides an interactive interface to explore AWS
              service availability, regional coverage, and infrastructure
              patterns.
            </p>
            <p>
              This dashboard replaces traditional Excel-based reporting with a
              modern, web-based interface that updates automatically every day.
            </p>
          </section>

          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Data Source
            </h2>
            <p className="mb-4">
              All data is sourced directly from{" "}
              <strong>AWS Systems Manager Parameter Store</strong>, which
              provides authoritative information about AWS regions and service
              availability.
            </p>
            <p className="mb-4">
              The data is collected by an automated Lambda function that runs
              daily at 2:00 AM UTC, fetching the latest infrastructure metadata
              and distributing it via CloudFront CDN for fast global access.
            </p>
            <div className="mt-4 space-y-2">
              <a
                href={DATA_SOURCE.FETCHER_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-light"
              >
                View AWS Infrastructure Fetcher
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <br />
              <a
                href={DATA_SOURCE.DATA_CONTRACT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-light"
              >
                View Data Contract
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </section>

          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-text-light-primary dark:text-text-primary mb-2">
                  Frontend
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• React 18</li>
                  <li>• Vite (build tool)</li>
                  <li>• Tailwind CSS</li>
                  <li>• TanStack Query</li>
                  <li>• React Router</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text-light-primary dark:text-text-primary mb-2">
                  Infrastructure
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• AWS Lambda (data fetching)</li>
                  <li>• AWS S3 (storage)</li>
                  <li>• CloudFront CDN (distribution)</li>
                  <li>• Route53 (DNS)</li>
                  <li>• ACM (SSL certificates)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Features
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Real-time data:</strong> Automatically updated daily
                  at 2:00 AM UTC
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Global coverage:</strong> All 38 AWS regions and 394+
                  services
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Fast performance:</strong> CloudFront edge caching for
                  global users
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Excel export:</strong> Download complete reports in
                  Excel format
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  <strong>Mobile responsive:</strong> Works on all devices and
                  screen sizes
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
              Support This Project
            </h2>
            <p className="mb-4">
              If you find this dashboard helpful in your cloud architecture work and feel like acknowledging my development and hosting efforts, consider buying me a cup of coffee. Your support goes a long way to inspire continued updates, new features, and the development of other cloud developer tools.
            </p>
            <div className="flex justify-center mt-6">
              <a
                href="https://www.buymeacoffee.com/synepho"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#FFDD00] hover:bg-[#FFED4E] text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border-2 border-gray-900"
              >
                <span className="text-2xl mr-2">☕</span>
                <span>Buy me a coffee</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}

export default About;
