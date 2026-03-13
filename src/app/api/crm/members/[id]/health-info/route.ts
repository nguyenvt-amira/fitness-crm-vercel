import { NextRequest, NextResponse } from 'next/server';

import type { UpdateHealthInfoRequest } from '@/types/api/member.type';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: UpdateHealthInfoRequest = await request.json();

    return NextResponse.json({ success: true, id, updated: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update health info' }, { status: 500 });
  }
}
