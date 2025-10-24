import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch AWS infrastructure data from CloudFront distribution
 *
 * Data is distributed daily at 2 AM UTC by the aws-data-fetcher Lambda
 * to www.aws-services.synepho.com/data/
 *
 * @returns {Object} TanStack Query result object with data, isLoading, error
 */
export const useAWSData = () => {
  return useQuery({
    queryKey: ['aws-data'],
    queryFn: async () => {
      // Use relative path - served from same CloudFront distribution
      // Data is distributed by fetcher Lambda to www.aws-services.synepho.com/data/
      const response = await fetch('/data/complete-data.json');

      if (!response.ok) {
        throw new Error(`Failed to fetch AWS data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Validate data structure
      if (!data.metadata || !data.regions || !data.services) {
        throw new Error('Invalid data structure: missing required fields');
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,       // 5 minutes (matches CloudFront cache-control)
    cacheTime: 30 * 60 * 1000,      // 30 minutes
    refetchOnWindowFocus: false,     // Don't refetch on tab focus
    refetchOnReconnect: true,        // Refetch on reconnect
    retry: 3,                        // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Custom hook to fetch AWS service names mapping
 *
 * @returns {Object} TanStack Query result with services array containing {code, name}
 */
export const useServiceNames = () => {
  return useQuery({
    queryKey: ['service-names'],
    queryFn: async () => {
      const response = await fetch('/data/services.json');

      if (!response.ok) {
        throw new Error(`Failed to fetch service names: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return data.services || [];
    },
    staleTime: 30 * 60 * 1000,      // 30 minutes (service names rarely change)
    cacheTime: 60 * 60 * 1000,      // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
