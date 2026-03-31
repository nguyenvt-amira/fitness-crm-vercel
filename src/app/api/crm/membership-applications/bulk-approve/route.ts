import { NextRequest, NextResponse } from 'next/server';

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

    // Mock bulk approval result
    const results = application_ids.map((id: string) => ({
      application_id: id,
      approved: true,
      approved_at: new Date().toISOString(),
    }));

    const response: BulkApproveResponse = {
      success: true,
      results,
      summary: {
        total: application_ids.length,
        approved: results.length,
        failed: 0,
      },
      approval_reason: approval_reason || '一括承認',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error bulk approving applications:', error);
    return NextResponse.json({ error: 'Failed to bulk approve applications' }, { status: 500 });
  }
}
