import { NextRequest, NextResponse } from 'next/server';

import type { GetPointsResponse } from '@/types/api/member.type';

/** Mock data for GET /crm/members/{id}/points — ポイントタブ用（member_points, member_point_histories 想定） */
function buildMockPoints(memberId: string): GetPointsResponse {
  return {
    fit365: {
      current_balance: 1200,
      total_earned: 3500,
      total_spent: 2300,
      expiry: 'none',
      usage_destination: '月次請求に使用、ECサイト決済',
    },
    joyfit: {
      current_balance: 800,
      total_earned: 2000,
      total_spent: 1200,
      expiry: 'none',
      usage_destination: '商品に交換、ギフトカードに交換',
    },
    rank: {
      current: 'ゴールド',
      benefits: 'ポイント2倍キャンペーン、優先予約',
      next_rank: {
        required_points: 2000,
        progress: 75,
      },
    },
    earn_history: [
      {
        id: 'earn-001',
        date: '2025-03-10T10:00:00+09:00',
        reason: '来館',
        points: 100,
        notes: '八潮店',
      },
      {
        id: 'earn-002',
        date: '2025-03-01T14:00:00+09:00',
        reason: '友達紹介',
        points: 500,
        notes: '紹介会員: M000012',
      },
      {
        id: 'earn-003',
        date: '2025-02-15T00:00:00+09:00',
        reason: 'キャンペーン',
        points: 200,
        notes: '春キャンペーン',
      },
      {
        id: 'earn-004',
        date: '2025-02-01T09:00:00+09:00',
        reason: '誕生日ボーナス',
        points: 300,
      },
    ],
    spend_history: [
      {
        id: 'spend-001',
        date: '2025-03-05T10:00:00+09:00',
        content: '月会費充当',
        points: 500,
        notes: 'FIT365 3月分',
      },
      {
        id: 'spend-002',
        date: '2025-02-20T12:00:00+09:00',
        content: '商品交換',
        points: 300,
        notes: 'JOYFIT オリジナルタオル',
      },
      {
        id: 'spend-003',
        date: '2025-02-01T10:00:00+09:00',
        content: 'ECサイト決済',
        points: 200,
        notes: 'FIT365 EC',
      },
    ],
    adjustment_history: [
      {
        id: 'adj-001',
        date: '2025-01-20T11:00:00+09:00',
        adjustment_type: 'add',
        points: 100,
        reason: 'キャンペーン漏れ分の手動付与',
        adjusted_by: '山田 太郎',
      },
    ],
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = buildMockPoints(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    return NextResponse.json({ success: true, id, adjustment: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to adjust points' }, { status: 500 });
  }
}
