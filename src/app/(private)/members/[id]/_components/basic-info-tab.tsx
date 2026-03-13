'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdBasicInfoOptions } from '@/lib/api/@tanstack/react-query.gen';

import type { GetMemberDetailResponse } from '@/types/api/member.type';

export function BasicInfoTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery(
    getCrmMembersByIdBasicInfoOptions({
      path: {
        id: memberId,
      },
    }),
  );

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  // Type assertion to use the proper type from member.type.ts
  const typedData = data as unknown as GetMemberDetailResponse;
  const { member } = typedData;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>個人情報</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">会員番号</p>
            <p className="mt-1">{member.basic_info?.member_number}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">氏名（漢字）</p>
            <p className="mt-1">{member.basic_info?.name_kanji}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">氏名（カナ）</p>
            <p className="mt-1">{member.basic_info?.name_kana}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">生年月日・年齢</p>
            <p className="mt-1">
              {member.basic_info?.birthday
                ? new Date(member.basic_info.birthday).toLocaleDateString('ja-JP')
                : '-'}{' '}
              ({member.basic_info?.age || '-'}歳)
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">性別</p>
            <p className="mt-1">
              {member.basic_info?.gender === 'male'
                ? '男性'
                : member.basic_info?.gender === 'female'
                  ? '女性'
                  : 'その他'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">郵便番号</p>
            <p className="mt-1">{member.basic_info?.postal_code || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-muted-foreground text-sm">住所</p>
            <p className="mt-1">
              {member.basic_info?.prefecture || ''}
              {member.basic_info?.city || ''}
              {member.basic_info?.address || ''}
              {member.basic_info?.building || ''}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">電話番号</p>
            <p className="mt-1">{member.basic_info?.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">メールアドレス</p>
            <p className="mt-1">{member.basic_info?.email}</p>
          </div>
          {member.basic_info?.emergency_contact && (
            <>
              <div>
                <p className="text-muted-foreground text-sm">緊急連絡先氏名</p>
                <p className="mt-1">{member.basic_info.emergency_contact.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">続柄</p>
                <p className="mt-1">{member.basic_info.emergency_contact.relationship}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">緊急連絡先電話番号</p>
                <p className="mt-1">{member.basic_info.emergency_contact.phone}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {member.ekyc && (
        <Card>
          <CardHeader>
            <CardTitle>eKYC・本人確認</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">検証結果</p>
              <p className="mt-1">{member.ekyc.verified ? '検証済み' : '未検証'}</p>
            </div>
            {member.ekyc.verified_at && (
              <div>
                <p className="text-muted-foreground text-sm">検証日時</p>
                <p className="mt-1">{new Date(member.ekyc.verified_at).toLocaleString('ja-JP')}</p>
              </div>
            )}
            {member.ekyc.document_type && (
              <div>
                <p className="text-muted-foreground text-sm">本人確認書類</p>
                <p className="mt-1">{member.ekyc.document_type}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {member.consent && (
        <Card>
          <CardHeader>
            <CardTitle>利用規約・同意状況</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">会員規約</p>
              <p className="mt-1">
                バージョン {member.consent.member_agreement?.version || '-'} /{' '}
                {member.consent.member_agreement?.agreed_at
                  ? new Date(member.consent.member_agreement.agreed_at).toLocaleDateString('ja-JP')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">個人情報保護方針</p>
              <p className="mt-1">
                バージョン {member.consent.privacy_policy?.version || '-'} /{' '}
                {member.consent.privacy_policy?.agreed_at
                  ? new Date(member.consent.privacy_policy.agreed_at).toLocaleDateString('ja-JP')
                  : '-'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm">マーケティング配信同意</p>
              <div className="mt-1 flex gap-4">
                <span>メール: {member.consent.marketing_consent?.email ? 'ON' : 'OFF'}</span>
                <span>SMS: {member.consent.marketing_consent?.sms ? 'ON' : 'OFF'}</span>
                <span>プッシュ: {member.consent.marketing_consent?.push ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {member.health_info && (
        <Card>
          <CardHeader>
            <CardTitle>健康情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.health_info.health_status && (
              <div>
                <p className="text-muted-foreground text-sm">健康状態申告</p>
                <p className="mt-1">{member.health_info.health_status}</p>
              </div>
            )}
            {member.health_info.allergies && (
              <div>
                <p className="text-muted-foreground text-sm">アレルギー情報</p>
                <p className="mt-1">{member.health_info.allergies}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
