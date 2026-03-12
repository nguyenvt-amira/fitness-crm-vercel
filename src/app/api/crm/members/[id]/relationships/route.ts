import { NextRequest, NextResponse } from 'next/server';

import type {
  CorporateRelationship,
  FamilyRelationship,
  ReferralRelationship,
} from '@/types/member.type';
import { MemberStatus } from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      family: {
        children: [
          {
            id: 'M-00002',
            memberNumber: 'M-00002',
            name: '佐藤 太郎',
            relationship: '子',
            status: MemberStatus.ACTIVE,
          },
        ],
        currentCount: 1,
        maxCount: 3,
      } as FamilyRelationship,
      corporate: null as CorporateRelationship | null,
      referral: {
        asReferrer: {
          referrals: [
            {
              id: 'M-00010',
              memberNumber: 'M-00010',
              name: '鈴木 花子',
              referredAt: '2024-06-01',
              joined: true,
              pointsEarned: 500,
            },
          ],
          summary: {
            totalReferrals: 1,
            totalPoints: 500,
          },
        },
      } as ReferralRelationship,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
  }
}
