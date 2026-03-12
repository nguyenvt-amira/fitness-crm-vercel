import { NextRequest, NextResponse } from 'next/server';

import type { UpdateMarketingConsentRequest } from '@/types/member.type';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: UpdateMarketingConsentRequest = await request.json();

    return NextResponse.json({ success: true, id, updated: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update marketing consent' }, { status: 500 });
  }
}
