'use client';

import { Card, CardContent } from '@/components/ui/card';

import type { GetCrmFamilyRegistrationsByIdResponse } from '@/lib/api/types.gen';

export function ApplicantTab({
  registration,
}: Readonly<{ registration: GetCrmFamilyRegistrationsByIdResponse['registration'] }>) {
  return (
    <Card>
      <CardContent className="grid gap-3 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">氏名</span>
          <span className="font-medium">{registration.applicant_name}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">生年月日</span>
          <span className="font-medium">{registration.applicant?.birthday ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">電話番号</span>
          <span className="font-medium">{registration.applicant?.phone ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">メール</span>
          <span className="font-medium">{registration.applicant?.email ?? '—'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
