import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import NotFound from './NotFound';
import { useAWSData, useServiceNames } from '../hooks/useAWSData';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildAwsIndex } from '../utils/awsIndex';
import { regionPath, servicePageMeta } from '../utils/seo';
import { calculateCoverage } from '../utils/calculations';
import { formatNumber, formatPercentage } from '../utils/formatters';
import { trackEvent } from '../utils/analytics';

function ServiceDetail() {
  const { code } = useParams();
  const { data, isLoading, isError, error, refetch } = useAWSData();
  const { data: serviceNamesData, isLoading: isLoadingNames } = useServiceNames();

  const index = useMemo(
    () => (data && serviceNamesData ? buildAwsIndex(data, serviceNamesData) : null),
    [data, serviceNamesData]
  );

  const service = index?.serviceByCode[code];

  const { availableRegions, unavailableRegions } = useMemo(() => {
    if (!index || !service) return { availableRegions: [], unavailableRegions: [] };
    const available = new Set(service.regions);
    return {
      availableRegions: index.regions.filter((region) => available.has(region.code)),
      unavailableRegions: index.regions.filter((region) => !available.has(region.code)),
    };
  }, [index, service]);

  const totalRegions = index?.regions.length || 0;
  const coverage = calculateCoverage(availableRegions.length, totalRegions);

  usePageMeta(
    service
      ? servicePageMeta(service, availableRegions.length, totalRegions)
      : { title: `${code} – AWS Region Availability` }
  );

  const exportToCSV = () => {
    trackEvent('file_export', { file_type: 'csv', report_name: 'service_detail', source: 'service_page' });

    const summarySection = [
      ['AWS Service Report'],
      [''],
      ['Service Name', service.name],
      ['Service Code', service.code],
      ['Available Regions', availableRegions.length],
      ['Total Regions', totalRegions],
      ['Coverage', formatPercentage(coverage)],
      [''],
      ['Generated', new Date().toISOString().split('T')[0]],
      [''],
      [''],
    ];

    const headers = ['Region Name', 'Region Code'];
    const rows = availableRegions.map((region) => [region.name, region.code]);

    const csvContent = [
      ...summarySection.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${service.code}-regions-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || isLoadingNames) {
    return <Loading message="Loading service data..." />;
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage error={error} onRetry={refetch} />
      </Container>
    );
  }

  if (!service) {
    return <NotFound />;
  }

  const meta = servicePageMeta(service, availableRegions.length, totalRegions);

  return (
    <Container>
      <nav className="mb-4 text-sm text-text-light-secondary dark:text-text-secondary" aria-label="Breadcrumb">
        <Link to="/services" className="text-primary hover:text-primary-light">Services</Link>
        <span className="mx-2">/</span>
        <span>{service.code}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-2">{meta.heading}</h1>
        <p className="text-text-light-secondary dark:text-text-secondary text-lg">
          {service.name} (<span className="font-mono">{service.code}</span>) is available in{' '}
          {formatNumber(availableRegions.length)} of {formatNumber(totalRegions)} AWS regions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-xl">
        <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Available Regions</div>
          <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
            {formatNumber(availableRegions.length)} / {formatNumber(totalRegions)}
          </div>
        </div>
        <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Coverage</div>
          <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
            {formatPercentage(coverage)}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <RegionList title={`Regions where ${service.name} is available`} regions={availableRegions} />

      {unavailableRegions.length > 0 && (
        <RegionList title={`Regions where ${service.name} is not available`} regions={unavailableRegions} />
      )}
    </Container>
  );
}

function RegionList({ title, regions }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-3">
        {title} ({formatNumber(regions.length)})
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {regions.map((region) => (
          <li key={region.code}>
            <Link
              to={regionPath(region.code)}
              className="block px-4 py-2 bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg hover:border-primary transition-colors"
            >
              <span className="block text-sm font-medium text-text-light-primary dark:text-text-primary">{region.name}</span>
              <span className="block text-xs text-text-light-secondary dark:text-text-secondary font-mono">{region.code}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ServiceDetail;
