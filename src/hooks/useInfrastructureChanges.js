import { useQuery } from '@tanstack/react-query';

const fetchChangeHistory = async () => {
  const response = await fetch('/data/change-history.json');
  if (!response.ok) {
    throw new Error('Failed to fetch change history');
  }
  return response.json();
};

export const useInfrastructureChanges = () => {
  return useQuery({
    queryKey: ['infrastructure-changes'],
    queryFn: fetchChangeHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
};
