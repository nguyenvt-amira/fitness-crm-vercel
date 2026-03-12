import { GetCrmMembersData, MemberListItem, Members } from '@/lib/api';

export const getMembers = async (
  filter: NonNullable<GetCrmMembersData['query']>,
): Promise<MemberListItem[]> => {
  try {
    const { data, error } = await Members.getCrmMembers({
      query: {
        search: filter.search || undefined,
        storeId: filter.storeId,
        memberType: filter.memberType,
        status: filter.status,
        lastVisitDays: filter.lastVisitDays,
        brand: filter.brand,
        contractPlanId: filter.contractPlanId,
        hasUnpaid: filter.hasUnpaid,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        page: filter.page,
        limit: filter.limit,
      },
    });

    if (error) {
      console.error('Failed to fetch members:', error);
      return [];
    }

    return data?.members || [];
  } catch (err) {
    console.error('Error calling getCrmMembers:', err);
    return [];
  }
};

export const searchMembers = async (keySearch: string): Promise<MemberListItem[]> => {
  try {
    const { data, error } = await Members.getCrmMembers({
      query: {
        search: keySearch,
      },
    });

    if (error) {
      console.error('Failed to search members:', error);
      return [];
    }

    return data?.members || [];
  } catch (err) {
    console.error('Error calling getCrmMembers for search:', err);
    return [];
  }
};
