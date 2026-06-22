import { NextRequest, NextResponse } from 'next/server';

import { getAuthUserFromRequest } from '@/app/api/_lib/auth';
import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  type GetLockerPendingSlotsQuery,
  GetLockerPendingSlotsQuerySchema,
  type GetLockerPendingSlotsResponse,
  GetLockerPendingSlotsResponseSchema,
  type LockerPendingSlotListItem,
} from '@/app/api/_schemas/locker.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/lockers/pending-slots',
  summary: 'Get pending locker slot list',
  description: 'Get paginated list of pending locker slots with filtering and sorting',
  tags: ['Lockers'],
  query: GetLockerPendingSlotsQuerySchema,
  responses: [
    {
      status: 200,
      schema: GetLockerPendingSlotsResponseSchema,
      description: 'List of pending locker slots',
    },
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

    const validationResult = GetLockerPendingSlotsQuerySchema.safeParse(queryObj);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const query: GetLockerPendingSlotsQuery = validationResult.data;
    const {
      page,
      limit,
      search,
      store_id,
      locker_location,
      cancel_date_from,
      cancel_date_to,
      sort_by = 'pending_since',
      sort_order = 'asc',
    } = query;

    let filtered: LockerPendingSlotListItem[] = [...db.lockerPendingSlots.getList()];

    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        (row) =>
          row.slot_number.toLowerCase().includes(searchLower) ||
          row.member_name.toLowerCase().includes(searchLower),
      );
    }

    if (store_id) {
      filtered = filtered.filter((row) => row.store_id === store_id);
    }

    if (locker_location) {
      filtered = filtered.filter((row) => row.locker_location === locker_location);
    }

    if (cancel_date_from) {
      filtered = filtered.filter((row) => row.cancel_date >= cancel_date_from);
    }

    if (cancel_date_to) {
      filtered = filtered.filter((row) => row.cancel_date <= cancel_date_to);
    }

    filtered.sort((a, b) => {
      const result = compareValues(a[sort_by], b[sort_by]);
      return sort_order === 'asc' ? result : -result;
    });

    const total = filtered.length;
    const total_pages = Math.ceil(total / limit) || 0;
    const start = (page - 1) * limit;

    const response: GetLockerPendingSlotsResponse = {
      pending_slots: filtered.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        total_pages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching pending locker slots:', error);
    return NextResponse.json({ error: 'Failed to fetch pending locker slots' }, { status: 500 });
  }
}
