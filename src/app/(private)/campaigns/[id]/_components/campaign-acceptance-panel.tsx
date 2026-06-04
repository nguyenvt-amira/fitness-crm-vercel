'use client';

import { useState } from 'react';

import { Megaphone } from 'lucide-react';

import { StatusCard as StatusCardComponent } from '@/components/common/status-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import type { CampaignDetail } from '@/lib/api/types.gen';

type CampaignAcceptancePanelProps = {
  campaign: CampaignDetail;
};

export function CampaignAcceptancePanel({ campaign }: Readonly<CampaignAcceptancePanelProps>) {
  const [acceptEnabled, setAcceptEnabled] = useState(campaign.accept_status === 'active');

  return (
    <StatusCardComponent
      tone={acceptEnabled ? 'success' : 'muted'}
      icon={Megaphone}
      label={acceptEnabled ? '受付中' : '受付停止'}
      meta={[
        `募集期間: ${campaign.recruitment_period_start} 〜 ${campaign.recruitment_period_end}`,
        'OFFで入会フローから非表示',
      ]}
      action={
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-full rounded-[10px] px-4 text-sm font-medium"
              />
            }
          >
            {acceptEnabled ? '受付を停止する' : '受付を再開する'}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {acceptEnabled
                  ? 'このキャンペーンの受付を停止しますか？'
                  : 'このキャンペーンの受付を再開しますか？'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {acceptEnabled
                  ? '受付停止中は入会フローでこのキャンペーンが表示されなくなります。既存の適用会員への影響はありません。'
                  : '受付再開すると入会フローで再びこのキャンペーンが表示されます。'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={() => setAcceptEnabled(!acceptEnabled)}>
                {acceptEnabled ? '停止する' : '再開する'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    />
  );
}
