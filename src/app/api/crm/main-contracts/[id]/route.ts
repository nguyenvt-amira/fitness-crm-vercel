import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  DeleteMainContractRequestSchema,
  DeleteMainContractResponseSchema,
  ErrorResponseSchema,
  GetMainContractDetailResponseSchema,
} from '@/app/api/_schemas/main-contract.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/main-contracts/{id}',
  summary: 'Get main contract detail',
  description: 'Get detailed information about a specific main contract master',
  tags: ['Main Contracts'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Main contract ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    {
      status: 200,
      schema: GetMainContractDetailResponseSchema,
      description: 'Main contract detail',
    },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

registerRoute({
  method: 'delete',
  path: '/crm/main-contracts/{id}',
  summary: 'Delete a main contract',
  description:
    'Delete a main contract master by ID. Only allowed when active_contracts = 0 and child_contracts is empty.',
  tags: ['Main Contracts'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Main contract ID',
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    schema: DeleteMainContractRequestSchema,
    description: '削除理由',
  },
  responses: [
    { status: 200, schema: DeleteMainContractResponseSchema, description: 'Deleted successfully' },
    {
      status: 400,
      schema: ErrorResponseSchema,
      description: 'Validation error or deletion blocked',
    },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const detail = db.mainContracts.getById(id);
    if (!detail) {
      return NextResponse.json({ error: 'Main contract not found' }, { status: 404 });
    }
    return NextResponse.json({ main_contract: detail }, { status: 200 });
  } catch (error) {
    console.error('GET /crm/main-contracts/[id] error:', error);
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
    const validation = DeleteMainContractRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const detail = db.mainContracts.getById(id);
    if (!detail) {
      return NextResponse.json({ error: '主契約が見つかりません' }, { status: 404 });
    }

    if (detail.active_contracts > 0) {
      return NextResponse.json(
        {
          error: `契約者が ${detail.active_contracts.toLocaleString()} 名存在するため削除できません`,
        },
        { status: 400 },
      );
    }

    if (detail.child_contracts.length > 0) {
      return NextResponse.json(
        { error: `派生マスタが ${detail.child_contracts.length} 件存在するため削除できません` },
        { status: 400 },
      );
    }

    const deleted = db.mainContracts.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: '主契約が見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ message: '主契約を削除しました' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /crm/main-contracts/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
