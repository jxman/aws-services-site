import { useQuery } from '@tanstack/react-query';

const fetchWhatsNew = async () => {
  const response = await fetch('/data/aws-whats-new.json');
  if (!response.ok) {
    throw new Error('Failed to fetch AWS announcements');
  }
  return response.json();
};

export const useAWSAnnouncements = () => {
  return useQuery({
    queryKey: ['aws-announcements'],
    queryFn: fetchWhatsNew,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
};
