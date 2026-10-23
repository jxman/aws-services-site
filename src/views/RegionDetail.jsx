import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import NotFound from './NotFound';
import { useAWSData, useServiceNames } from '../hooks/useAWSData';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildAwsIndex, safeExternalUrl } from '../utils/awsIndex';
import { regionPageMeta, servicePath } from '../utils/seo';
import { calculateCoverage } from '../utils/calculations';
import { formatDate, formatNumber, formatPercentage } from '../utils/formatters';
import { trackEvent } from '../utils/analytics';

function RegionDetail() {
  const { code } = useParams();
  const { data, isLoading, isError, error, refetch } = useAWSData();
  const { data: serviceNamesData, isLoading: isLoadingNames } = useServiceNames();

  const index = useMemo(
    () => (data && serviceNamesData ? buildAwsIndex(data, serviceNamesData) : null),
    [data, serviceNamesData]
  );

  const region = index?.regionByCode[code];

  const { availableServices, unavailableServices } = useMemo(() => {
    if (!index || !region) return { availableServices: [], unavailableServices: [] };
    const available = new Set(region.services);
    return {
      availableServices: index.services.filter((service) => available.has(service.code)),
      unavailableServices: index.services.filter((service) => !available.has(service.code)),
    };
  }, [index, region]);

  const totalServices = index?.services.length || 0;
  const coverage = calculateCoverage(availableServices.length, totalServices);

  usePageMeta(
    region
      ? regionPageMeta(region, availableServices.length)
      : { title: `AWS Services in ${code}` }
  );

  const exportToCSV = () => {
    trackEvent('file_export', { file_type: 'csv', report_name: 'region_detail', source: 'region_page' });

    const summarySection = [
      ['AWS Region Report'],
      [''],
      ['Region Name', region.name],
      ['Region Code', region.code],
      ['Availability Zones', region.availabilityZones],
      ['Launch Date', formatDate(region.launchDate)],
      ['Total Services Available', availableServices.length],
      ...(region.blogUrl ? [['Launch Blog URL', region.blogUrl]] : []),
      [''],
      ['Generated', new Date().toISOString().split('T')[0]],
      [''],
      [''],
    ];

    const headers = ['Service Name', 'Service Code'];
    const rows = availableServices.map((service) => [service.name, service.code]);

    const csvContent = [
      ...summarySection.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${region.code}-services-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || isLoadingNames) {
    return <Loading message="Loading region data..." />;
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage error={error} onRetry={refetch} />
      </Container>
    );
  }

  if (!region) {
    return <NotFound />;
  }

  const meta = regionPageMeta(region, availableServices.length);
  const safeBlogUrl = safeExternalUrl(region.blogUrl);
  const blogUrl = safeBlogUrl && safeBlogUrl.startsWith('https://') ? safeBlogUrl : null;

  return (
    <Container>
      <nav className="mb-4 text-sm text-text-light-secondary dark:text-text-secondary" aria-label="Breadcrumb">
        <Link to="/regions" className="text-primary hover:text-primary-light">Regions</Link>
        <span className="mx-2">/</span>
        <span>{region.code}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-2">{meta.heading}</h1>
        <p className="text-text-light-secondary dark:text-text-secondary text-lg">
          {formatNumber(availableServices.length)} of {formatNumber(totalServices)} AWS services are available in{' '}
          {region.name} (<span className="font-mono">{region.code}</span>).
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Services Available</div>
          <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
            {formatNumber(availableServices.length)}
          </div>
        </div>
        <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Coverage</div>
          <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
            {formatPercentage(coverage)}
          </div>
        </div>
        <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Availability Zones</div>
          <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
            {region.availabilityZones} AZs
          </div>
        </div>
        <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary mb-1">Launch Date</div>
          <div className="text-lg font-semibold text-text-light-primary dark:text-text-primary">
            {formatDate(region.launchDate)}
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
        {blogUrl && (
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
          >
            Read the region launch blog post
          </a>
        )}
      </div>

      <ServiceList title={`Services available in ${region.name}`} services={availableServices} />

      {unavailableServices.length > 0 && (
        <ServiceList title={`Services not yet available in ${region.name}`} services={unavailableServices} />
      )}
    </Container>
  );
}

function ServiceList({ title, services }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-primary mb-3">
        {title} ({formatNumber(services.length)})
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {services.map((service) => (
          <li key={service.code}>
            <Link
              to={servicePath(service.code)}
              className="block px-4 py-2 bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg hover:border-primary transition-colors"
            >
              <span className="block text-sm font-medium text-text-light-primary dark:text-text-primary">{service.name}</span>
              <span className="block text-xs text-text-light-secondary dark:text-text-secondary font-mono">{service.code}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RegionDetail;
