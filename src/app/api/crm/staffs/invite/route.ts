import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  type InviteStaffRequest,
  InviteStaffRequestSchema,
  type InviteStaffResponse,
  InviteStaffResponseSchema,
} from '@/app/api/_schemas/staff.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// Register OpenAPI documentation for POST
registerRoute({
  method: 'post',
  path: '/crm/staffs/invite',
  summary: 'Invite staff members',
  description: 'Send invitation emails to new staff members',
  tags: ['Staffs'],
  requestBody: {
    schema: InviteStaffRequestSchema,
    description: 'Staff invitation request body',
  },
  responses: [
    {
      status: 200,
      schema: InviteStaffResponseSchema,
      description: 'Invitations sent successfully',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request - invalid request body',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = InviteStaffRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const validatedBody: InviteStaffRequest = validationResult.data;
    const { invitees } = validatedBody;

    for (const invitee of invitees) {
      if (!db.positions.getById(invitee.position_id)) {
        return NextResponse.json(
          { error: `Invalid position_id: ${invitee.position_id}` },
          { status: 400 },
        );
      }
    }

    // Create staff entries for each invitee with position from master table
    const newStaffs = invitees.map((invitee) =>
      db.staffs.create({
        email: invitee.email,
        position_id: invitee.position_id,
        brand: invitee.brand,
      }),
    );

    const response: InviteStaffResponse = {
      message: '招待メールを送信しました',
      invited_count: newStaffs.length,
      staffs: newStaffs,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error inviting staff:', error);
    return NextResponse.json({ error: 'スタッフの招待に失敗しました' }, { status: 500 });
  }
}
