import { NextRequest, NextResponse } from 'next/server';

import { ErrorResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';
import { z } from 'zod';

import type { InquiryRecord, NotificationHistory, PhoneRecord } from '@/types/api/member.type';

import { getMemos } from '../memos/route';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/members/{id}/communications',
  summary: 'Get member communications',
  description: 'Get communication history for a member',
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
          inquiries: z.array(z.any()).openapi({
            description: 'Inquiry records',
          }),
          memos: z.array(z.any()).openapi({
            description: 'Staff memos',
          }),
          notifications: z.any().openapi({
            description: 'Notification history',
          }),
          phoneRecords: z.array(z.any()).openapi({
            description: 'Phone records',
          }),
        })
        .openapi({
          title: 'GetCommunicationsResponse',
          description: 'Response for getting communications',
        }),
      description: 'Communication history',
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
    const memos = getMemos(id);

    const mockData = {
      inquiries: [
        {
          id: 'inq-001',
          date: '2024-11-20T10:00:00Z',
          content: '契約プランについて問い合わせ',
          staff_name: '田中 太郎',
          result: 'プラン変更を案内',
          status: 'completed' as const,
        },
      ] as InquiryRecord[],
      memos,
      notifications: {
        emails: [
          {
            id: 'email-001',
            sent_at: '2024-11-20T10:00:00Z',
            subject: '会員情報更新のお知らせ',
            opened: true,
            status: 'success' as const,
          },
        ],
        sms: [
          {
            id: 'sms-001',
            sent_at: '2024-11-15T14:00:00Z',
            content: '来館ありがとうございます',
            status: 'success' as const,
          },
        ],
        push: [
          {
            id: 'push-001',
            sent_at: '2024-11-25T18:00:00Z',
            title: '新しいプログラムのお知らせ',
            opened: false,
          },
        ],
      } as NotificationHistory,
      phoneRecords: [
        {
          id: 'phone-001',
          date: '2024-11-10T15:00:00Z',
          content: '休会手続きについて',
          staff_name: '佐藤 健太',
          result: '手続き完了',
        },
      ] as PhoneRecord[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch communications' }, { status: 500 });
  }
}
