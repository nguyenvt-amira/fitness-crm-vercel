'use client';

import { useQuery } from '@tanstack/react-query';

import type { GetStudioDetailResponse } from '@/lib/api/types.gen';

/**
 * Hook to fetch studio detail data using React Query.
 * Handles loading, error, and not-found states.
 */
export function useStudioDetail(studioId: string | undefined) {
  // Constitution exception: migrate to generated option-factory hook when
  // /crm/studios/{id} is emitted into @tanstack/react-query.gen.
  return useQuery<GetStudioDetailResponse, Error>({
    queryKey: ['studio-detail', studioId],
    queryFn: async () => {
      if (!studioId) {
        throw new Error('Studio ID is required');
      }

      const response = await fetch(`/api/crm/studios/${studioId}`);

      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch studio detail: ${response.status}`);
      }

      const data = await response.json();
      return data as GetStudioDetailResponse;
    },
    enabled: !!studioId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
