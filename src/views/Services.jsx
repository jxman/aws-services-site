import { useState, useMemo } from 'react';
import Container from '../components/layout/Container';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import { useAWSData, useServiceNames } from '../hooks/useAWSData';
import { getCoverageColor } from '../utils/constants';
import { calculateCoverage } from '../utils/calculations';
import { formatNumber, formatPercentage } from '../utils/formatters';

function Services() {
  const { data, isLoading, isError, error, refetch } = useAWSData();
  const { data: serviceNamesData, isLoading: isLoadingNames } = useServiceNames();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCoverage, setFilterCoverage] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const servicesData = useMemo(() => {
    if (!data || !serviceNamesData) return [];

    const services = data.services?.services || [];
    const servicesByRegion = data.servicesByRegion?.byRegion || {};
    const totalRegions = Object.keys(servicesByRegion).length;

    const nameMap = {};
    serviceNamesData.forEach(service => {
      nameMap[service.code] = service.name;
    });

    return services.map((serviceCode) => {
      // Get list of region codes where this service is available
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
        coverageColor: getCoverageColor(coverage),
        // Include list of regions for modal
        regions: regionsWithService,
      };
    });
  }, [data, serviceNamesData]);

  const filteredAndSortedServices = useMemo(() => {
    let filtered = servicesData;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(search) ||
          service.code.toLowerCase().includes(search)
      );
    }

    if (filterCoverage !== 'all') {
      filtered = filtered.filter((service) => {
        if (filterCoverage === 'high') return service.coverage >= 75;
        if (filterCoverage === 'medium') return service.coverage >= 50 && service.coverage < 75;
        if (filterCoverage === 'low') return service.coverage < 50;
        return true;
      });
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = (a.name || a.code || '').toString();
        const nameB = (b.name || b.code || '').toString();
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'coverage-high') {
        return b.coverage - a.coverage;
      } else if (sortBy === 'coverage-low') {
        return a.coverage - b.coverage;
      }
      return 0;
    });
  }, [servicesData, searchTerm, filterCoverage, sortBy]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const exportToCSV = () => {
    const headers = ['Service Name', 'Service Code', 'Available Regions', 'Total Regions', 'Coverage %'];
    const rows = filteredAndSortedServices.map(service => [
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading || isLoadingNames) {
    return <Loading message="Loading AWS services data..." />;
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage error={error} onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">AWS Services</h1>
        <p className="text-text-secondary text-lg">
          Explore all {servicesData.length} AWS services and their regional availability
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="sm:w-48">
          <select
            value={filterCoverage}
            onChange={(e) => setFilterCoverage(e.target.value)}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Coverage</option>
            <option value="high">High (75%+)</option>
            <option value="medium">Medium (50-74%)</option>
            <option value="low">Low (&lt;50%)</option>
          </select>
        </div>

        <div className="sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="coverage-high">Coverage (High to Low)</option>
            <option value="coverage-low">Coverage (Low to High)</option>
          </select>
        </div>

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

      <div className="mb-4 text-text-secondary">
        Showing {filteredAndSortedServices.length} of {servicesData.length} services
      </div>

      {filteredAndSortedServices.length === 0 ? (
        <div className="text-center py-16 bg-bg-secondary rounded-lg border border-border">
          <svg
            className="w-16 h-16 mx-auto text-text-secondary mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-text-secondary text-lg">No services match your search criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCoverage('all');
            }}
            className="mt-4 text-primary hover:text-primary-light"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedServices.map((service) => (
            <div
              key={service.code}
              onClick={() => handleServiceClick(service)}
              className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-text-secondary font-mono">{service.code}</p>
                </div>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: service.coverageColor }}
                  title={formatPercentage(service.coverage) + ' coverage'}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Available In:</span>
                  <span className="text-text-primary font-semibold">
                    {formatNumber(service.availableRegions)} / {formatNumber(service.totalRegions)} regions
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-secondary text-sm">Coverage:</span>
                    <span className="text-text-primary font-semibold text-sm">
                      {formatPercentage(service.coverage)}
                    </span>
                  </div>
                  <div className="w-full bg-bg-tertiary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: service.coverage + '%',
                        backgroundColor: service.coverageColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-bg-secondary rounded-lg border border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Coverage Legend:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-text-secondary">High (75%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="text-text-secondary">Medium (50-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="text-text-secondary">Low (&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        regions={selectedService?.regions || []}
      />
    </Container>
  );
}

export default Services;
