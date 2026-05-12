import { NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import { type GetBrandsResponse, GetBrandsResponseSchema } from '@/app/api/_schemas/brand.schema';
import { ErrorResponseSchema } from '@/app/api/_schemas/staff.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/brands',
  summary: 'List Y-07 brand master',
  description:
    'JOYFIT / FIT365 のブランド基本設定（入会金・手数料デフォルト）。G-01 主契約の参照元。',
  tags: ['Brands'],
  responses: [
    {
      status: 200,
      schema: GetBrandsResponseSchema,
      description: 'Brand list',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

export async function GET() {
  try {
    const response: GetBrandsResponse = {
      brands: db.brands.getList(),
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}
