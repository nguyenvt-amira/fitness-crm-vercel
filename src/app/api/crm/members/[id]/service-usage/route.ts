import { NextRequest, NextResponse } from 'next/server';

import { ErrorResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';
import { z } from 'zod';

import type { OtherServiceUsage, PersonalTraining, StudioProgram } from '@/types/api/member.type';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/members/{id}/service-usage',
  summary: 'Get member service usage',
  description: 'Get service usage information for a member',
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
          personalTraining: z.any().openapi({
            description: 'Personal training information',
          }),
          studioProgram: z.any().openapi({
            description: 'Studio program information',
          }),
          otherServices: z.any().openapi({
            description: 'Other services usage',
          }),
        })
        .openapi({
          title: 'GetServiceUsageResponse',
          description: 'Response for getting service usage',
        }),
      description: 'Service usage information',
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
      personalTraining: {
        reservations: [
          {
            id: 'pt-res-001',
            date: '2024-12-01T10:00:00Z',
            trainer_name: '山田 太郎',
            status: 'reserved' as const,
            menu: '上半身強化',
          },
        ],
        history: [
          {
            id: 'pt-hist-001',
            date: '2024-11-20T10:00:00Z',
            trainer_name: '山田 太郎',
            menu: '下半身強化',
            feedback: '良いセッションでした',
            rating: 5,
          },
        ],
      } as PersonalTraining,
      studioProgram: {
        participation_history: [
          {
            id: 'prog-001',
            date: '2024-11-25T19:00:00Z',
            program_name: 'ヨガ',
            instructor_name: '鈴木 花子',
            participants: 15,
            rating: 4,
          },
        ],
        reservation_history: [
          {
            id: 'prog-res-001',
            date: '2024-12-02T19:00:00Z',
            program_name: 'ピラティス',
            action: 'reserve' as const,
          },
        ],
      } as StudioProgram,
      otherServices: {
        tanning: [
          {
            id: 'tan-001',
            date: '2024-11-20T14:00:00Z',
            duration: 20,
            store_id: 'store-001',
            store_name: 'Fit365八潮店',
          },
        ],
        locker: [
          {
            locker_number: 'L-101',
            start_date: '2024-01-15',
            status: 'active' as const,
          },
        ],
        purchases: [
          {
            id: 'purchase-001',
            date: '2024-11-15',
            product_name: 'プロテイン',
            quantity: 2,
            amount: 5000,
            payment_method: 'クレジットカード',
          },
        ],
      } as OtherServiceUsage,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service usage' }, { status: 500 });
  }
}
