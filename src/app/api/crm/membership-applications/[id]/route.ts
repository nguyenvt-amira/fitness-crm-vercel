import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import { ErrorResponseSchema } from '@/app/api/_schemas/auth.schema';
import {
  GetApplicationDetailResponse,
  GetApplicationDetailResponseSchema,
} from '@/app/api/_schemas/membership-application.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/membership-applications/{id}',
  summary: 'Get membership application detail',
  description: 'Get detailed information about a specific membership application',
  tags: ['Membership Applications'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Membership application ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    {
      status: 200,
      schema: GetApplicationDetailResponseSchema,
      description: 'Application detail',
    },
    {
      status: 404,
      schema: ErrorResponseSchema,
      description: 'Application not found',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

// GET /api/crm/membership-applications/{id} - 詳細取得
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const application = db.membershipApplications.getById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const response: GetApplicationDetailResponse = {
      application: {
        ...application,
        applicant_email: 'yamada.taro@example.com',
        applicant_phone: '090-1234-5678',
        applicant_address: '東京都渋谷区1-2-3',
        payment_method: 'クレジットカード',
        payment_status: 'pending',
        risk_details: [
          { reason: application.risk_reason, score: application.risk_score, description: '' },
        ],
        documents: [
          { type: '身分証明書', url: '/documents/identity.jpg', verified: true },
          { type: '顔写真', url: '/documents/photo.jpg', verified: true },
        ],
        contract_details: {
          plan_id: 'plan-001',
          plan_name: application.plan_name,
          start_date: application.scheduled_start_date,
          monthly_fee: 5000,
          contract_period: 12,
        },
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching application detail:', error);
    return NextResponse.json({ error: 'Failed to fetch application detail' }, { status: 500 });
  }
}
