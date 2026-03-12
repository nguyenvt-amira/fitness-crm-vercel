import { NextRequest, NextResponse } from 'next/server';

import type { GetMemberDetailResponse, Member } from '@/types/member.type';
import { Brand, MemberStatus, MemberType } from '@/types/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Mock member data
    const mockMember: Member = {
      basicInfo: {
        id,
        memberNumber: id,
        nameKanji: '佐藤 花子',
        nameKana: 'サトウ ハナコ',
        birthday: '1990-01-01',
        age: 34,
        gender: 'female',
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
      profile: {
        memberType: MemberType.REGULAR,
        status: MemberStatus.ACTIVE,
        storeId: 'store-001',
        storeName: 'Fit365八潮店',
        brand: Brand.FIT365,
        joinedAt: '2024-01-15',
        isBlacklisted: false,
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
    };

    const response: GetMemberDetailResponse = {
      member: mockMember,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching member detail:', error);
    return NextResponse.json({ error: 'Failed to fetch member detail' }, { status: 500 });
  }
}
