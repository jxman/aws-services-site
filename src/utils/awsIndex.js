/**
 * Returns the URL only if it is an absolute http(s) URL, so remote data can't
 * inject javascript: or other scheme URLs into links.
 *
 * @param {string} url
 * @returns {string|null}
 */
export const safeExternalUrl = (url) => {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null;
  } catch {
    return null;
  }
};

/**
 * Builds region → services and service → regions lookups from
 * complete-data.json and services.json.
 *
 * Shared by the detail views and scripts/prerender.mjs, so keep it free of
 * browser APIs and extensionless imports.
 *
 * @param {Object} data - complete-data.json contents
 * @param {Array<{code: string, name: string}>} serviceNames - services.json `services` array
 * @returns {{regions: Array, services: Array, regionByCode: Object, serviceByCode: Object}}
 */
export const buildAwsIndex = (data, serviceNames = []) => {
  const byRegion = data?.servicesByRegion?.byRegion || {};
  const nameMap = Object.create(null);
  serviceNames.forEach((service) => {
    nameMap[service.code] = service.name;
  });

  const regions = (data?.regions?.regions || [])
    .map((region) => ({
      code: region.code,
      name: region.name || region.code,
      availabilityZones: region.availabilityZones,
      launchDate: region.launchDate,
      blogUrl: safeExternalUrl(region.blogUrl),
      services: byRegion[region.code]?.services || [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const services = (data?.services?.services || [])
    .map((code) => ({
      code,
      name: nameMap[code] || code,
      regions: regions.filter((region) => region.services.includes(code)).map((region) => region.code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const regionByCode = Object.create(null);
  regions.forEach((region) => {
    regionByCode[region.code] = region;
  });

  const serviceByCode = Object.create(null);
  services.forEach((service) => {
    serviceByCode[service.code] = service;
  });

  return { regions, services, regionByCode, serviceByCode };
};
