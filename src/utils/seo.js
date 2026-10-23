/**
 * Page titles, descriptions, and URLs shared by the React app (usePageMeta)
 * and the build-time prerender script (scripts/prerender.mjs).
 *
 * Keep this file free of browser APIs and extensionless imports so Node can
 * import it directly.
 */

export const SITE_URL = 'https://aws-services.synepho.com';
export const SITE_NAME = 'AWS Services Dashboard';

export const regionPath = (code) => `/regions/${code}`;
export const servicePath = (code) => `/services/${code}`;

export const STATIC_PAGES = {
  '/': {
    title: 'AWS Services by Region – Availability Dashboard',
    heading: 'AWS Services by Region',
    description:
      'Check which AWS services are available in every AWS region. Daily-updated availability for 400+ AWS services across all global regions, with coverage reports and CSV/Excel export.',
  },
  '/regions': {
    title: 'AWS Regions List – Services Available in Each Region',
    heading: 'AWS Regions',
    description:
      'Every AWS region with its region code, availability zones, launch date, and the number of AWS services available. Pick a region to see its full service list.',
  },
  '/services': {
    title: 'AWS Services List – Regional Availability for Every Service',
    heading: 'AWS Services',
    description:
      'All AWS services and how many regions each one is available in. Pick a service to see exactly which AWS regions support it.',
  },
  '/coverage': {
    title: 'AWS Services by Region – Availability Matrix',
    heading: 'AWS Services by Region',
    description:
      'Service × region availability matrix for every AWS service across all AWS regions, updated daily. Filter by service or region and export the results.',
  },
  '/whats-new': {
    title: "What's New in AWS – Announcements and Region Changes",
    heading: "What's New",
    description:
      'Latest AWS announcements plus a timeline of AWS infrastructure changes: new regions and services launching in existing regions.',
  },
  '/reports': {
    title: 'AWS Service Availability Reports – CSV and Excel Export',
    heading: 'Report Center',
    description:
      'Download AWS regional service availability data as Excel or CSV reports, updated daily.',
  },
  '/about': {
    title: 'About the AWS Services Dashboard',
    heading: 'About AWS Services Dashboard',
    description:
      'How the AWS Services Dashboard collects daily AWS regional service availability data, and who built it.',
  },
};

export const NOT_FOUND_META = {
  title: 'Page Not Found – AWS Services Dashboard',
  description: 'The page you were looking for does not exist.',
  noindex: true,
};

export const regionPageMeta = (region, serviceCount) => ({
  title: `AWS Services in ${region.code} – ${region.name}`,
  heading: `AWS Services Available in ${region.name}`,
  description: `${serviceCount} AWS services are available in the ${region.name} region (${region.code}). See the full list of supported services, plus services not yet available, availability zones, and launch date.`,
});

export const servicePageMeta = (service, regionCount, totalRegions) => ({
  title: `${service.name} – AWS Region Availability`,
  heading: `${service.name} Region Availability`,
  description: `${service.name} (${service.code}) is available in ${regionCount} of ${totalRegions} AWS regions. See which AWS regions support ${service.name} and which do not.`,
});
