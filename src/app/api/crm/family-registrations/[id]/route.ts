import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GetFamilyRegistrationDetailResponseSchema,
} from '@/app/api/_schemas/family-registration.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/family-registrations/{id}',
  summary: 'Get family registration detail',
  tags: ['Family Registrations'],
  parameters: [{ name: 'id', in: 'path', required: true, description: 'Family registration id' }],
  responses: [
    { status: 200, schema: GetFamilyRegistrationDetailResponseSchema, description: 'Detail' },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
  ],
});

// GET /api/crm/family-registrations/{id}
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const row = db.family.getRegistrationById(id);
  if (!row) {
    return NextResponse.json({ error: 'Family registration not found' }, { status: 404 });
  }

  const primary = db.members.get(row.primary_member_id);
  const { settings } = db.family.getBrandSettingsByPrimaryMemberId(row.primary_member_id);

  return NextResponse.json({
    registration: {
      id: row.id,
      created_at: row.created_at,
      status: row.status,
      primary_member_id: row.primary_member_id,
      primary_member_name: primary?.basic_info.name_kanji ?? '—',
      applicant_name: row.applicant_name,
      relationship: row.relationship,
      invite_expires_at: row.invite_expires_at,
      store_id: primary?.profile.store_id ?? '—',
      store_name: primary?.profile.store_name ?? '—',
      monthly_fee: settings.family_member_fee,
      risk_score: row.risk_score,
      applicant: row.applicant,
      primary_member: primary
        ? {
            member_number: primary.basic_info.member_number,
            status: primary.profile.status,
            has_unpaid: (primary as any)._listMeta?.has_unpaid ?? false,
          }
        : undefined,
    },
  });
}
