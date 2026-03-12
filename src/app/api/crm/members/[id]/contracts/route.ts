import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      mainContracts: [
        {
          contractId: `MC-${id}-001`,
          planName: 'スタンダードプラン',
          status: 'active' as const,
          storeName: 'Fit365八潮店',
          startDate: '2024-01-15',
          endDate: null,
        },
        {
          contractId: `MC-${id}-002`,
          planName: 'ベーシックプラン',
          status: 'terminated' as const,
          storeName: 'Fit365新宿店',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
        },
      ],
      optionContracts: [
        {
          contractId: `OC-${id}-001`,
          name: 'パーソナルトレーニング',
          status: 'active' as const,
          storeName: 'Fit365八潮店',
          startDate: '2024-02-01',
          endDate: null,
        },
        {
          contractId: `OC-${id}-002`,
          name: '水素水',
          status: 'terminated' as const,
          storeName: 'Fit365新宿店',
          startDate: '2023-03-01',
          endDate: '2023-09-30',
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
