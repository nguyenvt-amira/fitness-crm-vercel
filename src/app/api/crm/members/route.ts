import { NextRequest, NextResponse } from 'next/server';

import { Brand, GetMembersResponse, MemberStatus, MemberType } from '@/types/api/member.type';

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
      member_number: `M-${String(i).padStart(5, '0')}`,
      name_kanji: name.kanji,
      name_kana: name.kana,
      member_type: (['regular', 'family', 'corporate'] as MemberType[])[i % 3],
      status: (['active', 'suspended', 'withdrawn'] as MemberStatus[])[i % 3],
      store_name: `Fit365${store}`,
      brand: i % 2 === 0 ? Brand.FIT365 : Brand.JOYFIT,
      contract_plan_name: plans[i % plans.length],
      joined_at: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      last_visit_date: i % 5 === 0 ? undefined : `2024-12-${String((i % 28) + 1).padStart(2, '0')}`,
      has_unpaid: i % 7 === 0,
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
    const member_type = searchParams.get('member_type')?.split(',') as MemberType[] | undefined;
    const status = searchParams.get('status')?.split(',') as MemberStatus[] | undefined;
    const brand = searchParams.get('brand')?.split(',') as Brand[] | undefined;
    const store_id = searchParams.get('store_id')?.split(',');
    const contract_plan_id = searchParams.get('contract_plan_id')?.split(',');
    const last_visit_days = searchParams.get('last_visit_days')
      ? parseInt(searchParams.get('last_visit_days')!, 10)
      : undefined;
    const has_unpaid = searchParams.get('has_unpaid')
      ? searchParams.get('has_unpaid') === 'true'
      : undefined;
    const sort_by = searchParams.get('sort_by') || 'member_number';
    const sort_order = searchParams.get('sort_order') || 'asc';

    // Generate mock data
    const allMembers = generateMockMembers(200);

    // Apply filters
    let filtered = allMembers;

    if (search) {
      const searchLower = search.toLowerCase().trim();
      const searchNorm = search.trim();
      filtered = filtered.filter(
        (m) =>
          m.member_number.toLowerCase().includes(searchLower) ||
          m.name_kanji.includes(search) ||
          m.name_kana.includes(search),
      );
    }

    if (member_type && member_type.length > 0) {
      filtered = filtered.filter((m) => member_type.includes(m.member_type));
    }

    if (status && status.length > 0) {
      filtered = filtered.filter((m) => status.includes(m.status));
    }

    if (brand && brand.length > 0) {
      filtered = filtered.filter((m) => brand.includes(m.brand));
    }

    if (store_id && store_id.length > 0) {
      // Mock filter by store - in real app, filter by store_id
      filtered = filtered.filter((m) => store_id.some((id) => m.store_name?.includes(id)));
    }

    if (contract_plan_id && contract_plan_id.length > 0) {
      // Mock filter by contract plan
      filtered = filtered.filter((m) =>
        contract_plan_id.some((id) => m.contract_plan_name?.includes(id)),
      );
    }

    if (last_visit_days !== undefined) {
      const now = new Date();
      if (last_visit_days === -1) {
        // 3ヶ月以上 (90+ days)
        const cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (m) => !m.last_visit_date || new Date(m.last_visit_date) < cutoffDate,
        );
      } else {
        // Within X days
        const cutoffDate = new Date(now.getTime() - last_visit_days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (m) => m.last_visit_date && new Date(m.last_visit_date) >= cutoffDate,
        );
      }
    }

    if (has_unpaid !== undefined) {
      filtered = filtered.filter((m) => m.has_unpaid === has_unpaid);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sort_by) {
        case 'member_number':
          comparison = a.member_number.localeCompare(b.member_number);
          break;
        case 'joined_at':
          comparison = new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
          break;
        case 'last_visit':
          const aDate = a.last_visit_date ? new Date(a.last_visit_date).getTime() : 0;
          const bDate = b.last_visit_date ? new Date(b.last_visit_date).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'name':
          comparison = a.name_kanji.localeCompare(b.name_kanji);
          break;
      }
      return sort_order === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const total = filtered.length;
    const total_pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = filtered.slice(startIndex, endIndex);

    const response: GetMembersResponse = {
      members: paginatedMembers,
      pagination: {
        page,
        limit,
        total,
        total_pages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
