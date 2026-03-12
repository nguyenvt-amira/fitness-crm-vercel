'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdBasicInfoOptions } from '@/lib/api/@tanstack/react-query.gen';

import type { GetMemberDetailResponse } from '@/types/member.type';

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
            <p className="mt-1">{member.basicInfo?.memberNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">氏名（漢字）</p>
            <p className="mt-1">{member.basicInfo?.nameKanji}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">氏名（カナ）</p>
            <p className="mt-1">{member.basicInfo?.nameKana}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">生年月日・年齢</p>
            <p className="mt-1">
              {member.basicInfo?.birthday
                ? new Date(member.basicInfo.birthday).toLocaleDateString('ja-JP')
                : '-'}{' '}
              ({member.basicInfo?.age || '-'}歳)
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">性別</p>
            <p className="mt-1">
              {member.basicInfo?.gender === 'male'
                ? '男性'
                : member.basicInfo?.gender === 'female'
                  ? '女性'
                  : 'その他'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">郵便番号</p>
            <p className="mt-1">{member.basicInfo?.postalCode || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-muted-foreground text-sm">住所</p>
            <p className="mt-1">
              {member.basicInfo?.prefecture || ''}
              {member.basicInfo?.city || ''}
              {member.basicInfo?.address || ''}
              {member.basicInfo?.building || ''}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">電話番号</p>
            <p className="mt-1">{member.basicInfo?.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">メールアドレス</p>
            <p className="mt-1">{member.basicInfo?.email}</p>
          </div>
          {member.basicInfo?.emergencyContact && (
            <>
              <div>
                <p className="text-muted-foreground text-sm">緊急連絡先氏名</p>
                <p className="mt-1">{member.basicInfo.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">続柄</p>
                <p className="mt-1">{member.basicInfo.emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">緊急連絡先電話番号</p>
                <p className="mt-1">{member.basicInfo.emergencyContact.phone}</p>
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
            {member.ekyc.verifiedAt && (
              <div>
                <p className="text-muted-foreground text-sm">検証日時</p>
                <p className="mt-1">{new Date(member.ekyc.verifiedAt).toLocaleString('ja-JP')}</p>
              </div>
            )}
            {member.ekyc.documentType && (
              <div>
                <p className="text-muted-foreground text-sm">本人確認書類</p>
                <p className="mt-1">{member.ekyc.documentType}</p>
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
                バージョン {member.consent.memberAgreement?.version || '-'} /{' '}
                {member.consent.memberAgreement?.agreedAt
                  ? new Date(member.consent.memberAgreement.agreedAt).toLocaleDateString('ja-JP')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">個人情報保護方針</p>
              <p className="mt-1">
                バージョン {member.consent.privacyPolicy?.version || '-'} /{' '}
                {member.consent.privacyPolicy?.agreedAt
                  ? new Date(member.consent.privacyPolicy.agreedAt).toLocaleDateString('ja-JP')
                  : '-'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm">マーケティング配信同意</p>
              <div className="mt-1 flex gap-4">
                <span>メール: {member.consent.marketingConsent?.email ? 'ON' : 'OFF'}</span>
                <span>SMS: {member.consent.marketingConsent?.sms ? 'ON' : 'OFF'}</span>
                <span>プッシュ: {member.consent.marketingConsent?.push ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {member.healthInfo && (
        <Card>
          <CardHeader>
            <CardTitle>健康情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.healthInfo.healthStatus && (
              <div>
                <p className="text-muted-foreground text-sm">健康状態申告</p>
                <p className="mt-1">{member.healthInfo.healthStatus}</p>
              </div>
            )}
            {member.healthInfo.allergies && (
              <div>
                <p className="text-muted-foreground text-sm">アレルギー情報</p>
                <p className="mt-1">{member.healthInfo.allergies}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
