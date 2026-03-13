import { NextRequest, NextResponse } from 'next/server';

import type { StaffMemo } from '@/types/api/member.type';
import type { CreateMemoRequest } from '@/types/api/member.type';
import { MemoType } from '@/types/api/member.type';

// In-memory mock store for member_memos
const memosByMemberId = new Map<string, StaffMemo[]>([
  [
    'M-00001',
    [
      {
        id: 'memo-001',
        date: '2024-11-15T10:00:00Z',
        type: MemoType.VIP,
        content: 'VIP会員として特別対応が必要',
        created_by: '山田 花子',
      },
    ],
  ],
  [
    'M-00002',
    [
      {
        id: 'memo-002',
        date: '2024-11-16T10:00:00Z',
        type: MemoType.CAUTION,
        content: '注意事項があります',
        created_by: '山田 花子',
      },
    ],
  ],
  [
    'M-00003',
    [
      {
        id: 'memo-003',
        date: '2024-11-17T10:00:00Z',
        type: MemoType.OTHER,
        content: 'その他のメモ',
        created_by: '山田 花子',
      },
    ],
  ],
]);

function getMemos(memberId: string): StaffMemo[] {
  return [...(memosByMemberId.get(memberId) ?? [])];
}

export function addMemo(
  memberId: string,
  memo: Omit<StaffMemo, 'id' | 'date' | 'created_by'> & { created_by?: string },
): StaffMemo {
  const list = memosByMemberId.get(memberId) ?? [];
  const newMemo: StaffMemo = {
    ...memo,
    id: `memo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    date: new Date().toISOString(),
    created_by: memo.created_by?.trim() || 'システムユーザー',
  };
  list.push(newMemo);
  memosByMemberId.set(memberId, list);
  return newMemo;
}

export function updateMemo(
  memberId: string,
  memoId: string,
  updates: Partial<{ type: 'caution' | 'vip' | 'other'; content: string }>,
): StaffMemo | null {
  const list = memosByMemberId.get(memberId) ?? [];
  const index = list.findIndex((m) => m.id === memoId);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates } as StaffMemo;
  memosByMemberId.set(memberId, list);
  return list[index];
}

export function deleteMemo(memberId: string, memoId: string): boolean {
  const list = memosByMemberId.get(memberId) ?? [];
  const filtered = list.filter((m) => m.id !== memoId);
  if (filtered.length === list.length) return false;
  memosByMemberId.set(memberId, filtered);
  return true;
}

/** Export cho communications tab gọi lấy data memos để hiển thị */
export { getMemos };

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: CreateMemoRequest = await request.json();
    const content = (body.content ?? '').trim();
    if (!content || content.length > 1000) {
      return NextResponse.json(
        { error: 'Content is required and must be 1-1000 characters' },
        { status: 400 },
      );
    }
    const newMemo = addMemo(id, {
      type: body.type,
      content,
      created_by: body.created_by,
    });
    return NextResponse.json({ success: true, memo: newMemo });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create memo' }, { status: 500 });
  }
}
