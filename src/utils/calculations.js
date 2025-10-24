/**
 * Calculate coverage percentage
 * @param {number} available - Number of available items
 * @param {number} total - Total number of items
 * @returns {number} Coverage percentage (0-100)
 */
export const calculateCoverage = (available, total) => {
  if (total === 0) return 0;
  return (available / total) * 100;
};

/**
 * Calculate statistics from AWS data
 * @param {Object} data - AWS data object
 * @returns {Object} Statistics object
 */
export const calculateStats = (data) => {
  if (!data || !data.metadata) {
    return {
      totalRegions: 0,
      totalServices: 0,
      totalMappings: 0,
      avgCoverage: 0,
    };
  }

  const regions = data.regions?.regions || [];
  const services = data.services?.services || [];
  const servicesByRegion = data.servicesByRegion?.byRegion || {};

  const totalMappings = Object.values(servicesByRegion).reduce(
    (acc, region) => acc + (region.services?.length || region.serviceCount || 0),
    0
  );

  const avgCoverage = services.length > 0
    ? (totalMappings / (regions.length * services.length)) * 100
    : 0;

  return {
    totalRegions: regions.length,
    totalServices: services.length,
    totalMappings,
    avgCoverage: Math.round(avgCoverage * 10) / 10, // Round to 1 decimal
  };
};

/**
 * Get top regions by service count
 * @param {Object} servicesByRegion - Services by region data
 * @param {number} limit - Number of top regions to return (default: 5)
 * @returns {Array} Top regions sorted by service count
 */
export const getTopRegions = (servicesByRegion, limit = 5) => {
  if (!servicesByRegion || !servicesByRegion.byRegion) return [];

  const regions = Object.entries(servicesByRegion.byRegion).map(([code, data]) => ({
    code,
    serviceCount: data.services?.length || data.serviceCount || 0,
  }));

  return regions
    .sort((a, b) => b.serviceCount - a.serviceCount)
    .slice(0, limit);
};

/**
 * Get service availability across regions
 * @param {string} serviceCode - Service code
 * @param {Object} servicesByRegion - Services by region data
 * @returns {Object} Service availability info
 */
export const getServiceAvailability = (serviceCode, servicesByRegion) => {
  if (!servicesByRegion || !servicesByRegion.byRegion) {
    return { availableRegions: 0, totalRegions: 0, coverage: 0 };
  }

  const allRegions = Object.keys(servicesByRegion.byRegion);
  const availableRegions = allRegions.filter((region) => {
    const services = servicesByRegion.byRegion[region].services || [];
    return services.includes(serviceCode);
  });

  return {
    availableRegions: availableRegions.length,
    totalRegions: allRegions.length,
    coverage: calculateCoverage(availableRegions.length, allRegions.length),
  };
};
