import { NextRequest, NextResponse } from 'next/server';

import {
  Brand,
  type GetMemberDetailResponse,
  type Member,
  MemberStatus,
  MemberType,
  type UpdateBasicInfoRequest,
  type UpdateHealthInfoRequest,
  type UpdateMarketingConsentRequest,
} from '@/types/api/member.type';

const memberStore = new Map<string, Member>();

function createDefaultMember(id: string): Member {
  return {
    basic_info: {
      id,
      member_number: id,
      name_kanji: '佐藤 花子',
      name_kana: 'サトウ ハナコ',
      birthday: '1990-05-15',
      age: 34,
      gender: 'female',
      postal_code: '1500002',
      prefecture: '東京都',
      city: '渋谷区',
      address: '渋谷1-2-3',
      building: 'サンプルマンション 101',
      phone: '09012345678',
      email: 'hanako.sato@example.com',
      emergency_contact: {
        name: '佐藤 太郎',
        relationship: '夫',
        phone: '09087654321',
      },
    },
    profile: {
      member_type: MemberType.REGULAR,
      status: MemberStatus.ACTIVE,
      store_id: 'store-001',
      store_name: 'ジョイフィット渋谷店',
      brand: Brand.JOYFIT,
      joined_at: '2023-04-01',
      is_black_listed: false,
    },
    ekyc: {
      verified: true,
      verified_at: '2024-01-15T10:30:00+09:00',
      document_type: '運転免許証',
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

export function getMemberFromStore(id: string): Member {
  const existing = memberStore.get(id);
  if (existing) return existing;

  const created = createDefaultMember(id);
  memberStore.set(id, created);
  return created;
}

export function updateBasicInfoInStore(id: string, body: UpdateBasicInfoRequest): Member {
  const current = getMemberFromStore(id);

  const updated: Member = {
    ...current,
    basic_info: {
      ...current.basic_info,
      ...body,
      emergency_contact: body.emergency_contact ?? current.basic_info.emergency_contact,
    },
  };

  memberStore.set(id, updated);
  return updated;
}

export function updateHealthInfoInStore(id: string, body: UpdateHealthInfoRequest): Member {
  const current = getMemberFromStore(id);

  const updated: Member = {
    ...current,
    health_info: {
      ...current.health_info,
      ...body,
    },
  };

  memberStore.set(id, updated);
  return updated;
}

export function updateMarketingConsentInStore(
  id: string,
  body: UpdateMarketingConsentRequest,
): Member {
  const current = getMemberFromStore(id);

  const updated: Member = {
    ...current,
    consent: {
      ...(current.consent ?? {
        member_agreement: {
          version: '1.0',
          agreed_at: new Date().toISOString(),
        },
        privacy_policy: {
          version: '1.0',
          agreed_at: new Date().toISOString(),
        },
        marketing_consent: {
          email: false,
          sms: false,
          push: false,
        },
      }),
      marketing_consent: {
        ...(current.consent?.marketing_consent ?? {
          email: false,
          sms: false,
          push: false,
        }),
        ...body,
      },
    },
  };

  memberStore.set(id, updated);
  return updated;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const member = getMemberFromStore(id);

    const response: GetMemberDetailResponse = {
      member,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching member detail:', error);
    return NextResponse.json({ error: 'Failed to fetch member detail' }, { status: 500 });
  }
}
