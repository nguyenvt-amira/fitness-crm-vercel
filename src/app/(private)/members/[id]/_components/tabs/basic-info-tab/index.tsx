'use client';

import Image from 'next/image';

import { formatDate } from '@/utils/format.util';
import { formatDateTime } from '@/utils/format.util';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { GetMemberDetailResponse } from '@/lib/api/types.gen';

import {
  BRAND_LABELS,
  GENDER_LABELS,
  MEMBER_STATUS_LABELS,
  MEMBER_TYPE_LABELS,
} from '../../../../_constants/constants';
import InfoRow from '../../info-row';

export function BasicInfoTab({ member }: { member: GetMemberDetailResponse }) {
  const basic = member?.basic_info;
  const profile = member?.profile;

  return (
    <>
      {basic && profile ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>個人情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="会員番号" value={basic?.member_number} />
              <InfoRow label="氏名（漢字）" value={basic?.name_kanji} />
              <InfoRow label="氏名（カナ）" value={basic?.name_kana} />
              <InfoRow
                label="生年月日・年齢"
                value={
                  basic?.birthday
                    ? `${formatDate(basic.birthday)}（${basic.age ?? '—'}歳）`
                    : undefined
                }
              />
              <InfoRow
                label="性別"
                value={basic?.gender ? GENDER_LABELS[basic.gender] : undefined}
              />
              <InfoRow label="郵便番号" value={basic?.postal_code} />
              <InfoRow label="都道府県" value={basic?.prefecture} />
              <InfoRow label="市区町村" value={basic?.city} />
              <InfoRow label="番地" value={basic?.address} />
              <InfoRow label="建物名" value={basic?.building} className="md:col-span-2" />
              <InfoRow label="電話番号" value={basic?.phone} />
              <InfoRow label="メールアドレス" value={basic?.email} />
              {basic?.emergency_contact && (
                <>
                  <InfoRow label="緊急連絡先（氏名）" value={basic.emergency_contact.name} />
                  <InfoRow
                    label="緊急連絡先（続柄）"
                    value={basic.emergency_contact.relationship}
                  />
                  <InfoRow label="緊急連絡先（電話番号）" value={basic.emergency_contact.phone} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>会員基本情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow
                label="会員種別"
                value={profile?.member_type ? MEMBER_TYPE_LABELS[profile.member_type] : undefined}
              />
              <InfoRow
                label="会員ステータス"
                value={profile?.status ? MEMBER_STATUS_LABELS[profile.status] : undefined}
              />
              <InfoRow label="所属店舗" value={profile?.store_name} />
              <InfoRow
                label="所属ブランド"
                value={profile?.brand ? BRAND_LABELS[profile.brand] : undefined}
              />
              <InfoRow
                label="入会日"
                value={profile?.joined_at ? formatDate(profile.joined_at) : undefined}
              />
              <InfoRow
                label="退会日（該当する場合）"
                value={profile?.withdrawn_at ? formatDate(profile.withdrawn_at) : undefined}
              />
              <InfoRow
                label="ブラックリスト登録状況"
                value={profile?.is_black_listed ? '登録済み' : '未登録'}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>eKYC・本人確認</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="eKYC検証結果" value={member.ekyc?.verified ? '検証済み' : '未検証'} />
              <InfoRow
                label="検証日時"
                value={
                  member.ekyc?.verified_at ? formatDateTime(member.ekyc.verified_at) : undefined
                }
              />
              <InfoRow label="本人確認書類の種類" value={member.ekyc?.document_type} />
              {member.ekyc?.photoUrl && (
                <div className="md:col-span-2">
                  <p className="text-muted-foreground mb-2 text-sm">顔写真</p>
                  <div className="bg-muted relative size-24 overflow-hidden rounded-lg border">
                    <Image
                      src={member.ekyc.photoUrl}
                      alt="本人確認顔写真"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>利用規約・同意状況</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow
                label="会員規約"
                value={
                  member.consent?.member_agreement
                    ? `バージョン ${member.consent.member_agreement.version} / ${formatDateTime(member.consent.member_agreement.agreed_at)}`
                    : undefined
                }
              />
              <InfoRow
                label="個人情報保護方針"
                value={
                  member.consent?.privacy_policy
                    ? `バージョン ${member.consent.privacy_policy.version} / ${formatDateTime(member.consent.privacy_policy.agreed_at)}`
                    : undefined
                }
              />
              <InfoRow
                label="オプション利用規約"
                value={
                  member.consent?.optional_agreement
                    ? `バージョン ${member.consent.optional_agreement.version} / ${formatDateTime(member.consent.optional_agreement.agreed_at)}`
                    : undefined
                }
              />
              <div className="md:col-span-2">
                <p className="text-muted-foreground text-sm">マーケティング配信同意</p>
                <div className="mt-1 flex flex-wrap gap-4">
                  <span>メール: {member.consent?.marketing_consent?.email ? 'ON' : 'OFF'}</span>
                  <span>SMS: {member.consent?.marketing_consent?.sms ? 'ON' : 'OFF'}</span>
                  <span>
                    プッシュ通知: {member.consent?.marketing_consent?.push ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground text-sm">規約改定時の再同意履歴</p>
                <p className="mt-1">—</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>アンケート情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">入会時アンケート</p>
                <p className="mt-1 text-sm">
                  トレーニング目的、運動経験、利用予定頻度、入会きっかけ、興味のあるサービス —
                  データなし
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  定期アンケート（満足度調査の最新結果）
                </p>
                <p className="mt-1">—</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>健康情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="健康状態申告" value={member.health_info?.health_status} />
              <InfoRow label="既往歴・持病" value={member.health_info?.medical_history} />
              <InfoRow label="アレルギー情報" value={member.health_info?.allergies} />
              <InfoRow label="運動制限事項" value={member.health_info?.exercise_restrictions} />
              <InfoRow
                label="その他特記事項"
                value={member.health_info?.other_notes}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
