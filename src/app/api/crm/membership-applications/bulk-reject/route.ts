import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  type BulkRejectRequest,
  BulkRejectRequestSchema,
  type BulkRejectResponse,
  BulkRejectResponseSchema,
  ErrorResponseSchema,
} from '@/app/api/_schemas/membership-application.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'post',
  path: '/crm/membership-applications/bulk-reject',
  summary: 'Bulk reject membership applications',
  description: 'Reject multiple membership applications at once',
  tags: ['Membership Applications'],
  requestBody: {
    schema: BulkRejectRequestSchema,
    description: 'List of application IDs to reject',
  },
  responses: [
    {
      status: 200,
      schema: BulkRejectResponseSchema,
      description: 'Bulk rejection results',
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

// POST /api/crm/membership-applications/bulk-reject - 一括却下
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = BulkRejectRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const validatedBody: BulkRejectRequest = validationResult.data;
    const { application_ids, rejection_reason, staff_id } = validatedBody;

    const results = application_ids.map((id: string) => {
      const updated = db.membershipApplications.updateStatus(id, 'rejected');
      if (!updated) {
        return {
          application_id: id,
          rejected: false,
          error: 'Application not found',
        };
      }
      return {
        application_id: id,
        rejected: true,
        rejected_at: new Date().toISOString(),
      };
    });

    const rejectedCount = results.filter((r) => r.rejected).length;
    const failedCount = results.length - rejectedCount;

    const response: BulkRejectResponse = {
      success: failedCount === 0,
      results,
      summary: {
        total: application_ids.length,
        rejected: rejectedCount,
        failed: failedCount,
      },
      rejection_reason,
      rejected_by: staff_id || 'staff-001',
    };

    // Ensure response matches schema (dev safety)
    const responseValidation = BulkRejectResponseSchema.safeParse(response);
    if (!responseValidation.success) {
      return NextResponse.json({ error: 'Invalid response shape' }, { status: 500 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error bulk rejecting applications:', error);
    return NextResponse.json({ error: 'Failed to bulk reject applications' }, { status: 500 });
  }
}
