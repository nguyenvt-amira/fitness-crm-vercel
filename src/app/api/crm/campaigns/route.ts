import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  type CampaignListItem,
  ErrorResponseSchema,
  type GetCampaignsQuery,
  GetCampaignsQuerySchema,
  type GetCampaignsResponse,
  GetCampaignsResponseSchema,
} from '@/app/api/_schemas/campaign.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/campaigns',
  summary: 'Get campaign masters',
  description: 'Get paginated list of campaign masters (G-03)',
  tags: ['Campaigns'],
  query: GetCampaignsQuerySchema,
  responses: [
    { status: 200, schema: GetCampaignsResponseSchema, description: 'Campaign list' },
    { status: 400, schema: ErrorResponseSchema, description: 'Bad request' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

function toDayKey(value: string): number {
  return Number(value.replaceAll('-', '').replaceAll('/', ''));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryObj: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const validationResult = GetCampaignsQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetCampaignsQuery = validationResult.data;
    const {
      page,
      limit,
      search,
      brand,
      accept_status,
      recruitment_period_start,
      recruitment_period_end,
      sort_by,
      sort_order,
    } = query;

    let filtered: CampaignListItem[] = [...db.campaigns.getList()];

    if (search) {
      const keyword = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.code.toLowerCase().includes(keyword),
      );
    }
    if (brand) {
      filtered = filtered.filter((item) => item.brand === brand);
    }
    if (accept_status) {
      filtered = filtered.filter((item) => item.accept_status === accept_status);
    }
    if (recruitment_period_start) {
      const startKey = toDayKey(recruitment_period_start);
      filtered = filtered.filter((item) => toDayKey(item.recruitment_period_start) >= startKey);
    }
    if (recruitment_period_end) {
      const endKey = toDayKey(recruitment_period_end);
      filtered = filtered.filter((item) => toDayKey(item.recruitment_period_end) <= endKey);
    }

    filtered.sort((a, b) => {
      const aVal =
        sort_by === 'recruitment_period_start' || sort_by === 'recruitment_period_end'
          ? toDayKey(a[sort_by])
          : a[sort_by];
      const bVal =
        sort_by === 'recruitment_period_start' || sort_by === 'recruitment_period_end'
          ? toDayKey(b[sort_by])
          : b[sort_by];
      const comparison =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal), 'ja');
      return sort_order === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const total_pages = Math.ceil(total / limit) || 0;
    const start = (page - 1) * limit;
    const campaigns = filtered.slice(start, start + limit);

    const response: GetCampaignsResponse = {
      campaigns,
      pagination: { page, limit, total, total_pages },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
