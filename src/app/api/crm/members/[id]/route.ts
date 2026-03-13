import { NextRequest, NextResponse } from 'next/server';

import type { GetMemberDetailResponse, Member } from '@/types/api/member.type';
import { Brand, MemberStatus, MemberType } from '@/types/api/member.type';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Mock member data
    const mockMember: Member = {
      basic_info: {
        id,
        member_number: id,
        name_kanji: '佐藤 花子',
        name_kana: 'サトウ ハナコ',
        birthday: '1990-01-01',
        age: 34,
        gender: 'female',
        postal_code: '1234567',
        prefecture: '東京都',
        city: '渋谷区',
        address: '1-2-3',
        building: 'サンプルマンション 101',
        phone: '090-1234-5678',
        email: 'hanako.sato@example.com',
        emergency_contact: {
          name: '佐藤 太郎',
          relationship: '夫',
          phone: '090-8765-4321',
        },
      },
      profile: {
        member_type: MemberType.REGULAR,
        status: MemberStatus.ACTIVE,
        store_id: 'store-001',
        store_name: 'Fit365八潮店',
        brand: Brand.FIT365,
        joined_at: '2024-01-15',
        is_black_listed: false,
      },
      ekyc: {
        verified: true,
        verified_at: '2024-01-15T10:00:00Z',
        document_type: '運転免許証',
      },
      consent: {
        member_agreement: {
          version: '1.0',
          agreed_at: '2024-01-15T10:00:00Z',
        },
        privacy_policy: {
          version: '1.0',
          agreed_at: '2024-01-15T10:00:00Z',
        },
        marketing_consent: {
          email: true,
          sms: false,
          push: true,
        },
      },
      health_info: {
        health_status: '良好',
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
