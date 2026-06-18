import { queryOptions } from '@tanstack/react-query';

import type {
  GetVisitExperiencesQuery,
  GetVisitExperiencesResponse,
  GetVisitExperiencesSummaryResponse,
  VisitExperience,
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

export const getCrmVisitExperiencesByIdOptions = (id: string) =>
  queryOptions<VisitExperience>({
    queryKey: ['crm', 'visit-experiences', id],
    queryFn: async () => {
      const res = await fetch(`/api/crm/visit-experiences/${id}`);
      if (!res.ok) throw new Error('Failed to fetch visit experience');
      return res.json() as Promise<VisitExperience>;
    },
  });
