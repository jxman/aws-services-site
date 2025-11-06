import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Loading from '../components/common/Loading';
import { useAWSData, useServiceNames } from '../hooks/useAWSData';
import { formatRelativeTime } from '../utils/formatters';
import { calculateCoverage } from '../utils/calculations';

function Reports() {
  const { data, isLoading } = useAWSData();
  const { data: serviceNamesData, isLoading: isLoadingNames } = useServiceNames();
  const lastUpdated = data?.metadata?.timestamp;

  // Prepare regions data
  const regionsData = useMemo(() => {
    if (!data) return [];

    const regions = data.regions?.regions || [];
    const servicesByRegion = data.servicesByRegion?.byRegion || {};
    const totalServices = data.services?.services?.length || 0;

    return regions.map((region) => {
      const regionServices = servicesByRegion[region.code]?.services || [];
      const serviceCount = regionServices.length;
      const coverage = calculateCoverage(serviceCount, totalServices);

      return {
        code: region.code,
        name: region.name || region.code,
        serviceCount,
        totalServices,
        coverage,
      };
    }).sort((a, b) => b.serviceCount - a.serviceCount);
  }, [data]);

  // Prepare services data
  const servicesData = useMemo(() => {
    if (!data || !serviceNamesData) return [];

    const services = data.services?.services || [];
    const servicesByRegion = data.servicesByRegion?.byRegion || {};
    const totalRegions = Object.keys(servicesByRegion).length;

    const nameMap = Object.create(null);
    serviceNamesData.forEach(service => {
      nameMap[service.code] = service.name;
    });

    return services.map((serviceCode) => {
      const regionsWithService = Object.keys(servicesByRegion).filter((regionCode) =>
        (servicesByRegion[regionCode]?.services || []).includes(serviceCode)
      );

      const availableRegions = regionsWithService.length;
      const coverage = calculateCoverage(availableRegions, totalRegions);

      return {
        code: serviceCode,
        name: nameMap[serviceCode] || serviceCode,
        availableRegions,
        totalRegions,
        coverage,
      };
    }).sort((a, b) => {
      const nameA = (a.name || a.code || '').toString();
      const nameB = (b.name || b.code || '').toString();
      return nameA.localeCompare(nameB);
    });
  }, [data, serviceNamesData]);

  // Prepare coverage matrix data
  const matrixData = useMemo(() => {
    if (!data || !serviceNamesData) return { regions: [], services: [], matrix: {} };

    const regions = (data.regions?.regions || []).map(region => ({
      code: region.code,
      name: region.name || region.code,
    }));

    const servicesByRegion = data.servicesByRegion?.byRegion || {};

    const nameMap = Object.create(null);
    serviceNamesData.forEach(service => {
      nameMap[service.code] = service.name;
    });

    const services = (data.services?.services || []).map(serviceCode => ({
      code: serviceCode,
      name: nameMap[serviceCode] || serviceCode,
    }));

    const matrix = Object.create(null);
    services.forEach(service => {
      matrix[service.code] = Object.create(null);
      regions.forEach(region => {
        const regionServices = servicesByRegion[region.code]?.services || [];
        matrix[service.code][region.code] = regionServices.includes(service.code);
      });
    });

    return { regions, services, matrix };
  }, [data, serviceNamesData]);

  const exportRegionsCSV = () => {
    const headers = ['Region Name', 'Region Code', 'Services Available', 'Total Services', 'Coverage %'];
    const rows = regionsData.map(region => [
      region.name,
      region.code,
      region.serviceCount,
      region.totalServices,
      region.coverage.toFixed(1),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aws-regions-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportServicesCSV = () => {
    const headers = ['Service Name', 'Service Code', 'Available Regions', 'Total Regions', 'Coverage %'];
    const rows = servicesData.map(service => [
      service.name,
      service.code,
      service.availableRegions,
      service.totalRegions,
      service.coverage.toFixed(1),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aws-services-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCoverageCSV = () => {
    const headers = ['Service', 'Service Code', ...matrixData.regions.map(r => r.code)];
    const rows = matrixData.services.map(service => [
      service.name,
      service.code,
      ...matrixData.regions.map(region =>
        matrixData.matrix[service.code]?.[region.code] ? 'Yes' : 'No'
      ),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aws-coverage-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || isLoadingNames) {
    return <Loading message="Loading reports data..." />;
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-2">Report Center</h1>
        <p className="text-text-light-secondary dark:text-text-secondary text-lg">
          Export AWS infrastructure data in various formats
        </p>
        {lastUpdated && (
          <p className="text-text-light-secondary dark:text-text-secondary text-sm mt-2">
            Data last updated: {formatRelativeTime(lastUpdated)}
          </p>
        )}
      </div>

      {/* Featured Excel Report */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-light-primary dark:text-text-primary mb-2">
                Complete Excel Report
              </h2>
              <p className="text-text-light-secondary dark:text-text-secondary mb-4">
                Pre-formatted Excel workbook with multiple worksheets, statistics, and charts. Perfect for analysis and presentations.
              </p>
              <a
                href="/reports/aws-service-report-latest.xlsx"
                download
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Excel Report
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Exports */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-4">Quick CSV Exports</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Regions CSV */}
          <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-bg-light-tertiary dark:bg-bg-tertiary p-2 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text-light-primary dark:text-text-primary">Regions</h3>
            </div>
            <p className="text-text-light-secondary dark:text-text-secondary text-sm mb-4">
              All regions with service counts and coverage
            </p>
            <button
              onClick={exportRegionsCSV}
              className="w-full px-4 py-2 bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-primary dark:text-text-primary border border-border-light dark:border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <Link
              to="/regions"
              className="block mt-2 text-center text-sm text-primary hover:text-primary-light"
            >
              View & filter regions →
            </Link>
          </div>

          {/* Services CSV */}
          <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-bg-light-tertiary dark:bg-bg-tertiary p-2 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text-light-primary dark:text-text-primary">Services</h3>
            </div>
            <p className="text-text-light-secondary dark:text-text-secondary text-sm mb-4">
              All services with regional availability
            </p>
            <button
              onClick={exportServicesCSV}
              className="w-full px-4 py-2 bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-primary dark:text-text-primary border border-border-light dark:border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <Link
              to="/services"
              className="block mt-2 text-center text-sm text-primary hover:text-primary-light"
            >
              View & filter services →
            </Link>
          </div>

          {/* Coverage Matrix CSV */}
          <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-bg-light-tertiary dark:bg-bg-tertiary p-2 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text-light-primary dark:text-text-primary">Coverage Matrix</h3>
            </div>
            <p className="text-text-light-secondary dark:text-text-secondary text-sm mb-4">
              Complete service × region availability matrix
            </p>
            <button
              onClick={exportCoverageCSV}
              className="w-full px-4 py-2 bg-bg-light-tertiary dark:bg-bg-tertiary text-text-light-primary dark:text-text-primary border border-border-light dark:border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <Link
              to="/coverage"
              className="block mt-2 text-center text-sm text-primary hover:text-primary-light"
            >
              View coverage matrix →
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Reports Info */}
      <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg p-6 border border-border-light dark:border-border">
        <h2 className="text-xl font-bold text-text-light-primary dark:text-text-primary mb-3">Detailed Reports</h2>
        <p className="text-text-light-secondary dark:text-text-secondary mb-4">
          For region-specific or service-specific reports with summary details, click on any region or service card from the
          <Link to="/regions" className="text-primary hover:text-primary-light"> Regions </Link>
          or
          <Link to="/services" className="text-primary hover:text-primary-light"> Services </Link>
          pages. Each detail view includes an export option with complete metadata.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-light-secondary dark:text-text-secondary">
          <div>
            <div className="font-semibold text-text-light-primary dark:text-text-primary mb-2">Region Reports Include:</div>
            <ul className="space-y-1">
              <li>• Region metadata and launch date</li>
              <li>• Availability zones</li>
              <li>• Complete service list</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-text-light-primary dark:text-text-primary mb-2">Service Reports Include:</div>
            <ul className="space-y-1">
              <li>• Service details and coverage</li>
              <li>• Regional availability counts</li>
              <li>• Complete region list</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Reports;
