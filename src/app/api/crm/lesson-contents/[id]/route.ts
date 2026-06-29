import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  type GetLessonContentDetailResponse,
  GetLessonContentDetailResponseSchema,
} from '@/app/api/_schemas/lesson-content-detail.schema';
import { ErrorResponseSchema } from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/lesson-contents/{id}',
  summary: 'Get lesson content detail',
  description:
    'Get the full read-only detail for a single lesson content master (studio / body care / personal)',
  tags: ['LessonContents'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Master ID (LSN-* / BDC-* / PLN-*)',
    },
  ],
  responses: [
    {
      status: 200,
      schema: GetLessonContentDetailResponseSchema,
      description: 'Lesson content detail',
    },
    { status: 404, schema: ErrorResponseSchema, description: 'Lesson content not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const detail = db.lessonContentDetails.getDetail(id);
    if (!detail) {
      return NextResponse.json({ error: 'Lesson content not found' }, { status: 404 });
    }

    const response: GetLessonContentDetailResponse = { data: detail };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching lesson content detail:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson content detail' }, { status: 500 });
  }
}
