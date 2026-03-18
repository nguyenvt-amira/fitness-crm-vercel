'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MemberInfoTabProps = {
  application: {
    applicant_name: string;
    applicant_email?: string;
    applicant_phone?: string;
    applicant_address?: string;
  };
};

export function MemberInfoTab({ application }: MemberInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>会員情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-muted-foreground text-sm font-medium">氏名</label>
            <p className="mt-1">{application.applicant_name}</p>
          </div>
          {application.applicant_email && (
            <div>
              <label className="text-muted-foreground text-sm font-medium">メールアドレス</label>
              <p className="mt-1">{application.applicant_email}</p>
            </div>
          )}
          {application.applicant_phone && (
            <div>
              <label className="text-muted-foreground text-sm font-medium">電話番号</label>
              <p className="mt-1">{application.applicant_phone}</p>
            </div>
          )}
          {application.applicant_address && (
            <div className="sm:col-span-2">
              <label className="text-muted-foreground text-sm font-medium">住所</label>
              <p className="mt-1">{application.applicant_address}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
