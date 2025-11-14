import Container from "../components/layout/Container";
import { DATA_SOURCE } from "../config/aws-config";

function About() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-light-primary dark:text-text-primary mb-3">
            About AWS Services Dashboard
          </h1>
          <p className="text-lg text-text-light-secondary dark:text-text-secondary max-w-2xl mx-auto">
            Built by a cloud architect, for cloud architects
          </p>
        </div>

        <div className="space-y-6 text-text-light-secondary dark:text-text-secondary">
          {/* About the Creator & Why I Built This - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About the Creator */}
            <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-5 border border-border-light dark:border-border">
              <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-3 flex items-center">
                <span className="mr-2">👤</span> About the Creator
              </h2>

              {/* Profile Picture - Float Left */}
              <img
                src="/profile.png"
                alt="John Xanthopoulos"
                className="w-20 h-20 rounded-full border-3 border-primary shadow-lg float-left mr-4 mb-2"
              />

              {/* Content wraps around image */}
              <h3 className="text-lg font-bold text-text-light-primary dark:text-text-primary mb-1">
                John Xanthopoulos
              </h3>
              <p className="mb-2 text-text-light-primary dark:text-text-primary font-medium text-sm">
                Founder of{" "}
                <a
                  href="https://synepho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Synepho
                </a>
              </p>

              <p className="mb-2 text-sm leading-relaxed">
                I&apos;m an IT Executive at a Fortune 500 company, where I drive
                Cloud strategy and lead a talented team of Global Cloud
                Engineers. With over 20 years of experience in IT leadership and
                a deep passion for AWS architecture and automation, I bring
                enterprise-scale expertise to every project.
              </p>

              <p className="mb-4 text-sm leading-relaxed">
                Beyond my executive role, I&apos;m a hands-on developer who
                builds practical tools that solve real-world cloud architecture
                challenges. <strong>Synepho</strong>—a phonetic adaptation of
                the Greek word for &ldquo;cloud&rdquo;—reflects my commitment to
                making cloud computing more accessible and efficient for
                organizations worldwide.
              </p>

              <a
                href="https://synepho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-light font-medium text-sm"
              >
                Learn more at synepho.com
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
            </section>

            {/* Why I Built This */}
            <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
              <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4 flex items-center">
                <span className="mr-2">💡</span> Why I Built This
              </h2>

              <div className="mb-4 p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg border-l-4 border-primary">
                <p className="italic text-text-light-primary dark:text-text-primary text-sm">
                  &ldquo;Which AWS services are available in which
                  regions?&rdquo;
                </p>
              </div>

              <p className="mb-3 text-text-light-primary dark:text-text-primary font-semibold text-sm">
                As a cloud architect, I was tired of:
              </p>

              <ul className="space-y-2 mb-4 ml-4 text-sm">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>
                    Opening 10+ browser tabs to check service availability
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>
                    Manually building Excel spreadsheets for regional planning
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>Waiting for static documentation to update</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>
                    Searching across multiple AWS pages for the same information
                  </span>
                </li>
              </ul>

              <div className="p-3 bg-primary bg-opacity-10 rounded-lg border border-primary">
                <p className="font-semibold text-text-light-primary dark:text-text-primary text-sm">
                  So I built a tool that solves this — and I&apos;m sharing it
                  with you.
                </p>
                <p className="mt-2 text-sm">
                  Whether you&apos;re designing multi-region applications,
                  planning disaster recovery, or exploring AWS service coverage,
                  this dashboard gives you instant answers.
                </p>
              </div>
            </section>
          </div>

          {/* What is this */}
          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4 flex items-center">
              <span className="mr-2">📊</span> What is this?
            </h2>
            <p className="mb-3 text-text-light-primary dark:text-text-primary">
              A real-time dashboard that tracks AWS service availability across
              all 38 regions and 394+ services.
            </p>
            <p className="mb-4 text-sm">
              Get instant answers to questions like: &ldquo;Is Lambda available
              in ap-south-2?&rdquo; or &ldquo;Which regions support Amazon
              Bedrock?&rdquo;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">38</div>
                <div className="text-xs">AWS Regions</div>
              </div>
              <div className="text-center p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">394+</div>
                <div className="text-xs">Services Tracked</div>
              </div>
              <div className="text-center p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  Daily
                </div>
                <div className="text-xs">Auto Updates</div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4 flex items-center">
              <span className="mr-2">✨</span> Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-start p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <span className="text-xl mr-2">📊</span>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary text-sm mb-1">
                    Real-time Data
                  </h3>
                  <p className="text-xs">Updated daily at 2:00 AM UTC</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <span className="text-xl mr-2">🌍</span>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary text-sm mb-1">
                    Global Coverage
                  </h3>
                  <p className="text-xs">
                    All 38 AWS regions and 394+ services
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <span className="text-xl mr-2">⚡</span>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary text-sm mb-1">
                    Fast Performance
                  </h3>
                  <p className="text-xs">CloudFront edge caching</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <span className="text-xl mr-2">📑</span>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary text-sm mb-1">
                    Excel Export
                  </h3>
                  <p className="text-xs">Download complete reports</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <span className="text-xl mr-2">📱</span>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary text-sm mb-1">
                    Mobile Responsive
                  </h3>
                  <p className="text-xs">Works on all devices</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
                <span className="text-xl mr-2">🔍</span>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary text-sm mb-1">
                    Smart Search
                  </h3>
                  <p className="text-xs">Filter and find instantly</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack - Collapsible */}
          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <details className="group">
              <summary className="cursor-pointer list-none">
                <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary inline-flex items-center">
                  <span className="mr-2">🔧</span> Technology Stack
                  <span className="ml-2 text-xs text-text-light-secondary dark:text-text-secondary">
                    (for developers)
                  </span>
                  <svg
                    className="w-4 h-4 ml-2 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </h2>
              </summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary mb-2 flex items-center text-sm">
                    <span className="mr-2">⚛️</span> Frontend
                  </h3>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> React 18
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> Vite (build
                      tool)
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> Tailwind CSS
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> TanStack
                      Query
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> React Router
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-text-light-primary dark:text-text-primary mb-2 flex items-center text-sm">
                    <span className="mr-2">☁️</span> Infrastructure
                  </h3>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> AWS Lambda
                      (data fetching)
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> AWS S3
                      (storage)
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> CloudFront
                      CDN (distribution)
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> Route53 (DNS)
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span> ACM (SSL
                      certificates)
                    </li>
                  </ul>
                </div>
              </div>
            </details>
          </section>

          {/* Data Source */}
          <section className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4 flex items-center">
              <span className="mr-2">📡</span> Data Source
            </h2>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong className="text-text-light-primary dark:text-text-primary">
                    Source:
                  </strong>
                  <span className="ml-1">
                    AWS Systems Manager Parameter Store
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong className="text-text-light-primary dark:text-text-primary">
                    Updates:
                  </strong>
                  <span className="ml-1">Daily at 2:00 AM UTC</span>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <strong className="text-text-light-primary dark:text-text-primary">
                    Delivery:
                  </strong>
                  <span className="ml-1">CloudFront CDN</span>
                </div>
              </div>
            </div>

            <details className="p-3 bg-bg-light dark:bg-bg-tertiary rounded-lg">
              <summary className="cursor-pointer font-semibold text-text-light-primary dark:text-text-primary text-sm">
                View technical details →
              </summary>
              <div className="mt-3 space-y-2 text-xs">
                <p>
                  Data is collected by an automated Lambda function that fetches
                  the latest infrastructure metadata from AWS Systems Manager
                  Parameter Store and distributes it via CloudFront CDN for fast
                  global access.
                </p>
                <div className="flex flex-col gap-1">
                  <a
                    href={DATA_SOURCE.FETCHER_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-light"
                  >
                    View AWS Infrastructure Fetcher
                    <svg
                      className="w-3 h-3 ml-1"
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
                  <a
                    href={DATA_SOURCE.DATA_CONTRACT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-light"
                  >
                    View Data Contract
                    <svg
                      className="w-3 h-3 ml-1"
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
              </div>
            </details>
          </section>

          {/* Support This Project */}
          <section className="bg-gradient-to-br from-bg-light-secondary to-bg-light dark:from-bg-secondary dark:to-bg-tertiary rounded-lg p-6 border border-border-light dark:border-border">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-3 flex items-center justify-center">
              <span className="mr-2">☕</span> Support This Project
            </h2>
            <p className="mb-4 text-center max-w-2xl mx-auto text-sm">
              If you find this dashboard helpful, consider buying me a coffee.
              Your support inspires continued updates and new features.
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.buymeacoffee.com/synepho"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#FFDD00] hover:bg-[#FFED4E] text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border-2 border-gray-900"
              >
                <span className="text-xl mr-2">☕</span>
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
