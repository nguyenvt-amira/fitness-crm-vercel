import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  type GetOptionDiscountsQuery,
  GetOptionDiscountsQuerySchema,
  type GetOptionDiscountsResponse,
  GetOptionDiscountsResponseSchema,
  type OptionDiscountListItem,
} from '@/app/api/_schemas/option-discount.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/option-discounts',
  summary: 'Get option discounts list',
  description: 'Get paginated list of option discount settings',
  tags: ['Options'],
  query: GetOptionDiscountsQuerySchema,
  responses: [
    { status: 200, schema: GetOptionDiscountsResponseSchema, description: 'Option discount list' },
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

    const validationResult = GetOptionDiscountsQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetOptionDiscountsQuery = validationResult.data;
    const { page, limit, search, discount_type, status, sort_by, sort_order } = query;

    let filtered: OptionDiscountListItem[] = [...db.optionDiscount.getList()];

    if (search) {
      const keyword = search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.code.toLowerCase().includes(keyword) ||
          item.conditions.toLowerCase().includes(keyword) ||
          item.target_contracts.some((contract) => contract.toLowerCase().includes(keyword)) ||
          item.target_options.some((option) => option.toLowerCase().includes(keyword)) ||
          (item.store_name ?? '全店舗').toLowerCase().includes(keyword),
      );
    }

    if (discount_type) {
      filtered = filtered.filter((item) => item.discount_type === discount_type);
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
    const option_discounts = filtered.slice(start, start + limit);

    const response: GetOptionDiscountsResponse = {
      option_discounts,
      pagination: { page, limit, total, total_pages },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching option discounts:', error);
    return NextResponse.json({ error: 'Failed to fetch option discounts' }, { status: 500 });
  }
}
