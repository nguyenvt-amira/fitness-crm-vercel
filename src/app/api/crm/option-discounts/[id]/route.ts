import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  DeleteOptionDiscountRequestSchema,
  DeleteOptionDiscountResponseSchema,
  ErrorResponseSchema,
  GetOptionDiscountDetailResponseSchema,
} from '@/app/api/_schemas/option-discount.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/option-discounts/{id}',
  summary: 'Get option discount detail',
  description: 'Get detailed information for a specific option discount',
  tags: ['Options'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Option Discount ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    {
      status: 200,
      schema: GetOptionDiscountDetailResponseSchema,
      description: 'Option discount detail',
    },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

registerRoute({
  method: 'delete',
  path: '/crm/option-discounts/{id}',
  summary: 'Delete option discount',
  description: 'Delete an option discount setting',
  tags: ['Options'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Option Discount ID',
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    schema: DeleteOptionDiscountRequestSchema,
    description: '削除理由',
  },
  responses: [
    {
      status: 200,
      schema: DeleteOptionDiscountResponseSchema,
      description: 'Deleted successfully',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Deletion blocked or validation error',
    },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const detail = db.optionDiscount.getById(id);

    if (!detail) {
      return NextResponse.json({ error: 'Option discount not found' }, { status: 404 });
    }

    return NextResponse.json({ option_discount: detail }, { status: 200 });
  } catch (error) {
    console.error('GET /crm/option-discounts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validation = DeleteOptionDiscountRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const detail = db.optionDiscount.getById(id);
    if (!detail) {
      return NextResponse.json({ error: 'セット割が見つかりません' }, { status: 404 });
    }

    if (detail.applied_count > 0) {
      return NextResponse.json(
        {
          error: `適用会員が ${detail.applied_count.toLocaleString()} 名存在するため削除できません`,
        },
        { status: 400 },
      );
    }

    const deleted = db.optionDiscount.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'セット割が見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ message: 'セット割を削除しました' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /crm/option-discounts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
