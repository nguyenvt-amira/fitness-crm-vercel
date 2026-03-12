import { NextRequest, NextResponse } from 'next/server';

import type { GetMemberDetailResponse } from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Return basic info tab data
    const response = {
      member: {
        basicInfo: {
          id,
          memberNumber: id,
          nameKanji: '佐藤 花子',
          nameKana: 'サトウ ハナコ',
          birthday: '1990-01-01',
          age: 34,
          gender: 'female' as const,
          postalCode: '1234567',
          prefecture: '東京都',
          city: '渋谷区',
          address: '1-2-3',
          building: 'サンプルマンション 101',
          phone: '090-1234-5678',
          email: 'hanako.sato@example.com',
          emergencyContact: {
            name: '佐藤 太郎',
            relationship: '夫',
            phone: '090-8765-4321',
          },
        },
        ekyc: {
          verified: true,
          verifiedAt: '2024-01-15T10:00:00Z',
          documentType: '運転免許証',
        },
        consent: {
          memberAgreement: {
            version: '1.0',
            agreedAt: '2024-01-15T10:00:00Z',
          },
          privacyPolicy: {
            version: '1.0',
            agreedAt: '2024-01-15T10:00:00Z',
          },
          marketingConsent: {
            email: true,
            sms: false,
            push: true,
          },
        },
        healthInfo: {
          healthStatus: '良好',
          allergies: 'なし',
        },
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch basic info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Mock update
    return NextResponse.json({ success: true, id, updated: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update basic info' }, { status: 500 });
  }
}
