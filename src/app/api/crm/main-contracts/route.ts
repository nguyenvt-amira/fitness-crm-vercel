import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  type GetMainContractsQuery,
  GetMainContractsQuerySchema,
  type GetMainContractsResponse,
  GetMainContractsResponseSchema,
  type MainContractListItem,
} from '@/app/api/_schemas/main-contract.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/main-contracts',
  summary: 'Get main contract masters',
  description: 'Get paginated list of main contract masters (G-01)',
  tags: ['Main Contracts'],
  query: GetMainContractsQuerySchema,
  responses: [
    { status: 200, schema: GetMainContractsResponseSchema, description: 'Main contract list' },
    { status: 400, schema: ErrorResponseSchema, description: 'Bad request' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryObj: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const validationResult = GetMainContractsQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetMainContractsQuery = validationResult.data;
    const { page, limit, search, contract_type, brand, status, sort_by, sort_order } = query;

    let filtered: MainContractListItem[] = [...db.mainContracts.getList()];

    if (search) {
      const keyword = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword),
      );
    }
    if (contract_type) {
      filtered = filtered.filter((item) => item.contract_type === contract_type);
    }
    if (brand) {
      filtered = filtered.filter((item) => item.brand === brand);
    }
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    filtered.sort((a, b) => {
      const aVal = a[sort_by] ?? '';
      const bVal = b[sort_by] ?? '';
      const comparison =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal), 'ja');
      return sort_order === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const total_pages = Math.ceil(total / limit) || 0;
    const start = (page - 1) * limit;
    const main_contracts = filtered.slice(start, start + limit);

    const response: GetMainContractsResponse = {
      main_contracts,
      pagination: { page, limit, total, total_pages },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching main contracts:', error);
    return NextResponse.json({ error: 'Failed to fetch main contracts' }, { status: 500 });
  }
}
