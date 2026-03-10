import { getMembers } from '@/repositories/members/member-repository';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GetMembersData } from '@/lib/api';

export const useGetListMembers = (param: { filters: NonNullable<GetMembersData['query']> }) => {
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
