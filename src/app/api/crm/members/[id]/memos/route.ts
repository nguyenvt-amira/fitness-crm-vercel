import { NextRequest, NextResponse } from 'next/server';

import type { CreateMemoRequest, StaffMemo } from '@/types/member.type';
import { MemoType } from '@/types/member.type';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: CreateMemoRequest = await request.json();

    const newMemo: StaffMemo = {
      id: `memo-${Date.now()}`,
      date: new Date().toISOString(),
      type: body.type,
      content: body.content,
      createdBy: 'Current User', // In real app, get from auth
    };

    return NextResponse.json({ success: true, memo: newMemo });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create memo' }, { status: 500 });
  }
}
