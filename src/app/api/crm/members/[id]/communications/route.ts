import { NextRequest, NextResponse } from 'next/server';

import type {
  InquiryRecord,
  NotificationHistory,
  PhoneRecord,
  StaffMemo,
} from '@/types/api/member.type';
import { MemoType } from '@/types/api/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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
      memos: [
        {
          id: 'memo-001',
          date: '2024-11-15T10:00:00Z',
          type: MemoType.VIP,
          content: 'VIP会員として特別対応が必要',
          created_by: '山田 花子',
        },
      ] as StaffMemo[],
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
