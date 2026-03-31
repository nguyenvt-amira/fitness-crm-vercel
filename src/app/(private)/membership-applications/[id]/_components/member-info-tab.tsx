'use client';

import { GENDER_LABELS } from '@/app/(private)/members/_lib/constants';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { GetCrmMembershipApplicationsByIdResponse } from '@/lib/api/types.gen';

const BLOOD_TYPE_LABELS: Record<string, string> = {
  A: 'A型',
  B: 'B型',
  O: 'O型',
  AB: 'AB型',
  unknown: '不明',
};

type MemberInfoTabProps = {
  application: GetCrmMembershipApplicationsByIdResponse['application'];
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <label className="text-muted-foreground text-sm font-medium">{label}</label>
      <p className="mt-1 text-sm">{value || '—'}</p>
    </div>
  );
}

export function MemberInfoTab({ application }: MemberInfoTabProps) {
  const hasEmergencyContact =
    application.emergency_contact_name ||
    application.emergency_contact_relationship ||
    application.emergency_contact_phone;

  return (
    <Card>
      <CardHeader>
        <CardTitle>会員情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本情報 */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            基本情報
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="氏名" value={application.applicant_name} />
            <InfoRow
              label="性別"
              value={application.gender ? GENDER_LABELS[application.gender] : undefined}
            />
            <InfoRow label="生年月日" value={application.birthday} />
            <InfoRow
              label="血液型"
              value={application.blood_type ? BLOOD_TYPE_LABELS[application.blood_type] : undefined}
            />
          </div>
        </div>

        <Separator />

        {/* 連絡先 */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            連絡先
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="メールアドレス" value={application.applicant_email} />
            <InfoRow label="電話番号" value={application.applicant_phone} />
            {application.applicant_address && (
              <div className="sm:col-span-2">
                <InfoRow label="住所" value={application.applicant_address} />
              </div>
            )}
          </div>
        </div>

        {/* 緊急連絡先 */}
        {hasEmergencyContact && (
          <>
            <Separator />
            <div>
              <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                緊急連絡先
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="氏名" value={application.emergency_contact_name} />
                <InfoRow label="続柄" value={application.emergency_contact_relationship} />
                <InfoRow label="電話番号" value={application.emergency_contact_phone} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
