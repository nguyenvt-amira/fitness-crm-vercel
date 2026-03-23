import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  BulkApproveFamilyRegistrationsRequestSchema,
  BulkApproveFamilyRegistrationsResponseSchema,
  ErrorResponseSchema,
} from '@/app/api/_schemas/family-registration.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'post',
  path: '/crm/family-registrations/bulk-approve',
  summary: 'Bulk approve family registrations',
  tags: ['Family Registrations'],
  requestBody: { schema: BulkApproveFamilyRegistrationsRequestSchema },
  responses: [
    {
      status: 200,
      schema: BulkApproveFamilyRegistrationsResponseSchema,
      description: 'Bulk approved',
    },
    { status: 400, schema: ErrorResponseSchema, description: 'Invalid body' },
  ],
});

// POST /api/crm/family-registrations/bulk-approve
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = BulkApproveFamilyRegistrationsRequestSchema.safeParse(body);
  if (!validation.success) {
    const errors = validation.error.issues.map((i) => i.message).join(', ');
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const staff = validation.data.staff_id || 'staff-001';
  const ids = [...new Set(validation.data.ids)];

  const results = ids.map((id) => {
    const existing = db.family.getRegistrationById(id);
    if (!existing) return { id, success: false, error: 'Family registration not found' as const };

    db.family.updateRegistrationStatus(id, 'approved', { staff_id: staff });
    return { id, success: true, status: 'approved' as const };
  });

  return NextResponse.json({
    success: results.every((r) => r.success),
    results,
  });
}
