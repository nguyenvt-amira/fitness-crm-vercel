import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  type GetSummaryQuery,
  GetSummaryQuerySchema,
  type GetSummaryResponse,
  GetSummaryResponseSchema,
} from '@/app/api/_schemas/membership-application.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

import { RiskReason } from '@/lib/api/types.gen';

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

    const roundTo1Decimal = (n: number) => Math.round(n * 10) / 10;

    // Parse elapsed_time strings like "3日9時間経過" or "8時間経過"
    const parseElapsedTimeToMinutes = (elapsedTime?: string) => {
      if (!elapsedTime) return null;
      const daysMatch = elapsedTime.match(/(\d+)\s*日/);
      const hoursMatch = elapsedTime.match(/(\d+)\s*時間/);

      const days = daysMatch ? Number(daysMatch[1]) : 0;
      const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
      const totalMinutes = (days * 24 + hours) * 60;
      return Number.isFinite(totalMinutes) ? totalMinutes : null;
    };

    const avgMinutesToProcessingTime = (avgMinutes: number) => {
      const rounded = Math.max(0, Math.round(avgMinutes));
      const hours = Math.floor(rounded / 60);
      const minutes = rounded % 60;
      return `${hours}h${minutes}m`;
    };

    // Calculate date range based on period
    const now = new Date();
    let dateRangeStart: Date;
    let dateRangeEnd: Date = new Date(now);

    if (start_date && end_date) {
      dateRangeStart = new Date(start_date);
      dateRangeStart.setHours(0, 0, 0, 0);

      dateRangeEnd = new Date(end_date);
      dateRangeEnd.setHours(23, 59, 59, 999);
    } else {
      switch (period) {
        case 'day':
          dateRangeStart = new Date(now);
          dateRangeStart.setHours(0, 0, 0, 0);
          break;
        case 'week':
          dateRangeStart = new Date(now);
          dateRangeStart.setDate(dateRangeStart.getDate() - 6);
          dateRangeStart.setHours(0, 0, 0, 0);
          break;
        case 'month':
        default:
          dateRangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
          dateRangeStart.setHours(0, 0, 0, 0);
          break;
      }
    }

    const allApplications = db.membershipApplications.getAll();
    const periodApplications = allApplications.filter((a) => {
      const appliedAt = new Date(a.applied_at).getTime();
      return appliedAt >= dateRangeStart.getTime() && appliedAt <= dateRangeEnd.getTime();
    });

    const countByStatus = (status: string) =>
      periodApplications.filter((a) => a.status === status).length;

    const totalApplications = periodApplications.length;
    const paymentFailedCount = countByStatus('payment_failed');
    const pendingCount = countByStatus('pending');
    const autoApprovedCount = countByStatus('auto_approved');
    const manualApprovedCount = countByStatus('manual_approved');
    const rejectedCount = countByStatus('rejected');

    const endDayKey = dateRangeEnd.toISOString().slice(0, 10);
    const autoApprovedTodayCount = periodApplications.filter(
      (a) => a.status === 'auto_approved' && a.applied_at.slice(0, 10) === endDayKey,
    ).length;

    const paymentFailedDeadline = (() => {
      const deadlines = periodApplications
        .filter((a) => a.status === 'payment_failed' && a.payment_failed_deadline)
        .map((a) => a.payment_failed_deadline)
        .filter((d): d is string => typeof d === 'string');
      if (deadlines.length === 0) return undefined;
      return deadlines.reduce((max, cur) => (new Date(cur) > new Date(max) ? cur : max));
    })();

    const pendingDeadline = (() => {
      const deadlines = periodApplications
        .filter((a) => a.status === 'pending' && a.pending_deadline)
        .map((a) => a.pending_deadline)
        .filter((d): d is string => typeof d === 'string');
      if (deadlines.length === 0) return undefined;
      return deadlines.reduce((max, cur) => (new Date(cur) > new Date(max) ? cur : max));
    })();

    const riskReasionsBreakdown = {
      blacklist_match: 0,
      duplicate_application: 0,
      payment_failure: 0,
      high_risk_score: 0,
      document_issue: 0,
      other: 0,
    };
    for (const a of periodApplications) {
      switch (a.risk_reason) {
        case RiskReason.BLACKLIST_MATCH:
          riskReasionsBreakdown.blacklist_match++;
          break;
        case RiskReason.DUPLICATE_APPLICATION:
          riskReasionsBreakdown.duplicate_application++;
          break;
        case RiskReason.PAYMENT_FAILURE:
          riskReasionsBreakdown.payment_failure++;
          break;
        case RiskReason.HIGH_RISK_SCORE:
          riskReasionsBreakdown.high_risk_score++;
          break;
        case RiskReason.DOCUMENT_ISSUE:
          riskReasionsBreakdown.document_issue++;
          break;
        default:
          riskReasionsBreakdown.other++;
          break;
      }
    }

    const elapsedMinutes = periodApplications
      .map((a) => parseElapsedTimeToMinutes(a.elapsed_time))
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
    const avgProcessingTime = (() => {
      if (elapsedMinutes.length === 0) return '0h0m';
      const avg = elapsedMinutes.reduce((sum, v) => sum + v, 0) / elapsedMinutes.length;
      return avgMinutesToProcessingTime(avg);
    })();

    const autoApprovalRate =
      totalApplications > 0 ? roundTo1Decimal((autoApprovedCount / totalApplications) * 100) : 0;

    const autoApprovedTodayRate =
      totalApplications > 0
        ? roundTo1Decimal((autoApprovedTodayCount / totalApplications) * 100)
        : 0;

    const response: GetSummaryResponse = {
      summary: {
        total_applications: totalApplications,
        auto_approval_rate: autoApprovalRate,
        auto_approval_count: autoApprovedCount,
        avg_processing_time: avgProcessingTime,
        payment_failed_count: paymentFailedCount,
        payment_failed_deadline: paymentFailedDeadline,
        pending_count: pendingCount,
        pending_deadline: pendingDeadline,
        risk_reasons_breakdown: riskReasionsBreakdown,
        auto_approved_today_count: autoApprovedTodayCount,
        auto_approved_today_rate: autoApprovedTodayRate,
        manual_approved_count: manualApprovedCount,
        rejected_count: rejectedCount,
        // Mock DB doesn't distinguish auto/manual rejection; treat all as manual.
        rejected_auto_count: 0,
        rejected_manual_count: rejectedCount,
        date_range_start: dateRangeStart.toISOString(),
        date_range_end: dateRangeEnd.toISOString(),
      },
      alerts: [
        ...(pendingCount > 0
          ? [
              {
                title: `要確認の入会申し込みが${pendingCount}件あります。`,
                description: '承認もしくは却下の操作を行なってください。',
                type: 'pending' as const,
                count: pendingCount,
                deadline: pendingDeadline ?? dateRangeEnd.toISOString(),
              },
            ]
          : []),
        ...(paymentFailedCount > 0
          ? [
              {
                title: `決済エラーの入会申し込みが${paymentFailedCount}件あります。`,
                description: '再決済手続きを進めてください。',
                type: 'payment_failed' as const,
                count: paymentFailedCount,
                deadline: paymentFailedDeadline ?? dateRangeEnd.toISOString(),
              },
            ]
          : []),
        ...(riskReasionsBreakdown.high_risk_score > 0
          ? [
              {
                title: `高リスクの入会申し込みが${riskReasionsBreakdown.high_risk_score}件あります。`,
                description: '優先的に確認してください。',
                type: 'high_risk' as const,
                count: riskReasionsBreakdown.high_risk_score,
                deadline: dateRangeEnd.toISOString(),
              },
            ]
          : []),
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
