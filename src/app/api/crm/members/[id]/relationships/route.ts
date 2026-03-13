import { NextRequest, NextResponse } from 'next/server';

import type {
  CorporateRelationship,
  FamilyRelationship,
  ReferralRelationship,
} from '@/types/api/member.type';
import { MemberStatus } from '@/types/api/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      family: {
        children: [
          {
            id: 'M-00002',
            member_number: 'M-00002',
            name: '佐藤 太郎',
            relationship: '子',
            status: MemberStatus.ACTIVE,
          },
        ],
        current_count: 1,
        max_count: 3,
      } as FamilyRelationship,
      corporate: null as CorporateRelationship | null,
      referral: {
        as_referrer: {
          referrals: [
            {
              id: 'M-00010',
              member_number: 'M-00010',
              name: '鈴木 花子',
              referred_at: '2024-06-01',
              joined: true,
              points_earned: 500,
            },
          ],
          summary: {
            total_referrals: 1,
            total_points: 500,
          },
        },
      } as ReferralRelationship,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
  }
}
