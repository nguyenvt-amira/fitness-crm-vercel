import { NextRequest, NextResponse } from 'next/server';

import { ErrorResponseSchema, GetContractsResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

import { GetCrmMembersByIdContractsResponse } from '@/lib/api';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/members/{id}/contracts',
  summary: 'Get member contracts',
  description: 'Get contract information for a member',
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
      schema: GetContractsResponseSchema,
      description: 'Contract information',
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

/** Mock data for GET /crm/members/{id}/contracts — 契約情報タブ用 */
function buildMockContracts(memberId: string): GetCrmMembersByIdContractsResponse {
  return {
    main_contract: {
      plan_name: 'スタンダードプラン',
      monthly_fee: 8580, // 税込
      start_date: '2024-01-15',
      penalty_period_end: '2025-01-14',
      change_history: [
        {
          changed_at: '2024-01-15T00:00:00+09:00',
          previous_plan: 'ベーシックプラン',
          new_plan: 'スタンダードプラン',
          reason: 'プラン変更希望',
        },
        {
          changed_at: '2023-01-01T00:00:00+09:00',
          previous_plan: '—',
          new_plan: 'ベーシックプラン',
          reason: '入会',
        },
      ],
    },
    option_contracts: [
      {
        id: 'opt-001',
        name: 'パーソナルトレーニング',
        monthly_fee: 11000,
        start_date: '2024-02-01',
        next_billing_date: '2025-03-01',
      },
      {
        id: 'opt-002',
        name: '水素水',
        monthly_fee: 550,
        start_date: '2024-01-15',
        next_billing_date: '2025-03-15',
      },
    ],
    option_change_history: [
      {
        changed_at: '2024-02-01T00:00:00+09:00',
        option_name: 'パーソナルトレーニング',
        action_type: 'add',
        notes: 'オプション追加',
      },
      {
        changed_at: '2023-09-30T00:00:00+09:00',
        option_name: '水素水（旧店舗）',
        action_type: 'remove',
        notes: '転店に伴い解約',
      },
    ],
    special_contracts: {
      anshin_support: {
        enrolled: true,
        start_date: '2024-01-15',
      },
      mutual_use: {
        enrolled: true,
        start_date: '2024-01-15',
      },
      security_fee: {
        enrolled: true,
        applied_month: '2025-03',
      },
      maintenance_fee: {
        enrolled: true,
        applied_month: '2025-03',
      },
    },
    payment_info: {
      method: 'credit_card',
      card_number: '**** **** **** 1234',
      cardholder_name: 'SATOU HANAKO',
      expiry_date: '12/28',
      billing_day: 27,
      last_payment_date: '2025-02-27',
      last_payment_amount: 9680,
      status: 'normal',
      payment_history: [
        {
          date: '2025-02-27',
          amount: 9680,
          breakdown: '月会費 8,580円 + オプション 1,100円',
          status: 'success',
          notes: '',
        },
        {
          date: '2025-01-27',
          amount: 9680,
          breakdown: '月会費 8,580円 + オプション 1,100円',
          status: 'success',
        },
      ],
    },
    unpaid_info: null,
    campaigns: {
      active: [
        {
          campaign_name: '春の入会キャンペーン',
          period_start: '2025-03-01',
          period_end: '2025-03-31',
          discount_content: '入会金50%OFF',
          remaining_days: 15,
        },
      ],
      history: [
        {
          applied_at: '2024-01-15',
          campaign_name: '新年キャンペーン',
          content: '初月月会費無料',
          status: 'expired',
        },
      ],
    },
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = buildMockContracts(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
