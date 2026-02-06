import { useState, useMemo } from 'react';
import Container from '../components/layout/Container';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import RegionDetailModal from '../components/common/RegionDetailModal';
import { useAWSData } from '../hooks/useAWSData';
import { getCoverageColor } from '../utils/constants';
import { calculateCoverage } from '../utils/calculations';
import { formatNumber, formatPercentage } from '../utils/formatters';
import { parseSearchTerms, matchesSearchTerms } from '../utils/searchUtils';

function Regions() {
  const { data, isLoading, isError, error, refetch } = useAWSData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCoverage, setFilterCoverage] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        coverageColor: getCoverageColor(coverage),
        // Include full region data for modal
        availabilityZones: region.availabilityZones,
        launchDate: region.launchDate,
        blogUrl: region.blogUrl,
        services: regionServices,
      };
    });
  }, [data]);

  const filteredRegions = useMemo(() => {
    let filtered = regionsData;

    const terms = parseSearchTerms(searchTerm);
    if (terms.length > 0) {
      filtered = filtered.filter((region) =>
        matchesSearchTerms(region, ['name', 'code'], terms)
      );
    }

    if (filterCoverage !== 'all') {
      filtered = filtered.filter((region) => {
        if (filterCoverage === 'high') return region.coverage >= 75;
        if (filterCoverage === 'medium') return region.coverage >= 50 && region.coverage < 75;
        if (filterCoverage === 'low') return region.coverage < 50;
        return true;
      });
    }

    return filtered.sort((a, b) => b.serviceCount - a.serviceCount);
  }, [regionsData, searchTerm, filterCoverage]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(null);
  };

  const exportToCSV = () => {
    const headers = ['Region Name', 'Region Code', 'Services Available', 'Total Services', 'Coverage %'];
    const rows = filteredRegions.map(region => [
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

  if (isLoading) {
    return <Loading message="Loading AWS regions data..." />;
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
        <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-2">AWS Regions</h1>
        <p className="text-text-light-secondary dark:text-text-secondary text-lg">
          Explore all {regionsData.length} AWS regions and their service availability
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search regions (comma-separated, e.g. us-, ap-)..."
              maxLength={500}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg text-text-light-primary dark:text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-text-secondary"
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
            className="w-full px-4 py-2 bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg text-text-light-primary dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Coverage</option>
            <option value="high">High (75%+)</option>
            <option value="medium">Medium (50-74%)</option>
            <option value="low">Low (&lt;50%)</option>
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

      <div className="mb-4 text-text-light-secondary dark:text-text-secondary">
        Showing {filteredRegions.length} of {regionsData.length} regions
      </div>

      {filteredRegions.length === 0 ? (
        <div className="text-center py-16 bg-bg-light-secondary dark:bg-bg-secondary rounded-lg border border-border-light dark:border-border">
          <svg
            className="w-16 h-16 mx-auto text-text-light-secondary dark:text-text-secondary mb-4"
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
          <p className="text-text-light-secondary dark:text-text-secondary text-lg">No regions match your search criteria</p>
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
          {filteredRegions.map((region) => (
            <div
              key={region.code}
              onClick={() => handleRegionClick(region)}
              className="bg-bg-light-secondary dark:bg-bg-secondary border border-border-light dark:border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-1">
                    {region.name}
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary font-mono">{region.code}</p>
                </div>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: region.coverageColor }}
                  title={formatPercentage(region.coverage) + ' coverage'}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-light-secondary dark:text-text-secondary">Services Available:</span>
                  <span className="text-text-light-primary dark:text-text-primary font-semibold">
                    {formatNumber(region.serviceCount)} / {formatNumber(region.totalServices)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-light-secondary dark:text-text-secondary text-sm">Coverage:</span>
                    <span className="text-text-light-primary dark:text-text-primary font-semibold text-sm">
                      {formatPercentage(region.coverage)}
                    </span>
                  </div>
                  <div className="w-full bg-bg-light-tertiary dark:bg-bg-tertiary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: region.coverage + '%',
                        backgroundColor: region.coverageColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-bg-light-secondary dark:bg-bg-secondary rounded-lg border border-border-light dark:border-border">
        <h3 className="text-sm font-semibold text-text-light-primary dark:text-text-primary mb-3">Coverage Legend:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-text-light-secondary dark:text-text-secondary">High (75%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="text-text-light-secondary dark:text-text-secondary">Medium (50-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="text-text-light-secondary dark:text-text-secondary">Low (&lt;50%)</span>
          </div>
        </div>
      </div>

      {/* Region Detail Modal */}
      <RegionDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        region={selectedRegion}
        services={selectedRegion?.services || []}
      />
    </Container>
  );
}

export default Regions;
