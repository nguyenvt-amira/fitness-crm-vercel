import { NextRequest, NextResponse } from 'next/server';

import type { OtherServiceUsage, PersonalTraining, StudioProgram } from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      personalTraining: {
        reservations: [
          {
            id: 'pt-res-001',
            date: '2024-12-01T10:00:00Z',
            trainerName: '山田 太郎',
            status: 'reserved' as const,
            menu: '上半身強化',
          },
        ],
        history: [
          {
            id: 'pt-hist-001',
            date: '2024-11-20T10:00:00Z',
            trainerName: '山田 太郎',
            menu: '下半身強化',
            feedback: '良いセッションでした',
            rating: 5,
          },
        ],
      } as PersonalTraining,
      studioProgram: {
        participationHistory: [
          {
            id: 'prog-001',
            date: '2024-11-25T19:00:00Z',
            programName: 'ヨガ',
            instructorName: '鈴木 花子',
            participants: 15,
            rating: 4,
          },
        ],
        reservationHistory: [
          {
            id: 'prog-res-001',
            date: '2024-12-02T19:00:00Z',
            programName: 'ピラティス',
            action: 'reserve' as const,
          },
        ],
      } as StudioProgram,
      otherServices: {
        tanning: [
          {
            id: 'tan-001',
            date: '2024-11-20T14:00:00Z',
            duration: 20,
            storeId: 'store-001',
            storeName: 'Fit365八潮店',
          },
        ],
        locker: [
          {
            lockerNumber: 'L-101',
            startDate: '2024-01-15',
            status: 'active' as const,
          },
        ],
        purchases: [
          {
            id: 'purchase-001',
            date: '2024-11-15',
            productName: 'プロテイン',
            quantity: 2,
            amount: 5000,
            paymentMethod: 'クレジットカード',
          },
        ],
      } as OtherServiceUsage,
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service usage' }, { status: 500 });
  }
}
