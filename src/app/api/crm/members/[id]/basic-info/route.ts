import { NextRequest, NextResponse } from 'next/server';

import type { GetMemberDetailResponse } from '@/types/api/member.type';
import { Brand, MemberStatus, MemberType } from '@/types/api/member.type';

/** Mock member data for GET /basic-info — đầy đủ các trường theo spec 基本情報 */
function buildMockBasicInfoMember(id: string): GetMemberDetailResponse['member'] {
  return {
    basic_info: {
      id,
      member_number: id,
      name_kanji: '佐藤 花子',
      name_kana: 'サトウ ハナコ',
      birthday: '1990-05-15',
      age: 34,
      gender: 'female',
      postal_code: '150-0002',
      prefecture: '東京都',
      city: '渋谷区',
      address: '渋谷1-2-3',
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
      store_name: 'ジョイフィット渋谷店',
      brand: Brand.JOYFIT,
      joined_at: '2023-04-01',
      withdrawn_at: undefined,
      is_black_listed: false,
    },
    ekyc: {
      verified: true,
      verified_at: '2024-01-15T10:30:00+09:00',
      document_type: '運転免許証',
      photoUrl: undefined,
    },
    consent: {
      member_agreement: {
        version: '2.1',
        agreed_at: '2024-01-15T10:00:00+09:00',
      },
      privacy_policy: {
        version: '1.5',
        agreed_at: '2024-01-15T10:00:00+09:00',
      },
      optional_agreement: {
        version: '1.0',
        agreed_at: '2024-01-20T14:00:00+09:00',
      },
      marketing_consent: {
        email: true,
        sms: false,
        push: true,
      },
    },
    health_info: {
      health_status: '良好',
      medical_history: '特になし',
      allergies: 'なし',
      exercise_restrictions: '特になし',
      other_notes: '入会時健康アンケート済み。',
    },
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const member = buildMockBasicInfoMember(id);
    return NextResponse.json({ member });
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
