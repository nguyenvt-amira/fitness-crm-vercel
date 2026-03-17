import { NextRequest, NextResponse } from 'next/server';

import { ErrorResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';
import { z } from 'zod';

import type { StoreUsage, UsageSummary, VisitRecord } from '@/types/api/member.type';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/members/{id}/usage-history',
  summary: 'Get member usage history',
  description: 'Get usage history for a member',
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
          summary: z.any().openapi({
            description: 'Usage summary',
          }),
          storeUsage: z.array(z.any()).openapi({
            description: 'Store usage statistics',
          }),
          visitRecords: z.array(z.any()).openapi({
            description: 'Visit records',
          }),
        })
        .openapi({
          title: 'GetUsageHistoryResponse',
          description: 'Response for getting usage history',
        }),
      description: 'Usage history',
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
      summary: {
        total_visits: 45,
        average_stay_time: 90,
        last_visit_date: '2024-11-25',
        frequent_time_slot: '18-21時',
        frequent_day_of_week: '火曜日',
      } as UsageSummary,
      storeUsage: [
        {
          store_id: 'store-001',
          store_name: 'Fit365八潮店',
          visit_count: 30,
          usage_rate: 66.7,
          average_stay_time: 90,
        },
        {
          store_id: 'store-002',
          store_name: 'Fit365新宿店',
          visit_count: 15,
          usage_rate: 33.3,
          average_stay_time: 85,
        },
      ] as StoreUsage[],
      visitRecords: [
        {
          id: 'vr-001',
          entry_time: '2024-11-25T18:00:00Z',
          exit_time: '2024-11-25T19:30:00Z',
          stay_time: 90,
          store_id: 'store-001',
          store_name: 'Fit365八潮店',
          entry_method: 'qr_code',
        },
        {
          id: 'vr-002',
          entry_time: '2024-11-24T19:00:00Z',
          exit_time: '2024-11-24T20:15:00Z',
          stay_time: 75,
          store_id: 'store-001',
          store_name: 'Fit365八潮店',
          entry_method: 'face_recognition',
        },
      ] as VisitRecord[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch usage history' }, { status: 500 });
  }
}
