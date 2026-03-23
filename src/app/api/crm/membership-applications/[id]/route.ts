import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import { ErrorResponseSchema } from '@/app/api/_schemas/auth.schema';
import {
  GetApplicationDetailResponse,
  GetApplicationDetailResponseSchema,
  type UpdateMembershipApplicationRequest,
  UpdateMembershipApplicationRequestSchema,
  type UpdateMembershipApplicationResponse,
  UpdateMembershipApplicationResponseSchema,
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

registerRoute({
  method: 'patch',
  path: '/crm/membership-applications/{id}',
  summary: 'Update membership application detail',
  description:
    'Edit membership application data (basic info, contacts, contract). Immutable fields are ignored.',
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
  requestBody: {
    schema: UpdateMembershipApplicationRequestSchema,
    description: 'Editable membership application fields',
  },
  responses: [
    {
      status: 200,
      schema: UpdateMembershipApplicationResponseSchema,
      description: 'Application updated successfully',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request - invalid request body',
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

    const details = db.membershipApplications.getDetails(id);

    const response: GetApplicationDetailResponse = {
      application: {
        ...application,
        ...(details as any),
        payment_method: 'クレジットカード',
        payment_status: 'pending',
        risk_details: [
          {
            reason: application.risk_reason,
            score: application.risk_score,
            description: 'リスク詳細の説明',
          },
        ],
        documents: [
          { type: '身分証明書', url: '/documents/identity.jpg', verified: true },
          { type: '顔写真', url: '/documents/photo.jpg', verified: true },
        ],
        contract_details: {
          plan_id: details?.contract_details?.plan_id ?? 'plan-001',
          plan_name: details?.contract_details?.plan_name ?? application.plan_name,
          start_date: details?.contract_details?.start_date ?? application.scheduled_start_date,
          monthly_fee: 5000,
          contract_period: 12,
          option_ids: details?.contract_details?.option_ids ?? [],
        } as any,
        ekyc: (details as any)?.ekyc,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching application detail:', error);
    return NextResponse.json({ error: 'Failed to fetch application detail' }, { status: 500 });
  }
}

// PATCH /api/crm/membership-applications/{id} - 編集
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = db.membershipApplications.getById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const body = await request.json();
    const validationResult = UpdateMembershipApplicationRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const validatedBody: UpdateMembershipApplicationRequest = validationResult.data;

    // Update base list fields where applicable
    if (validatedBody.basic?.applicant_name) {
      // Keep list view in sync by updating the base record too
      // (status/id/etc are immutable and not handled here)
      (existing as any).applicant_name = validatedBody.basic.applicant_name;
    }
    if (validatedBody.contract?.start_date) {
      (existing as any).scheduled_start_date = validatedBody.contract.start_date;
    }
    if (validatedBody.contract?.plan_name) {
      (existing as any).plan_name = validatedBody.contract.plan_name;
    }

    // Persist editable detail fields
    const contractPatch = validatedBody.contract
      ? {
          contract_details: {
            ...(validatedBody.contract.plan_id ? { plan_id: validatedBody.contract.plan_id } : {}),
            ...(validatedBody.contract.plan_name
              ? { plan_name: validatedBody.contract.plan_name }
              : {}),
            ...(validatedBody.contract.start_date
              ? { start_date: validatedBody.contract.start_date }
              : {}),
            ...(validatedBody.contract.option_ids
              ? { option_ids: validatedBody.contract.option_ids }
              : {}),
          },
        }
      : {};

    db.membershipApplications.updateDetails(id, {
      ...(validatedBody.basic ?? {}),
      ...(validatedBody.contact ?? {}),
      ...contractPatch,
    });

    const details = db.membershipApplications.getDetails(id);

    const response: UpdateMembershipApplicationResponse = {
      success: true,
      application: {
        ...existing,
        ...(details as any),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating application detail:', error);
    return NextResponse.json({ error: 'Failed to update application detail' }, { status: 500 });
  }
}
