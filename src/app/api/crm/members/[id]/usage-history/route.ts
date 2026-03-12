import { NextRequest, NextResponse } from 'next/server';

import type { StoreUsage, UsageSummary, VisitRecord } from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const mockData = {
      summary: {
        totalVisits: 45,
        averageStayTime: 90,
        lastVisitDate: '2024-11-25',
        frequentTimeSlot: '18-21時',
        frequentDayOfWeek: '火曜日',
      } as UsageSummary,
      storeUsage: [
        {
          storeId: 'store-001',
          storeName: 'Fit365八潮店',
          visitCount: 30,
          usageRate: 66.7,
          averageStayTime: 90,
        },
        {
          storeId: 'store-002',
          storeName: 'Fit365新宿店',
          visitCount: 15,
          usageRate: 33.3,
          averageStayTime: 85,
        },
      ] as StoreUsage[],
      visitRecords: [
        {
          id: 'vr-001',
          entryTime: '2024-11-25T18:00:00Z',
          exitTime: '2024-11-25T19:30:00Z',
          stayTime: 90,
          storeId: 'store-001',
          storeName: 'Fit365八潮店',
          entryMethod: 'qr_code',
        },
        {
          id: 'vr-002',
          entryTime: '2024-11-24T19:00:00Z',
          exitTime: '2024-11-24T20:15:00Z',
          stayTime: 75,
          storeId: 'store-001',
          storeName: 'Fit365八潮店',
          entryMethod: 'face_recognition',
        },
      ] as VisitRecord[],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch usage history' }, { status: 500 });
  }
}
