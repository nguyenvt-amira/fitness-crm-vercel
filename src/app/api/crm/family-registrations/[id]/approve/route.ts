import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ApproveFamilyRegistrationRequestSchema,
  ApproveFamilyRegistrationResponseSchema,
  ErrorResponseSchema,
} from '@/app/api/_schemas/family-registration.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'post',
  path: '/crm/family-registrations/{id}/approve',
  summary: 'Approve family registration',
  tags: ['Family Registrations'],
  parameters: [{ name: 'id', in: 'path', required: true }],
  requestBody: { schema: ApproveFamilyRegistrationRequestSchema },
  responses: [
    { status: 200, schema: ApproveFamilyRegistrationResponseSchema, description: 'Approved' },
    { status: 400, schema: ErrorResponseSchema, description: 'Invalid body' },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
  ],
});

// POST /api/crm/family-registrations/{id}/approve
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // optional body
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const validation = ApproveFamilyRegistrationRequestSchema.safeParse(body);
  if (!validation.success) {
    const errors = validation.error.issues.map((i) => i.message).join(', ');
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const existing = db.family.getRegistrationById(id);
  if (!existing)
    return NextResponse.json({ error: 'Family registration not found' }, { status: 404 });

  const staff = validation.data.staff_id || 'staff-001';
  db.family.updateRegistrationStatus(id, 'approved', { staff_id: staff });

  return NextResponse.json({
    success: true,
    id,
    status: 'approved',
    approved_at: new Date().toISOString(),
    approved_by: staff,
  });
}
