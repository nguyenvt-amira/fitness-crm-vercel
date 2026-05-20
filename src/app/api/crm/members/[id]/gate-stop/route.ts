import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GateStopRequestSchema,
  GateStopResponseSchema,
} from '@/app/api/_schemas/member.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

import { MemberStatus } from '@/lib/api/types.gen';

registerRoute({
  method: 'post',
  path: '/crm/members/{id}/gate-stop',
  summary: 'Set gate stop for a member',
  description: 'Restrict member entry at gate terminals (ゲートストップ設定)',
  tags: ['Members'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Member ID',
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    schema: GateStopRequestSchema,
    description: 'Gate stop request payload',
  },
  responses: [
    {
      status: 200,
      schema: GateStopResponseSchema,
      description: 'Gate stop applied successfully',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request',
    },
    {
      status: 404,
      schema: ErrorResponseSchema,
      description: 'Member not found',
    },
    {
      status: 409,
      schema: ErrorResponseSchema,
      description: 'Member is not in a state that allows gate stop',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

const GATE_STOP_ALLOWED_STATUSES: string[] = [
  MemberStatus.ACTIVE,
  MemberStatus.SUSPENDED,
  MemberStatus.PENDING_WITHDRAWAL,
];

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const member = db.members.get(id);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    if (!GATE_STOP_ALLOWED_STATUSES.includes(member.profile.status)) {
      return NextResponse.json(
        { error: 'Member is not in a state that allows gate stop' },
        { status: 409 },
      );
    }

    const body = await request.json();
    const validationResult = GateStopRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { scope, reason } = validationResult.data;

    // Update member status to GATE_STOP in mock DB
    const members = (db.members as unknown as { _members: (typeof member)[] })._members;
    const idx = members.findIndex((m) => m.basic_info.id === id);
    if (idx !== -1) {
      members[idx] = {
        ...members[idx]!,
        profile: { ...members[idx]!.profile, status: MemberStatus.GATE_STOP },
      };
    }

    return NextResponse.json(
      {
        success: true,
        member_id: id,
        scope,
        reason,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[POST /crm/members/[id]/gate-stop]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
