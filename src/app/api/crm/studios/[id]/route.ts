import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import { GetStudioDetailResponseSchema } from '@/app/api/_schemas/studio-detail.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

import type { StaffRole } from '@/lib/api/types.gen';

registerRoute({
  method: 'get',
  path: '/crm/studios/{id}',
  summary: 'Get studio detail',
  description:
    'Get complete studio detail information including linked lessons, images, layout, and utilization',
  tags: ['Studios'],
  responses: [
    {
      status: 200,
      schema: GetStudioDetailResponseSchema,
      description: 'Studio detail',
    },
    { status: 404, description: 'Studio not found' },
    { status: 500, description: 'Internal server error' },
  ],
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Studio ID is required' }, { status: 400 });
    }

    // Phase 1 mock: return all studio details (role scoping will be wired to auth context in Phase 2)
    const mockRole: StaffRole = 'headquarter';
    const mockStoreIds: string[] = [];
    const detailData = db.studios.getStudioDetailById(id, mockRole, mockStoreIds);

    if (!detailData) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 });
    }

    // Validate response structure
    const result = GetStudioDetailResponseSchema.safeParse(detailData);
    if (!result.success) {
      console.error('Studio detail validation error:', result.error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/crm/studios/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
