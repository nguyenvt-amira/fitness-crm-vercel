import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import {
  ErrorResponseSchema,
  GetCampaignDetailResponseSchema,
} from '@/app/api/_schemas/campaign.schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

registerRoute({
  method: 'get',
  path: '/crm/campaigns/{id}',
  summary: 'Get campaign detail',
  description: 'Get detailed information about a single campaign master record',
  tags: ['Campaigns'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Campaign ID',
      schema: { type: 'string' },
    },
  ],
  responses: [
    { status: 200, schema: GetCampaignDetailResponseSchema, description: 'Campaign detail' },
    { status: 404, schema: ErrorResponseSchema, description: 'Campaign not found' },
    { status: 500, schema: ErrorResponseSchema, description: 'Internal server error' },
  ],
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const campaign = db.campaigns.getById(id);

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ campaign }, { status: 200 });
  } catch (error) {
    console.error('GET /crm/campaigns/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign detail' }, { status: 500 });
  }
}
