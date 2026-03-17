import { NextRequest, NextResponse } from 'next/server';

import {
  type AutoJudgeRequest,
  AutoJudgeRequestSchema,
  type AutoJudgeResponse,
  AutoJudgeResponseSchema,
  ErrorResponseSchema,
  type GetMembershipApplicationsQuery,
  GetMembershipApplicationsQuerySchema,
  type GetMembershipApplicationsResponse,
  GetMembershipApplicationsResponseSchema,
} from '@/app/api/_schemas/membership-application.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

import type {
  MembershipApplication,
  MembershipApplicationStatus,
} from '@/types/api/membership-application.type';

// Register OpenAPI documentation for GET route
registerRoute({
  method: 'get',
  path: '/crm/membership-applications',
  summary: 'Get membership applications list',
  description: 'Get paginated list of membership applications with filtering and sorting',
  tags: ['Membership Applications'],
  query: GetMembershipApplicationsQuerySchema,
  responses: [
    {
      status: 200,
      schema: GetMembershipApplicationsResponseSchema,
      description: 'List of membership applications',
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

// Register OpenAPI documentation for POST route (auto-judge)
registerRoute({
  method: 'post',
  path: '/crm/membership-applications',
  summary: 'Auto-judge membership applications',
  description: 'Execute auto-judge on multiple membership applications',
  tags: ['Membership Applications'],
  requestBody: {
    schema: AutoJudgeRequestSchema,
    description: 'List of application IDs to auto-judge',
  },
  responses: [
    {
      status: 200,
      schema: AutoJudgeResponseSchema,
      description: 'Auto-judge results',
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

// Mock data generator
function generateMockApplications(count: number): MembershipApplication[] {
  const applications: MembershipApplication[] = [];
  const names = ['山田太郎', '佐藤花子', '鈴木一郎', '田中次郎', '中村三郎'];
  const plans = ['通常会員', 'プレミアム会員', 'ベーシックプラン'];
  const riskReasons = ['ブラックリスト一致', '重複申込', '決済失敗', '高リスクスコア', '書類問題'];
  const statuses: MembershipApplicationStatus[] = [
    'pending',
    'payment_failed',
    'auto_approved',
    'manual_approved',
    'rejected',
  ];

  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const appliedDate = new Date(now);
    appliedDate.setDate(appliedDate.getDate() - (i % 10));
    appliedDate.setHours(12 - (i % 12), i % 60, 0);

    const scheduledStart = new Date(appliedDate);
    scheduledStart.setDate(scheduledStart.getDate() + 5);

    const elapsedHours = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60));
    const elapsedDays = Math.floor(elapsedHours / 24);
    const remainingHours = elapsedHours % 24;
    const elapsedTime =
      elapsedDays > 0 ? `${elapsedDays}日${remainingHours}時間経過` : `${elapsedHours}時間経過`;

    const status = statuses[i % statuses.length];
    const deadline = new Date(appliedDate);
    deadline.setDate(deadline.getDate() + 7);

    applications.push({
      id: `APP-${String(i).padStart(5, '0')}`,
      applicant_name: names[i % names.length],
      applied_at: appliedDate.toISOString(),
      elapsed_time: elapsedTime,
      risk_score: 30 + (i % 70),
      risk_reason: riskReasons[i % riskReasons.length],
      plan_name: plans[i % plans.length],
      scheduled_start_date: scheduledStart.toISOString().split('T')[0],
      status,
      ...(status === 'payment_failed' && {
        payment_failed_deadline: deadline.toISOString(),
      }),
      ...(status === 'pending' && {
        pending_deadline: deadline.toISOString(),
      }),
    });
  }

  return applications;
}

// GET /api/crm/membership-applications - 一覧取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build query object from searchParams
    const queryObj: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    // Validate query parameters with Zod
    const validationResult = GetMembershipApplicationsQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetMembershipApplicationsQuery = validationResult.data;
    const { page, limit, status, risk_reason, sort_by, sort_order, search } = query;

    // Generate mock data
    const allApplications = generateMockApplications(200);

    // Apply filters
    let filtered = allApplications;

    if (status) {
      filtered = filtered.filter((app) => app.status === status);
    }

    if (risk_reason) {
      filtered = filtered.filter((app) => app.risk_reason === risk_reason);
    }

    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        (app) =>
          app.applicant_name.includes(search) ||
          app.applicant_name.toLowerCase().includes(searchLower) ||
          app.plan_name.includes(search),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sort_by === 'applied_at') {
        comparison = new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime();
      } else if (sort_by === 'risk_score') {
        comparison = a.risk_score - b.risk_score;
      } else if (sort_by === 'deadline') {
        const aDeadline = a.pending_deadline || a.payment_failed_deadline || '';
        const bDeadline = b.pending_deadline || b.payment_failed_deadline || '';
        comparison = aDeadline.localeCompare(bDeadline);
      }

      return sort_order === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const total = filtered.length;
    const total_pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = filtered.slice(startIndex, endIndex);

    const response: GetMembershipApplicationsResponse = {
      applications: paginated,
      pagination: {
        total,
        total_pages,
        current_page: page,
        limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching membership applications:', error);
    return NextResponse.json({ error: 'Failed to fetch membership applications' }, { status: 500 });
  }
}

// POST /api/crm/membership-applications/auto-judge - 自動判定実行
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = AutoJudgeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const validatedBody: AutoJudgeRequest = validationResult.data;
    const { application_ids } = validatedBody;

    // Mock auto-judge result
    const results = application_ids.map((id: string) => {
      const riskScore = Math.floor(Math.random() * 100);
      const approved = riskScore < 70; // Auto approve if risk score < 70

      return {
        application_id: id,
        approved,
        risk_score: riskScore,
        reason: approved ? '自動承認' : 'リスクスコアが高すぎます',
      };
    });

    const response: AutoJudgeResponse = {
      results,
      summary: {
        total: application_ids.length,
        approved: results.filter((r) => r.approved).length,
        rejected: results.filter((r) => !r.approved).length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error executing auto-judge:', error);
    return NextResponse.json({ error: 'Failed to execute auto-judge' }, { status: 500 });
  }
}
