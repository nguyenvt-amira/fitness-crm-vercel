import { GetMembersData, MemberListItem, Members } from '@/lib/api';

export const getMembers = async (
  filter: NonNullable<GetMembersData['query']>,
): Promise<MemberListItem[]> => {
  try {
    const { data, error } = await Members.getMembers({
      query: {
        keyword: filter.keyword || undefined,
        storeId: filter.storeId !== 'all' ? filter.storeId : undefined,
        memberType: filter.memberType !== 'all' ? filter.memberType : undefined,
        status: filter.status !== 'all' ? filter.status : undefined,
        lastVisitDate: filter.lastVisitDate !== 'all' ? filter.lastVisitDate : undefined,
      },
    });

    if (error) {
      console.error('Failed to fetch members:', error);
      return [];
    }

    return data?.data || [];
  } catch (err) {
    console.error('Error calling getMembers:', err);
    return Array(15).fill({
      id: '001',
      memberNo: '001',
      name: '山田太郎',
      nameKana: 'ヤマダタロウ',
      type: '通常会員',
      status: '退会済み',
    });
    // return [];
  }
};

export const searchMembers = async (keySearch: string): Promise<MemberListItem[]> => {
  try {
    const { data, error } = await Members.searchMembers({
      query: {
        q: keySearch,
      },
    });

    if (error) {
      console.error('Failed to search members:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error calling searchMembers:', err);
    return [];
  }
};
