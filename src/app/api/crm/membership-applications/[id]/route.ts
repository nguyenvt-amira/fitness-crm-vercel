import { NextRequest, NextResponse } from 'next/server';

import type { MembershipApplication } from '@/types/api/membership-application.type';

// GET /api/crm/membership-applications/{id} - 詳細取得
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Mock detailed application data
    const now = new Date();
    const appliedDate = new Date(now);
    appliedDate.setDate(appliedDate.getDate() - 3);
    appliedDate.setHours(12, 30, 0);

    const scheduledStart = new Date(appliedDate);
    scheduledStart.setDate(scheduledStart.getDate() + 5);

    const deadline = new Date(appliedDate);
    deadline.setDate(deadline.getDate() + 7);

    const application: MembershipApplication & {
      // Additional detail fields
      applicant_email?: string;
      applicant_phone?: string;
      applicant_address?: string;
      payment_method?: string;
      payment_status?: string;
      risk_details?: Array<{
        reason: string;
        score: number;
        description: string;
      }>;
      documents?: Array<{
        type: string;
        url: string;
        verified: boolean;
      }>;
      contract_details?: {
        plan_id: string;
        plan_name: string;
        start_date: string;
        monthly_fee: number;
        contract_period: number;
      };
    } = {
      id,
      applicant_name: '山田太郎',
      applied_at: appliedDate.toISOString(),
      elapsed_time: '3日9時間経過',
      risk_score: 61,
      risk_reason: 'ブラックリスト一致',
      plan_name: '通常会員',
      scheduled_start_date: scheduledStart.toISOString().split('T')[0],
      status: 'pending',
      pending_deadline: deadline.toISOString(),
      applicant_email: 'yamada.taro@example.com',
      applicant_phone: '090-1234-5678',
      applicant_address: '東京都渋谷区1-2-3',
      payment_method: 'クレジットカード',
      payment_status: 'pending',
      risk_details: [
        {
          reason: 'ブラックリスト一致',
          score: 50,
          description: '過去の契約不履行履歴あり',
        },
        {
          reason: '重複申込',
          score: 11,
          description: '類似情報での申込が過去に存在',
        },
      ],
      documents: [
        {
          type: '身分証明書',
          url: '/documents/identity.jpg',
          verified: true,
        },
        {
          type: '顔写真',
          url: '/documents/photo.jpg',
          verified: true,
        },
      ],
      contract_details: {
        plan_id: 'plan-001',
        plan_name: '通常会員',
        start_date: scheduledStart.toISOString().split('T')[0],
        monthly_fee: 5000,
        contract_period: 12,
      },
    };

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    return NextResponse.json({ error: 'Failed to fetch application detail' }, { status: 500 });
  }
}
