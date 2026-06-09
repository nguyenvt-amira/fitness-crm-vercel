import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  CreateBrandRequestSchema,
  type CreateBrandResponse,
  CreateBrandResponseSchema,
  type GetBrandsQuery,
  GetBrandsQuerySchema,
  type GetBrandsResponse,
  GetBrandsResponseSchema,
  normalizeBrandCode,
} from '@/app/api/_schemas/brand.schema';
import { ErrorResponseSchema } from '@/app/api/_schemas/staff.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/brands',
  summary: 'List Y-07 brand master',
  description:
    'JOYFIT / FIT365 のブランド基本設定（入会金・手数料デフォルト）。G-01 主契約の参照元。',
  tags: ['Brands'],
  query: GetBrandsQuerySchema,
  responses: [
    {
      status: 200,
      schema: GetBrandsResponseSchema,
      description: 'Brand list',
    },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Bad request',
    },
    {
      status: 500,
      schema: ErrorResponseSchema,
      description: 'Internal server error',
    },
  ],
});

export async function GET(request: NextRequest) {
  try {
    const queryObj: Record<string, string | undefined> = {};
    request.nextUrl.searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const validation = GetBrandsQuerySchema.safeParse(queryObj);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { page, limit }: GetBrandsQuery = validation.data;
    const total = db.brands.count();
    const total_pages = Math.ceil(total / limit) || 0;

    const response: GetBrandsResponse = {
      brands: db.brands.getList({ page, limit }),
      pagination: { page, limit, total, total_pages },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

registerRoute({
  method: 'post',
  path: '/crm/brands',
  summary: 'Create Y-07 brand master',
  description: 'ブランド基本設定を新規作成する（本部のみ）',
  tags: ['Brands'],
  requestBody: {
    schema: CreateBrandRequestSchema,
    description: 'ブランド設定作成リクエスト',
  },
  responses: [
    {
      status: 201,
      schema: CreateBrandResponseSchema,
      description: 'Created',
    },
    { status: 400, schema: ErrorResponseSchema, description: 'Bad request' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateBrandRequestSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const normalizedBrandId = normalizeBrandCode(validation.data.brand_id);
    if (db.brands.getByBrandId(normalizedBrandId)) {
      return NextResponse.json({ error: 'Brand ID already exists' }, { status: 400 });
    }

    if (db.brands.getByCode(normalizedBrandId)) {
      return NextResponse.json({ error: 'Generated brand code already exists' }, { status: 400 });
    }

    const brand = db.brands.add({
      ...validation.data,
      brand_id: normalizedBrandId,
    });
    const response: CreateBrandResponse = {
      message: 'ブランドを作成しました',
      brand,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /crm/brands error:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
