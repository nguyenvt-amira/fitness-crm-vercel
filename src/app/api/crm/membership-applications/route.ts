import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
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

// GET /api/crm/membership-applications - 一覧取得
export async function GET(request: NextRequest) {
  try {
    const RISK_REASONS = [
      'blacklist_match',
      'duplicate_application',
      'payment_failure',
      'high_risk_score',
      'document_issue',
      'other',
    ] as const;
    const isRiskReason = (
      value: string,
    ): value is GetMembershipApplicationsResponse['applications'][number]['risk_reason'] =>
      (RISK_REASONS as readonly string[]).includes(value);

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

    // Get data from shared mock DB
    const allApplications = db.membershipApplications.getAll();

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
      } else if (sort_by === 'pending_deadline') {
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
    const paginated: GetMembershipApplicationsResponse['applications'] = filtered
      .slice(startIndex, endIndex)
      .map((app) => ({
        ...app,
        risk_reason: isRiskReason(app.risk_reason) ? app.risk_reason : 'other',
      }));

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

    const results = application_ids.map((id: string) => {
      const riskScore = Math.floor(Math.random() * 100);
      const approved = riskScore < 70;

      const application = db.membershipApplications.getById(id);
      if (!application) {
        return {
          application_id: id,
          approved: false,
          risk_score: riskScore,
          reason: 'Application not found',
        };
      }

      // Idempotency: never downgrade an already approved application.
      if (application.status === 'manual_approved' || application.status === 'auto_approved') {
        return {
          application_id: id,
          approved: true,
          risk_score: riskScore,
          reason: '既に承認済み',
        };
      }

      if (approved) {
        const updatedApplication = db.membershipApplications.updateStatus(id, 'auto_approved');
        if (!updatedApplication) {
          return {
            application_id: id,
            approved: false,
            risk_score: riskScore,
            reason: 'Failed to update status',
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

        const existingContractRow = db.contracts.getByApplicationId(id);
        if (!existingContractRow) {
          const member = db.members.createFromApplication(applicationForContract);
          db.contracts.createFromApprovedApplication({
            application: applicationForContract,
            member_id: member.basic_info.id,
          });
        }
      } else {
        // Rejection: only status update is required.
        if (application.status !== 'rejected') {
          db.membershipApplications.updateStatus(id, 'rejected');
        }
      }

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
