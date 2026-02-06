import { useState, useMemo } from 'react';
import Container from '../components/layout/Container';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAWSData, useServiceNames } from '../hooks/useAWSData';
import { parseSearchTerms, matchesSearchTerms } from '../utils/searchUtils';

function Coverage() {
  const { data, isLoading, isError, error, refetch } = useAWSData();
  const { data: serviceNamesData, isLoading: isLoadingNames } = useServiceNames();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

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

  const filteredServices = useMemo(() => {
    let filtered = matrixData.services;

    const terms = parseSearchTerms(searchTerm);
    if (terms.length > 0) {
      filtered = filtered.filter((service) =>
        matchesSearchTerms(service, ['name', 'code'], terms)
      );
    }

    if (showAvailableOnly) {
      filtered = filtered.filter(service => {
        return matrixData.regions.some(region =>
          matrixData.matrix[service.code]?.[region.code]
        );
      });
    }

    return filtered;
  }, [matrixData, searchTerm, showAvailableOnly]);

  const exportToCSV = () => {
    const headers = ['Service', 'Service Code', ...matrixData.regions.map(r => r.code)];
    const rows = filteredServices.map(service => [
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
    return <Loading message="Loading coverage matrix..." />;
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage error={error} onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container className="max-w-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-2">Coverage Matrix</h1>
        <p className="text-text-light-secondary dark:text-text-secondary text-lg">
          Service × Region availability for {matrixData.services.length} AWS services across {matrixData.regions.length} regions
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search services (comma-separated)..."
            maxLength={500}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg text-text-light-primary dark:text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <label className="flex items-center gap-2 text-text-light-secondary dark:text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Show services with availability only</span>
        </label>

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

      <div className="text-text-light-secondary dark:text-text-secondary mb-4">
        Showing {filteredServices.length} of {matrixData.services.length} services
      </div>

      <div className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)] relative">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-bg-light-tertiary dark:bg-bg-tertiary z-[5]">
              <tr>
                <th className="sticky left-0 bg-bg-light-tertiary dark:bg-bg-tertiary px-4 py-3 text-left text-text-light-primary dark:text-text-primary font-semibold border-b border-r border-border-light dark:border-border min-w-[250px] z-[6]">
                  Service
                </th>
                {matrixData.regions.map(region => (
                  <th
                    key={region.code}
                    className="px-2 py-3 text-center text-text-light-primary dark:text-text-primary font-semibold border-b border-border-light dark:border-border min-w-[80px]"
                    title={region.name}
                  >
                    <div className="text-xs">{region.code}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, idx) => (
                <tr
                  key={service.code}
                  className={idx % 2 === 0 ? 'bg-bg-light-secondary dark:bg-bg-secondary' : 'bg-bg-light-primary dark:bg-bg-primary'}
                >
                  <td className="sticky left-0 px-4 py-3 border-r border-border-light dark:border-border font-medium text-text-light-primary dark:text-text-primary bg-inherit z-[4]">
                    <div className="text-sm">{service.name}</div>
                    <div className="text-xs text-text-light-secondary dark:text-text-secondary font-mono">{service.code}</div>
                  </td>
                  {matrixData.regions.map(region => {
                    const isAvailable = matrixData.matrix[service.code]?.[region.code];
                    return (
                      <td
                        key={region.code}
                        className="px-2 py-3 text-center border-border-light dark:border-border"
                      >
                        {isAvailable ? (
                          <span className="text-green-500 text-lg" title="Available">✓</span>
                        ) : (
                          <span className="text-red-500 text-lg" title="Not Available">✗</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-text-light-secondary dark:text-text-secondary">
        <span className="text-green-500">✓</span> Available • <span className="text-red-500">✗</span> Not Available
      </div>
    </Container>
  );
}

export default Coverage;
