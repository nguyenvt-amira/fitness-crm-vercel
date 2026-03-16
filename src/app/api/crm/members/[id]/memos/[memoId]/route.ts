import { NextRequest, NextResponse } from 'next/server';

import type { UpdateMemoRequest } from '@/types/api/member.type';

import { deleteMemo, updateMemo } from '../route';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memoId: string }> },
) {
  try {
    const { id, memoId } = await params;
    const body: UpdateMemoRequest = await request.json();
    const updates: Partial<{ type: 'caution' | 'vip' | 'other'; content: string }> = {};
    if (body.type !== undefined) updates.type = body.type;
    if (body.content !== undefined) {
      const content = String(body.content).trim();
      if (content.length > 1000) {
        return NextResponse.json(
          { error: 'Content must be at most 1000 characters' },
          { status: 400 },
        );
      }
      updates.content = content;
    }
    const memo = updateMemo(id, memoId, updates);
    if (!memo) {
      return NextResponse.json({ error: 'Memo not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, memo });
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
    const deleted = deleteMemo(id, memoId);
    if (!deleted) {
      return NextResponse.json({ error: 'Memo not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 });
  }
}
