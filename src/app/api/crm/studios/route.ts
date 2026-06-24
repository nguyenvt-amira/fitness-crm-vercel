import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GetStudiosQuerySchema,
  GetStudiosResponseSchema,
} from '@/app/api/_schemas/lesson-schedule.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/studios',
  summary: 'List studios',
  description: 'Get studio list, optionally filtered by store',
  tags: ['LessonSchedules'],
  query: GetStudiosQuerySchema,
  responses: [
    { status: 200, schema: GetStudiosResponseSchema, description: 'Studio list' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(request: NextRequest) {
  try {
    const storeId = request.nextUrl.searchParams.get('store_id');

    const studios = storeId ? db.studios.getByStoreId(storeId) : db.studios.getList();
    return NextResponse.json({ studios });
  } catch (error) {
    console.error('GET /crm/studios error:', error);
    return NextResponse.json({ error: 'Failed to fetch studios' }, { status: 500 });
  }
}
