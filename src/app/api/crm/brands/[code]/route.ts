import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  UpdateBrandRequestSchema,
  UpdateBrandResponseSchema,
  normalizeBrandCode,
} from '@/app/api/_schemas/brand.schema';
import { ErrorResponseSchema } from '@/app/api/_schemas/staff.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'patch',
  path: '/crm/brands/{code}',
  summary: 'Update Y-07 brand master',
  description: 'ブランド基本設定を更新する（本部のみ）',
  tags: ['Brands'],
  parameters: [
    {
      name: 'code',
      in: 'path',
      required: true,
      description: 'Brand code',
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    schema: UpdateBrandRequestSchema,
    description: 'ブランド設定更新リクエスト',
  },
  responses: [
    {
      status: 200,
      schema: UpdateBrandResponseSchema,
      description: 'Updated successfully',
    },
    { status: 400, schema: ErrorResponseSchema, description: 'Validation error' },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
    const normalizedCode = normalizeBrandCode(code);
    const body = await request.json();

    const validation = UpdateBrandRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const existing = db.brands.getByCode(normalizedCode);
    if (!existing) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const normalizedBrandId = validation.data.brand_id
      ? normalizeBrandCode(validation.data.brand_id)
      : undefined;

    if (normalizedBrandId) {
      const existingBrandId = db.brands.getByBrandId(normalizedBrandId);
      if (existingBrandId && normalizeBrandCode(existingBrandId.code) !== normalizedCode) {
        return NextResponse.json({ error: 'Brand ID already exists' }, { status: 400 });
      }
    }

    const updated = db.brands.update(normalizedCode, {
      ...validation.data,
      ...(normalizedBrandId ? { brand_id: normalizedBrandId } : {}),
    });
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'ブランド設定を保存しました', brand: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error('PATCH /crm/brands/[code] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
