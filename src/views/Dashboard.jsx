import { Link } from 'react-router-dom';
import { useAWSData } from '../hooks/useAWSData';
import { calculateStats } from '../utils/calculations';
import { formatRelativeTime } from '../utils/formatters';
import Container from '../components/layout/Container';
import StatCard from '../components/common/StatCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import WhatsNewPreview from '../components/dashboard/WhatsNewPreview';

function Dashboard() {
  const { data, isLoading, error, refetch } = useAWSData();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} retry={refetch} />;
  }

  const stats = calculateStats(data);
  const lastUpdated = data?.metadata?.timestamp;

  return (
    <Container>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-primary mb-2">
          AWS Services Dashboard
        </h1>
        <p className="text-text-light-secondary dark:text-text-secondary">
          Real-time AWS infrastructure visualization across all regions and services
        </p>
        {lastUpdated && (
          <p className="text-text-light-secondary dark:text-text-secondary text-sm mt-2">
            Last updated: {formatRelativeTime(lastUpdated)}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="AWS Regions"
          value={stats.totalRegions}
          description="Global infrastructure coverage"
          to="/regions"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="AWS Services"
          value={stats.totalServices}
          description="Complete service catalog"
          to="/services"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatCard
          title="Service Mappings"
          value={stats.totalMappings}
          description="Region × Service combinations"
          to="/coverage"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />

        <StatCard
          title="Report Center"
          value="Export"
          description="Excel and CSV reports available"
          to="/reports"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* What's New Preview */}
        <WhatsNewPreview />

        {/* Quick Actions */}
        <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
          <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/regions"
              className="block p-4 bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg hover:bg-gray-200 dark:hover:bg-bg-primary border border-border-light dark:border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-light-primary dark:text-text-primary">Explore Regions</h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">Browse all {stats.totalRegions} AWS regions</p>
                </div>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/services"
              className="block p-4 bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg hover:bg-gray-200 dark:hover:bg-bg-primary border border-border-light dark:border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-light-primary dark:text-text-primary">Browse Services</h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">View all {stats.totalServices} AWS services</p>
                </div>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/reports"
              className="block p-4 bg-bg-light-tertiary dark:bg-bg-tertiary rounded-lg hover:bg-gray-200 dark:hover:bg-bg-primary border border-border-light dark:border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text-light-primary dark:text-text-primary">Report Center</h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">Excel and CSV export options</p>
                </div>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
