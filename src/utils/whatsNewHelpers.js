/**
 * Extract the latest changes from the change log
 * @param {Array} changeLog - Array of change entries
 * @param {Object} servicesData - Service metadata with names
 * @param {number} maxItems - Maximum number of items to return
 * @returns {Array} Array of formatted change items
 */
export function getLatestChanges(changeLog, servicesData = {}, maxItems = 5) {
  if (!changeLog || changeLog.length === 0) return [];

  // Get most recent entry
  const latestEntry = changeLog[0];
  const changes = latestEntry.changes;
  const items = [];

  // Add new services
  if (changes.newServices && changes.newServices.length > 0) {
    changes.newServices.forEach((service) => {
      items.push({
        type: 'new-service',
        icon: 'blue',
        title: service.name,
        description: 'New service launched',
        code: service.code,
      });
    });
  }

  // Add regional expansions (grouped by service)
  if (changes.newRegionalServices && changes.newRegionalServices.length > 0) {
    const grouped = groupRegionalServicesByService(changes.newRegionalServices, servicesData);

    Object.entries(grouped).forEach(([serviceCode, data]) => {
      const regionCount = data.regions.length;
      const regionText = regionCount <= 3
        ? data.regions.join(', ')
        : `${regionCount} regions`;

      items.push({
        type: 'regional-expansion',
        icon: 'green',
        title: data.name || serviceCode,
        description: `Expanded to ${regionText}`,
        code: serviceCode,
        regions: data.regions,
      });
    });
  }

  // Add new regions
  if (changes.newRegions && changes.newRegions.length > 0) {
    changes.newRegions.forEach((region) => {
      items.push({
        type: 'new-region',
        icon: 'purple',
        title: 'New Region Available',
        description: region,
        code: region,
      });
    });
  }

  return items.slice(0, maxItems);
}

/**
 * Group regional services by service code
 * @param {Array} regionalServices - Array of regional service mappings
 * @param {Object} servicesData - Service metadata
 * @returns {Object} Grouped services with regions
 */
function groupRegionalServicesByService(regionalServices, servicesData) {
  return regionalServices.reduce((acc, item) => {
    if (!acc[item.service]) {
      acc[item.service] = {
        code: item.service,
        name: servicesData[item.service]?.name || item.service,
        regions: [],
      };
    }
    acc[item.service].regions.push(item.region);
    return acc;
  }, {});
}

/**
 * Format change summary statistics
 * @param {Object} metadata - Infrastructure change metadata
 * @returns {string} Formatted summary text
 */
export function formatChangeSummary(metadata) {
  if (!metadata) return '';

  const { created, changesSinceInception } = metadata;
  if (!changesSinceInception) return '';

  const { newServices = 0, newRegionalServices = 0, newRegions = 0 } = changesSinceInception;

  const parts = [];
  if (newServices > 0) {
    parts.push(`${newServices} new service${newServices > 1 ? 's' : ''}`);
  }
  if (newRegionalServices > 0) {
    parts.push(`${newRegionalServices} expansion${newRegionalServices > 1 ? 's' : ''}`);
  }
  if (newRegions > 0) {
    parts.push(`${newRegions} new region${newRegions > 1 ? 's' : ''}`);
  }

  if (parts.length === 0) return 'No changes tracked yet';

  return `Since ${created}: ${parts.join(', ')}`;
}

/**
 * Get icon class based on change type
 * @param {string} iconColor - Icon color (blue, green, purple)
 * @returns {string} Tailwind classes for the icon
 */
export function getIconClasses(iconColor) {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  };

  return colorMap[iconColor] || colorMap.blue;
}

/**
 * Count total individual changes across all changelog entries
 * Each line item displayed = 1 count (new service, regional expansion per service, new region)
 * @param {Array} changeLog - Array of change entries
 * @returns {number} Total count of individual change items
 */
export function countTotalChanges(changeLog) {
  if (!changeLog || changeLog.length === 0) return 0;

  return changeLog.reduce((total, entry) => {
    const changes = entry.changes;
    let entryCount = 0;

    // Count new services (1 per service)
    if (changes.newServices && changes.newServices.length > 0) {
      entryCount += changes.newServices.length;
    }

    // Count regional expansions (1 per service, not per region)
    // Group by service code to match display logic
    if (changes.newRegionalServices && changes.newRegionalServices.length > 0) {
      const uniqueServices = new Set(changes.newRegionalServices.map(item => item.service));
      entryCount += uniqueServices.size;
    }

    // Count new regions (1 per region)
    if (changes.newRegions && changes.newRegions.length > 0) {
      entryCount += changes.newRegions.length;
    }

    return total + entryCount;
  }, 0);
}
