import { NextRequest, NextResponse } from 'next/server';

import type { MemberPoints, PointHistory } from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      points: {
        currentBalance: 1500,
        totalEarned: 5000,
        totalSpent: 3500,
        rank: {
          current: 'ゴールド',
          benefits: 'ポイント2倍キャンペーン',
          nextRank: {
            requiredPoints: 2000,
            progress: 75,
          },
        },
      } as MemberPoints,
      earnHistory: [
        {
          id: 'ph-001',
          date: '2024-11-20T10:00:00Z',
          type: 'earn' as const,
          reason: '来館',
          points: 100,
        },
        {
          id: 'ph-002',
          date: '2024-11-15T14:00:00Z',
          type: 'earn' as const,
          reason: '友達紹介',
          points: 500,
        },
      ] as PointHistory[],
      spendHistory: [
        {
          id: 'ph-003',
          date: '2024-11-01T10:00:00Z',
          type: 'spend' as const,
          reason: '月会費充当',
          points: -2000,
        },
      ] as PointHistory[],
      adjustmentHistory: [] as PointHistory[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Mock point adjustment
    return NextResponse.json({ success: true, id, adjustment: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to adjust points' }, { status: 500 });
  }
}
