import { NextRequest, NextResponse } from 'next/server';

import type { UpdateMemoRequest } from '@/types/member.type';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memoId: string }> },
) {
  try {
    const { id, memoId } = await params;
    const body: UpdateMemoRequest = await request.json();

    return NextResponse.json({ success: true, id, memoId, updated: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memoId: string }> },
) {
  try {
    const { id, memoId } = await params;

    return NextResponse.json({ success: true, id, memoId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 });
  }
}
