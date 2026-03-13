import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      mainContracts: [
        {
          contractId: `MC-${id}-001`,
          plan_name: 'スタンダードプラン',
          status: 'active' as const,
          store_name: 'Fit365八潮店',
          start_date: '2024-01-15',
          end_date: null,
        },
        {
          contractId: `MC-${id}-002`,
          plan_name: 'ベーシックプラン',
          status: 'terminated' as const,
          store_name: 'Fit365新宿店',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
        },
      ],
      optionContracts: [
        {
          contractId: `OC-${id}-001`,
          name: 'パーソナルトレーニング',
          status: 'active' as const,
          store_name: 'Fit365八潮店',
          start_date: '2024-02-01',
          end_date: null,
        },
        {
          contractId: `OC-${id}-002`,
          name: '水素水',
          status: 'terminated' as const,
          store_name: 'Fit365新宿店',
          start_date: '2023-03-01',
          end_date: '2023-09-30',
        },
      ],
      oneDayPasses: [],
      optionSets: [],
      campaigns: [],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
