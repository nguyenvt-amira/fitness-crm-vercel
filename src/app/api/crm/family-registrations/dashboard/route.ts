import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GetFamilyRegistrationsDashboardResponseSchema,
} from '@/app/api/_schemas/family-registration.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/family-registrations/dashboard',
  summary: 'Get family registrations dashboard',
  tags: ['Family Registrations'],
  responses: [
    {
      status: 200,
      schema: GetFamilyRegistrationsDashboardResponseSchema,
      description: 'Dashboard response',
    },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal error' },
  ],
});

// GET /api/crm/family-registrations/dashboard
export async function GET(_request: NextRequest) {
  const rows = db.family.listRegistrations();

  const monthInvites = rows.filter((r) =>
    ['invited', 'awaiting_acceptance', 'awaiting_profile'].includes(r.status),
  ).length;
  const monthCompleted = rows.filter((r) => r.status === 'completed').length;

  const accepted = rows.filter((r) =>
    ['awaiting_profile', 'pending_review', 'approved', 'completed'].includes(r.status),
  ).length;
  const invited = rows.filter((r) =>
    ['invited', 'awaiting_acceptance', 'awaiting_profile', 'expired', 'declined'].includes(
      r.status,
    ),
  ).length;
  const acceptance_rate = invited === 0 ? 0 : Math.round((accepted / invited) * 1000) / 10;

  // family_member_ratio = (family members count) / (all members count)
  const familyMemberCount = db.members.getList().filter((m) => m.member_type === 'family').length;
  const memberCount = db.members.getList().length;
  const family_member_ratio =
    memberCount === 0 ? 0 : Math.round((familyMemberCount / memberCount) * 10000) / 100;

  // Top primary members by current family count (from relationships)
  const primaryStats = db.members
    .getList()
    .filter((m) => m.member_type === 'regular')
    .slice(0, 200)
    .map((m) => {
      const fam = db.family.getFamilyMembers(m.id).members.length;
      return { primary_member_id: m.id, primary_member_name: m.name_kanji, family_count: fam };
    })
    .sort((a, b) => b.family_count - a.family_count)
    .slice(0, 10);

  return NextResponse.json({
    month_invites: monthInvites,
    month_completed: monthCompleted,
    acceptance_rate,
    family_member_ratio,
    top_primary_members: primaryStats,
  });
}
