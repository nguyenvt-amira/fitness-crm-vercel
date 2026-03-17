import { NextRequest, NextResponse } from 'next/server';

import type { UpdateMarketingConsentRequest } from '@/types/api/member.type';

import { updateMarketingConsentInStore } from '../route';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: UpdateMarketingConsentRequest = await request.json();

    const updatedMember = updateMarketingConsentInStore(id, body);

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update marketing consent' }, { status: 500 });
  }
}
