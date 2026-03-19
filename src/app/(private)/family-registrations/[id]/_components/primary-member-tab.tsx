'use client';

import { Card, CardContent } from '@/components/ui/card';

import type { GetCrmFamilyRegistrationsByIdResponse } from '@/lib/api/types.gen';

export function PrimaryMemberTab({
  registration,
}: Readonly<{ registration: GetCrmFamilyRegistrationsByIdResponse['registration'] }>) {
  return (
    <Card>
      <CardContent className="grid gap-3 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">主会員ID</span>
          <span className="font-medium">{registration.primary_member_id}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">氏名</span>
          <span className="font-medium">{registration.primary_member_name}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">会員番号</span>
          <span className="font-medium">{registration.primary_member?.member_number ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">会員ステータス</span>
          <span className="font-medium">{registration.primary_member?.status ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">未払い</span>
          <span className="font-medium">
            {registration.primary_member?.has_unpaid ? 'あり' : 'なし'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
