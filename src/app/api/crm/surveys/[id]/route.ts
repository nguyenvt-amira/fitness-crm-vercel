import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  DeleteSurveyTemplateResponseSchema,
  ErrorResponseSchema,
  GetSurveyTemplateDetailResponseSchema,
  UpdateSurveyTemplateStatusBodySchema,
  UpdateSurveyTemplateStatusResponseSchema,
} from '@/app/api/_schemas/survey.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/surveys/{id}',
  summary: 'Get survey template detail',
  description: 'Get detailed information for a specific survey template',
  tags: ['Surveys'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Survey template ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    { status: 200, schema: GetSurveyTemplateDetailResponseSchema, description: 'Survey detail' },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

registerRoute({
  method: 'delete',
  path: '/crm/surveys/{id}',
  summary: 'Delete survey template',
  description: 'Delete a survey template from mock storage',
  tags: ['Surveys'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Survey template ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    {
      status: 200,
      schema: DeleteSurveyTemplateResponseSchema,
      description: 'Deleted successfully',
    },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

registerRoute({
  method: 'patch',
  path: '/crm/surveys/{id}',
  summary: 'Update survey template status',
  description: 'Update survey template status, including disable flow',
  tags: ['Surveys'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Survey template ID',
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    schema: UpdateSurveyTemplateStatusBodySchema,
    description: 'アンケートステータス更新リクエスト',
  },
  responses: [
    {
      status: 200,
      schema: UpdateSurveyTemplateStatusResponseSchema,
      description: 'Updated successfully',
    },
    { status: 400, schema: ErrorResponseSchema, description: 'Validation error' },
    { status: 404, schema: ErrorResponseSchema, description: 'Not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const detail = db.surveys.getById(id);

    if (!detail) {
      return NextResponse.json({ error: 'アンケートが見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ survey: detail }, { status: 200 });
  } catch (error) {
    console.error('GET /crm/surveys/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const deleted = db.surveys.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'アンケートが見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ message: 'アンケートを削除しました' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /crm/surveys/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validation = UpdateSurveyTemplateStatusBodySchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const updated = db.surveys.updateStatus(id, validation.data.status, validation.data.reason);
    if (!updated) {
      return NextResponse.json({ error: 'アンケートが見つかりません' }, { status: 404 });
    }

    const message =
      validation.data.status === 'inactive'
        ? 'アンケートを無効化しました'
        : 'アンケートのステータスを更新しました';

    return NextResponse.json({ message, survey: updated }, { status: 200 });
  } catch (error) {
    console.error('PATCH /crm/surveys/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
