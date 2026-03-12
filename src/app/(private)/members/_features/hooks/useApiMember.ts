import { getMembers } from '@/repositories/members/member-repository';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GetCrmMembersData } from '@/lib/api';

export const useGetListMembers = (param: { filters: NonNullable<GetCrmMembersData['query']> }) => {
  const { filters } = param;

  return useQuery({
    queryKey: ['members', filters],
    queryFn: async () => {
      const response = await getMembers(filters);
      return response;
    },
    placeholderData: keepPreviousData,
  });
};
