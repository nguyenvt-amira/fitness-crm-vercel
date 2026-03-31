import { NextRequest, NextResponse } from 'next/server';

import {
  ErrorResponseSchema,
  type GetSummaryQuery,
  GetSummaryQuerySchema,
  type GetSummaryResponse,
  GetSummaryResponseSchema,
} from '@/app/api/_schemas/membership-application.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// Register OpenAPI documentation for this route
registerRoute({
  method: 'get',
  path: '/crm/membership-applications/summary',
  summary: 'Get membership applications summary',
  description: 'Get summary statistics and alerts for membership applications',
  tags: ['Membership Applications'],
  query: GetSummaryQuerySchema,
  responses: [
    {
      status: 200,
      schema: GetSummaryResponseSchema,
      description: 'Summary and alerts',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request - invalid query parameters',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

// GET /api/crm/membership-applications/summary - サマリ取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build query object from searchParams
    const queryObj: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    // Validate query parameters with Zod
    const validationResult = GetSummaryQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetSummaryQuery = validationResult.data;
    const { period = 'month', start_date, end_date } = query;

    // Calculate date range based on period
    const now = new Date();
    let dateRangeStart: Date;
    let dateRangeEnd: Date = new Date(now);

    if (start_date && end_date) {
      dateRangeStart = new Date(start_date);
      dateRangeEnd = new Date(end_date);
    } else {
      switch (period) {
        case 'day':
          dateRangeStart = new Date(now);
          dateRangeStart.setHours(0, 0, 0, 0);
          break;
        case 'week':
          dateRangeStart = new Date(now);
          dateRangeStart.setDate(dateRangeStart.getDate() - 7);
          break;
        case 'month':
        default:
          dateRangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }
    }

    // Mock summary data
    const response: GetSummaryResponse = {
      summary: {
        total_applications: 200,
        auto_approval_rate: 82.5,
        auto_approval_count: 678,
        avg_processing_time: '1h23m',
        payment_failed_count: 3,
        payment_failed_deadline: dateRangeEnd.toISOString(),
        pending_count: 12,
        pending_deadline: dateRangeEnd.toISOString(),
        risk_reasons_breakdown: {
          blacklist_match: 2,
          duplicate_application: 5,
          payment_failure: 3,
          high_risk_score: 2,
          document_issue: 0,
          other: 0,
        },
        auto_approved_today_count: 163,
        auto_approved_today_rate: 85.0,
        manual_approved_count: 21,
        rejected_count: 1,
        rejected_auto_count: 0,
        rejected_manual_count: 1,
        date_range_start: dateRangeStart.toISOString(),
        date_range_end: dateRangeEnd.toISOString(),
      },
      alerts: [
        {
          title: '要確認の入会申し込みが12件あります。',
          description: '承認もしくは却下の操作を行なってください。',
          type: 'pending',
          count: 12,
          deadline: dateRangeEnd.toISOString(),
        },
        {
          title: '決済エラーの入会申し込みが3件あります。',
          description: '再決済手続きを進めてください。',
          type: 'payment_failed',
          count: 3,
          deadline: dateRangeEnd.toISOString(),
        },
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
