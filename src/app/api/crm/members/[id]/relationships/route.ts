import { NextRequest, NextResponse } from 'next/server';

import { ErrorResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';
import { z } from 'zod';

import type {
  CorporateRelationship,
  FamilyRelationship,
  ReferralRelationship,
} from '@/types/api/member.type';
import { MemberStatus } from '@/types/api/member.type';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/members/{id}/relationships',
  summary: 'Get member relationships',
  description: 'Get relationship information for a member (family, corporate, referral)',
  tags: ['Members'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Member ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    {
      status: 200,
      schema: z
        .object({
          family: z.any().nullable().openapi({
            description: 'Family relationships',
          }),
          corporate: z.any().nullable().openapi({
            description: 'Corporate relationships',
          }),
          referral: z.any().openapi({
            description: 'Referral relationships',
          }),
        })
        .openapi({
          title: 'GetRelationshipsResponse',
          description: 'Response for getting relationships',
        }),
      description: 'Relationship information',
    },
    {
      status: 404,
      schema: ErrorResponseSchema,
      description: 'Member not found',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

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
