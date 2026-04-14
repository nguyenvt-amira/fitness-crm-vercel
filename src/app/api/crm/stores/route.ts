import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  type GetStoresQuery,
  GetStoresQuerySchema,
  type GetStoresResponse,
  GetStoresResponseSchema,
  type Store,
} from '@/app/api/_schemas/store.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/stores',
  summary: 'Get stores list',
  description: 'Get paginated list of stores with filtering and sorting',
  tags: ['Stores'],
  query: GetStoresQuerySchema,
  responses: [
    { status: 200, schema: GetStoresResponseSchema, description: 'List of stores' },
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

    const validationResult = GetStoresQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetStoresQuery = validationResult.data;
    const {
      page,
      limit,
      search,
      brand,
      area,
      status: statusFilter,
      sort_by = 'store_id',
      sort_order = 'asc',
    } = query;

    let filtered: Store[] = [...db.stores.getList()];

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.club_code.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.store_id.toLowerCase().includes(q) ||
          s.brand.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.operating_company_name.toLowerCase().includes(q),
      );
    }

    if (brand) {
      filtered = filtered.filter((s) => s.brand === brand);
    }
    if (area) {
      filtered = filtered.filter((s) => s.area === area);
    }
    if (statusFilter) {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    const sortKey = sort_by as keyof Store;
    filtered.sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), 'ja');
      return sort_order === 'asc' ? cmp : -cmp;
    });

    const total = filtered.length;
    const total_pages = Math.ceil(total / limit) || 0;
    const start = (page - 1) * limit;
    const stores = filtered.slice(start, start + limit);

    const response: GetStoresResponse = {
      stores,
      pagination: { page, limit, total, total_pages },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}
