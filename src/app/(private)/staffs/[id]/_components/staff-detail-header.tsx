'use client';

import { Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';

import { StaffDeleteAction } from '../../_components/staff-delete-action';
import { STAFF_STATUS_LABELS, StaffStatus } from '../../_constants/constants';

interface StaffDetailHeaderProps {
  staffId: string;
  fullName: string;
  staffStatus: StaffStatus;
  onEdit: () => void;
}

export function StaffDetailHeader({
  staffId,
  fullName,
  staffStatus,
  onEdit,
}: StaffDetailHeaderProps) {
  const statusLabel = STAFF_STATUS_LABELS[staffStatus];

  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <CardTitle className="text-lg sm:text-xl">{fullName}</CardTitle>
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

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 size-4" />
          編集
        </Button>

        <StaffDeleteAction staffId={staffId} />
      </div>
    </div>
  );
}
