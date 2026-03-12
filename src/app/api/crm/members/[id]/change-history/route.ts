import { NextRequest, NextResponse } from 'next/server';

import type {
  ChangeHistoryItem,
  EditHistory,
  MembershipHistory,
  SuspensionHistory,
  TransferHistory,
  WithdrawalHistory,
} from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      timeline: [
        {
          id: 'ch-001',
          date: '2024-11-25T18:00:00Z',
          eventType: '来館',
          content: 'Fit365八潮店に来館',
        },
        {
          id: 'ch-002',
          date: '2024-06-01T10:00:00Z',
          eventType: '契約変更',
          content: 'ベーシックプランからスタンダードプランに変更',
        },
        {
          id: 'ch-003',
          date: '2024-01-15T10:00:00Z',
          eventType: '入会',
          content: 'Fit365八潮店で入会',
        },
      ] as ChangeHistoryItem[],
      membershipHistory: {
        joinedAt: '2024-01-15T10:00:00Z',
        joinRoute: 'store' as const,
        joinStore: 'Fit365八潮店',
      } as MembershipHistory,
      transferHistory: [] as TransferHistory[],
      suspensionHistory: [] as SuspensionHistory[],
      withdrawalHistory: [] as WithdrawalHistory[],
      editHistory: [
        {
          date: '2024-11-20T10:00:00Z',
          field: '電話番号',
          oldValue: '090-1111-2222',
          newValue: '090-1234-5678',
          editedBy: '田中 太郎',
        },
      ] as EditHistory[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch change history' }, { status: 500 });
  }
}
