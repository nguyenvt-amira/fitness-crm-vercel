'use client';

import { useState } from 'react';

import { formatDateYYYYMM_HHMMSS, formatElapsedTime } from '@/utils/date.util';
import { Edit } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { GetCrmMembershipApplicationsByIdResponse } from '@/lib/api';

import { EditMembershipApplicationModal } from './edit-membership-application-modal';

type BasicInfoCardProps = {
  application: GetCrmMembershipApplicationsByIdResponse['application'];
  statusLabels: Record<string, string>;
};

export function BasicInfoCard({ application, statusLabels }: BasicInfoCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <EditMembershipApplicationModal
          open={editOpen}
          onOpenChange={setEditOpen}
          application={application}
        />
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold">会員基本情報</h2>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
            <Edit className="size-4" />
            編集
          </Button>
        </div>

        <div className="mt-4 flex gap-4">
          <Avatar size="lg" className="size-16">
            <AvatarImage src={application.applicant_name} alt={application.applicant_name} />
            <AvatarFallback>
              {application.applicant_name?.trim()?.[0]?.toUpperCase() || 'M'}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold">{application.applicant_name}</span>
                <span className="text-muted-foreground text-sm">{application.applicant_name}</span>
              </div>
              <div className="text-muted-foreground flex gap-4 text-sm">
                <span>性別：男</span>
                <span>生年月日：2000/01/01</span>
                <span>血液型：A</span>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">申込ID：{application.id}</div>
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                申込日時：{formatDateYYYYMM_HHMMSS(application.applied_at)}
              </span>
              <span className="text-muted-foreground">
                ステータス：{statusLabels[application.status] || application.status}
              </span>
              <span className="text-muted-foreground">
                経過時間：{formatElapsedTime(application.applied_at)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
