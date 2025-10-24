/**
 * AWS Data Configuration
 *
 * Data files are distributed by aws-data-fetcher Lambda
 * to the same CloudFront distribution serving this website
 */

export const DATA_URLS = {
  // Use relative paths - same CloudFront distribution
  COMPLETE_DATA: '/data/complete-data.json',
  REGIONS: '/data/regions.json',
  SERVICES: '/data/services.json',

  // Excel report (from aws-service-report-generator Lambda)
  EXCEL_REPORT: '/reports/aws-service-report-latest.xlsx',
};

export const UPDATE_SCHEDULE = {
  DAILY_UPDATE_TIME: '2:00 AM UTC',
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes (matches CloudFront cache-control)
};

export const DATA_SOURCE = {
  FETCHER_REPO: 'https://github.com/jxman/aws-infrastructure-fetcher',
  DATA_CONTRACT: 'https://github.com/jxman/aws-infrastructure-fetcher/blob/main/DATA_CONTRACT.md',
};
