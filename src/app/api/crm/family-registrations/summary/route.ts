import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GetFamilyRegistrationsSummaryResponseSchema,
} from '@/app/api/_schemas/family-registration.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/family-registrations/summary',
  summary: 'Get family registrations summary',
  tags: ['Family Registrations'],
  responses: [
    {
      status: 200,
      schema: GetFamilyRegistrationsSummaryResponseSchema,
      description: 'Summary response',
    },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal error' },
  ],
});

// GET /api/crm/family-registrations/summary
export async function GET(_request: NextRequest) {
  const rows = db.family.listRegistrations();
  const by_status: Record<string, number> = {};
  for (const r of rows) {
    by_status[r.status] = (by_status[r.status] ?? 0) + 1;
  }
  return NextResponse.json({ total: rows.length, by_status });
}
