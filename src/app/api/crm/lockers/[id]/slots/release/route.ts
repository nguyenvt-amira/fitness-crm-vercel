import { NextRequest, NextResponse } from 'next/server';

import { getAuthUserFromRequest } from '@/app/api/_lib/auth';
import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  ReleaseLockerSlotsRequestSchema,
  type ReleaseLockerSlotsResponse,
  ReleaseLockerSlotsResponseSchema,
} from '@/app/api/_schemas/locker.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'post',
  path: '/crm/lockers/{id}/slots/release',
  summary: 'Release pending locker slots',
  description:
    'Mark pending-release locker slots as available after cleaning and clear linked member data',
  tags: ['Lockers'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Locker internal id',
    },
  ],
  requestBody: {
    schema: ReleaseLockerSlotsRequestSchema,
    description: 'Slot numbers to release',
  },
  responses: [
    {
      status: 200,
      schema: ReleaseLockerSlotsResponseSchema,
      description: 'Slots released successfully',
    },
    { status: 400, schema: ErrorResponseSchema, description: 'Bad request' },
    { status: 404, schema: ErrorResponseSchema, description: 'Locker or slot not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = getAuthUserFromRequest(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await params;
    const locker = db.lockers.getById(id);
    if (!locker) {
      return NextResponse.json({ error: 'Locker not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsedBody = ReleaseLockerSlotsRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      const errors = parsedBody.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const result = db.lockers.releaseSlots(id, parsedBody.data.slot_numbers);
    if (!result) {
      return NextResponse.json(
        { error: 'No pending-release slots found for the provided slot numbers' },
        { status: 404 },
      );
    }

    const updatedLocker = db.lockers.getDetailById(id);
    if (!updatedLocker) {
      return NextResponse.json({ error: 'Failed to load updated locker detail' }, { status: 500 });
    }

    const response: ReleaseLockerSlotsResponse = {
      message: `${result.released_slot_numbers.length}件のスロットを開放しました`,
      released_slot_numbers: result.released_slot_numbers,
      locker: updatedLocker,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error releasing locker slots:', error);
    return NextResponse.json({ error: 'Failed to release locker slots' }, { status: 500 });
  }
}
