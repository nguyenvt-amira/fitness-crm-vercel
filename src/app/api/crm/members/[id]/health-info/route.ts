import { NextRequest, NextResponse } from 'next/server';

import type { UpdateHealthInfoRequest } from '@/types/api/member.type';

import { updateHealthInfoInStore } from '../route';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: UpdateHealthInfoRequest = await request.json();

    const updatedMember = updateHealthInfoInStore(id, body);

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update health info' }, { status: 500 });
  }
}
