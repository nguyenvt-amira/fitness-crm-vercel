import { NextRequest, NextResponse } from 'next/server';

import { getAuthUserFromRequest } from '@/app/api/_lib/auth';
import { db } from '@/app/api/_mock-db';
import {
  CreateLockerRequestSchema,
  type CreateLockerResponse,
  CreateLockerResponseSchema,
  ErrorResponseSchema,
  type GetLockersQuery,
  GetLockersQuerySchema,
  type GetLockersResponse,
  GetLockersResponseSchema,
  type LockerListItem,
} from '@/app/api/_schemas/locker.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'post',
  path: '/crm/lockers',
  summary: 'Create locker',
  description: 'Create a new locker with slots',
  tags: ['Lockers'],
  requestBody: {
    schema: CreateLockerRequestSchema,
    description: 'Locker create payload',
  },
  responses: [
    { status: 200, schema: CreateLockerResponseSchema, description: 'Locker created successfully' },
    { status: 400, schema: ErrorResponseSchema, description: 'Bad request' },
    { status: 409, schema: ErrorResponseSchema, description: 'Location symbol conflict' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

registerRoute({
  method: 'get',
  path: '/crm/lockers',
  summary: 'Get locker list',
  description: 'Get paginated list of lockers with filtering and sorting',
  tags: ['Lockers'],
  query: GetLockersQuerySchema,
  responses: [
    { status: 200, schema: GetLockersResponseSchema, description: 'List of lockers' },
    { status: 400, schema: ErrorResponseSchema, description: 'Bad request' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

function compareValues(a: string | number, b: string | number) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b), 'ja');
}

export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUserFromRequest(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const queryObj: Record<string, string | undefined> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const validationResult = GetLockersQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetLockersQuery = validationResult.data;
    const { page, limit, search, shape, sort_by = 'locker_id', sort_order = 'asc' } = query;

    let filtered: LockerListItem[] = [...db.lockers.getList()];

    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        (row) =>
          row.locker_id.toLowerCase().includes(searchLower) ||
          row.area.toLowerCase().includes(searchLower),
      );
    }

    if (shape) {
      filtered = filtered.filter((row) => row.shape === shape);
    }

    filtered.sort((a, b) => {
      const result = compareValues(a[sort_by], b[sort_by]);
      return sort_order === 'asc' ? result : -result;
    });

    const total = filtered.length;
    const total_pages = Math.ceil(total / limit) || 0;
    const start = (page - 1) * limit;

    const response: GetLockersResponse = {
      lockers: filtered.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        total_pages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching lockers:', error);
    return NextResponse.json({ error: 'Failed to fetch lockers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUserFromRequest(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const validationResult = CreateLockerRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    try {
      const locker = db.lockers.create(validationResult.data);
      const response: CreateLockerResponse = {
        message: 'ロッカーを登録しました',
        locker,
      };
      return NextResponse.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create locker';
      if (message.includes('Location symbol')) {
        return NextResponse.json({ error: '同一店舗内で既に使用されています' }, { status: 409 });
      }
      if (message.includes('Store not found')) {
        return NextResponse.json({ error: '店舗が見つかりません' }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating locker:', error);
    return NextResponse.json({ error: 'Failed to create locker' }, { status: 500 });
  }
}
