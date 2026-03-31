import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  type BulkApproveRequest,
  BulkApproveRequestSchema,
  type BulkApproveResponse,
  BulkApproveResponseSchema,
  ErrorResponseSchema,
} from '@/app/api/_schemas/membership-application.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'post',
  path: '/crm/membership-applications/bulk-approve',
  summary: 'Bulk approve membership applications',
  description: 'Approve multiple membership applications at once',
  tags: ['Membership Applications'],
  requestBody: {
    schema: BulkApproveRequestSchema,
    description: 'List of application IDs to approve',
  },
  responses: [
    {
      status: 200,
      schema: BulkApproveResponseSchema,
      description: 'Bulk approval results',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request - invalid request body',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

// POST /api/crm/membership-applications/bulk-approve - 一括承認
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = BulkApproveRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const validatedBody: BulkApproveRequest = validationResult.data;
    const { application_ids, approval_reason } = validatedBody;

    const now = new Date();

    const results = application_ids.map((id: string) => {
      const application = db.membershipApplications.getById(id);
      if (!application) {
        return {
          application_id: id,
          approved: false,
          approved_at: now.toISOString(),
        };
      }

      // Idempotency: if already approved, just ensure status is manual_approved.
      if (application.status === 'manual_approved' || application.status === 'auto_approved') {
        db.membershipApplications.updateStatus(id, 'manual_approved');
        return {
          application_id: id,
          approved: true,
          approved_at: now.toISOString(),
        };
      }

      // If explicitly rejected, don't allow "bulk approve" to proceed.
      if (application.status === 'rejected') {
        return {
          application_id: id,
          approved: false,
          approved_at: now.toISOString(),
        };
      }

      const updatedApplication = db.membershipApplications.updateStatus(id, 'manual_approved');
      if (!updatedApplication) {
        return {
          application_id: id,
          approved: false,
          approved_at: now.toISOString(),
        };
      }

      // Prefer edited detail fields (plan/start_date) when creating contract.
      const details = db.membershipApplications.getDetails(id);
      const applicationForContract = {
        ...updatedApplication,
        ...(details?.applicant_name ? { applicant_name: details.applicant_name } : {}),
        ...(details?.contract_details?.plan_name
          ? { plan_name: details.contract_details.plan_name }
          : {}),
        ...(details?.contract_details?.start_date
          ? { scheduled_start_date: details.contract_details.start_date }
          : {}),
      };

      // Create member + contract to keep list/detail consistent.
      const existingContractRow = db.contracts.getByApplicationId(id);
      if (existingContractRow) {
        return {
          application_id: id,
          approved: true,
          approved_at: now.toISOString(),
        };
      }
      const member = db.members.createFromApplication(details);
      db.contracts.createFromApprovedApplication({
        application: applicationForContract,
        member_id: member.basic_info.id,
      });

      return {
        application_id: id,
        approved: true,
        approved_at: now.toISOString(),
      };
    });

    const approvedCount = results.filter((r) => r.approved).length;
    const failedCount = results.length - approvedCount;

    const response: BulkApproveResponse = {
      success: failedCount === 0,
      results,
      summary: {
        total: application_ids.length,
        approved: approvedCount,
        failed: failedCount,
      },
      approval_reason: approval_reason || '一括承認',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error bulk approving applications:', error);
    return NextResponse.json({ error: 'Failed to bulk approve applications' }, { status: 500 });
  }
}
