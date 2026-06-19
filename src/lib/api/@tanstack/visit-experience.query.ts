import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  GetVisitExperiencesQuery,
  GetVisitExperiencesResponse,
  GetVisitExperiencesSummaryResponse,
  PermitVisitExperienceResponse,
  VisitExperienceDetail,
} from '@/types/api/visit-experience.type';

export const getCrmVisitExperiencesOptions = (params?: GetVisitExperiencesQuery) =>
  queryOptions<GetVisitExperiencesResponse>({
    queryKey: ['crm', 'visit-experiences', params ?? {}],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            qs.set(key, String(value));
          }
        });
      }
      const res = await fetch(`/api/crm/visit-experiences?${qs.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch visit experiences');
      return res.json() as Promise<GetVisitExperiencesResponse>;
    },
  });

export const getCrmVisitExperiencesSummaryOptions = () =>
  queryOptions<GetVisitExperiencesSummaryResponse>({
    queryKey: ['crm', 'visit-experiences', 'summary'],
    queryFn: async () => {
      const res = await fetch('/api/crm/visit-experiences/summary');
      if (!res.ok) throw new Error('Failed to fetch visit experiences summary');
      return res.json() as Promise<GetVisitExperiencesSummaryResponse>;
    },
  });

export const getCrmVisitExperienceDetailOptions = (id: string) =>
  queryOptions<VisitExperienceDetail>({
    queryKey: ['crm', 'visit-experiences', id],
    queryFn: async () => {
      const res = await fetch(`/api/crm/visit-experiences/${id}`);
      if (!res.ok) throw new Error('Failed to fetch visit experience detail');
      return res.json() as Promise<VisitExperienceDetail>;
    },
  });

export const usePermitVisitExperienceMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<PermitVisitExperienceResponse, Error>({
    mutationFn: async () => {
      const res = await fetch(`/api/crm/visit-experiences/${id}/permit`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { reason?: string }).reason ?? 'Failed to issue permit');
      }
      return res.json() as Promise<PermitVisitExperienceResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'visit-experiences', id] });
    },
  });
};
