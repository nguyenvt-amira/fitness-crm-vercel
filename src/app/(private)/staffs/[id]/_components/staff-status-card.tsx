'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { type GetCrmStaffsByIdResponse } from '@/lib/api/types.gen';

import { STAFF_STATUS_LABELS, StaffStatus } from '../../_constants/constants';
import { formatDateTime } from '../_lib/staff-detail.util';

type Staff = GetCrmStaffsByIdResponse['staff'];

interface StaffStatusCardProps {
  staff: Staff;
}

export function StaffStatusCard({ staff }: StaffStatusCardProps) {
  const staffStatus = staff.status as StaffStatus;
  const statusLabel = STAFF_STATUS_LABELS[staffStatus];

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-base">ステータス</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <div className="text-muted-foreground text-xs font-medium">現在のステータス</div>
            <div className="mt-1">
              {staffStatus === StaffStatus.ACTIVE ? (
                <Badge className="border border-green-700/20 bg-green-50 text-green-700">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-600" />
                    {statusLabel}
                  </span>
                </Badge>
              ) : (
                <span className="text-muted-foreground inline-flex items-center gap-2">
                  <span className="bg-foreground/20 size-2 rounded-full" />
                  {statusLabel || '-'}
                </span>
              )}
            </div>
          </div>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="flex items-start justify-between gap-4">
              <div className="text-muted-foreground text-xs font-medium">作成日時</div>
              <div className="text-foreground text-sm">{formatDateTime(staff.created_at)}</div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="text-muted-foreground text-xs font-medium">更新日時</div>
              <div className="text-foreground text-sm">{formatDateTime(staff.updated_at)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
