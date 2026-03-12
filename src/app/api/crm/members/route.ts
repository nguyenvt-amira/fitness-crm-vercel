import { NextRequest, NextResponse } from 'next/server';

import { Brand, GetMembersResponse, MemberStatus, MemberType } from '@/types/member.type';

const MOCK_STORES = [
  { id: 'store-001', name: 'Fit365八潮店' },
  { id: 'store-002', name: 'Fit365新宿店' },
  { id: 'store-003', name: 'Fit365渋谷店' },
  { id: 'store-004', name: 'JOYFIT池袋店' },
];

const MOCK_CONTRACT_PLANS = [
  { id: 'plan-001', name: 'ベーシックプラン' },
  { id: 'plan-002', name: 'スタンダードプラン' },
  { id: 'plan-003', name: 'プレミアムプラン' },
];

// Mock data generator
function generateMockMembers(count: number): GetMembersResponse['members'] {
  const members: GetMembersResponse['members'] = [];
  const names = [
    { kanji: '佐藤 花子', kana: 'サトウ ハナコ' },
    { kanji: '鈴木 太郎', kana: 'スズキ タロウ' },
    { kanji: '田中 美咲', kana: 'タナカ ミサキ' },
    { kanji: '山田 健太', kana: 'ヤマダ ケンタ' },
    { kanji: '中村 由美', kana: 'ナカムラ ユミ' },
  ];
  const plans = ['ベーシックプラン', 'スタンダードプラン', 'プレミアムプラン'];

  for (let i = 1; i <= count; i++) {
    const name = names[i % names.length];
    const store = MOCK_STORES[i % MOCK_STORES.length];
    const plan = MOCK_CONTRACT_PLANS[i % MOCK_CONTRACT_PLANS.length];

    // Mock phone: 090-XXXX-XXXX pattern
    const phone = `090-${String(1000 + (i % 9000)).slice(-4)}-${String(1000 + (i % 9000)).slice(-4)}`;
    // Mock email: member number + domain
    const email = `member${String(i).padStart(5, '0')}@example.jp`;
    members.push({
      id: `M-${String(i).padStart(5, '0')}`,
      memberNumber: `M-${String(i).padStart(5, '0')}`,
      nameKanji: name.kanji,
      nameKana: name.kana,
      memberType: (['regular', 'family', 'corporate'] as MemberType[])[i % 3],
      status: (['active', 'suspended', 'withdrawn'] as MemberStatus[])[i % 3],
      storeId: store.id,
      storeName: store.name,
      brand: i % 2 === 0 ? Brand.FIT365 : Brand.JOYFIT,
      contractPlanName: plans[i % plans.length],
      joinedAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      lastVisitDate: i % 5 === 0 ? undefined : `2024-12-${String((i % 28) + 1).padStart(2, '0')}`,
      hasUnpaid: i % 7 === 0,
      phone,
      email,
      contractPlanId: plan.id,
    });
  }
  return members;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const memberType = searchParams.get('memberType')?.split(',') as MemberType[] | undefined;
    const status = searchParams.get('status')?.split(',') as MemberStatus[] | undefined;
    const brand = searchParams.get('brand')?.split(',') as Brand[] | undefined;
    const storeId = searchParams.get('storeId')?.split(',');
    const contractPlanId = searchParams.get('contractPlanId')?.split(',');
    const lastVisitDays = searchParams.get('lastVisitDays')
      ? parseInt(searchParams.get('lastVisitDays')!, 10)
      : undefined;
    const hasUnpaid = searchParams.get('hasUnpaid')
      ? searchParams.get('hasUnpaid') === 'true'
      : undefined;
    const sortBy = searchParams.get('sortBy') || 'member_number';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Generate mock data
    const allMembers = generateMockMembers(200);

    // Apply filters
    let filtered = allMembers;

    if (search) {
      const searchLower = search.toLowerCase().trim();
      const searchNorm = search.trim();
      filtered = filtered.filter(
        (m) =>
          m.memberNumber.toLowerCase().includes(searchLower) ||
          m.nameKanji.includes(searchNorm) ||
          m.nameKana.includes(searchNorm) ||
          (m.phone && m.phone.replace(/-/g, '').includes(search.replace(/-/g, ''))) ||
          (m.email && m.email.toLowerCase().includes(searchLower)),
      );
    }

    if (memberType && memberType.length > 0) {
      filtered = filtered.filter((m) => memberType.includes(m.memberType));
    }

    if (status && status.length > 0) {
      filtered = filtered.filter((m) => status.includes(m.status));
    }

    if (brand && brand.length > 0) {
      filtered = filtered.filter((m) => brand.includes(m.brand));
    }

    if (storeId && storeId.length > 0) {
      // Mock filter by store - in real app, filter by storeId
      filtered = filtered.filter((m) => storeId.some((id) => m.storeId?.includes(id)));
    }

    if (contractPlanId && contractPlanId.length > 0) {
      // Mock filter by contract plan
      filtered = filtered.filter((m) =>
        contractPlanId.some((id) => m.contractPlanId?.includes(id)),
      );
    }

    if (lastVisitDays !== undefined) {
      const now = new Date();
      if (lastVisitDays === -1) {
        // 3ヶ月以上 (90+ days)
        const cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (m) => !m.lastVisitDate || new Date(m.lastVisitDate) < cutoffDate,
        );
      } else {
        // Within X days
        const cutoffDate = new Date(now.getTime() - lastVisitDays * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (m) => m.lastVisitDate && new Date(m.lastVisitDate) >= cutoffDate,
        );
      }
    }

    if (hasUnpaid !== undefined) {
      filtered = filtered.filter((m) => m.hasUnpaid === hasUnpaid);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'member_number':
          comparison = a.memberNumber.localeCompare(b.memberNumber);
          break;
        case 'joined_at':
          comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
          break;
        case 'last_visit':
          const aDate = a.lastVisitDate ? new Date(a.lastVisitDate).getTime() : 0;
          const bDate = b.lastVisitDate ? new Date(b.lastVisitDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'name':
          comparison = a.nameKanji.localeCompare(b.nameKanji);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = filtered.slice(startIndex, endIndex);

    const response: GetMembersResponse = {
      members: paginatedMembers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
