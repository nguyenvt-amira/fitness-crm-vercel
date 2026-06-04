'use client';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { BackLink } from '@/components/common/back-link';
import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { PageHeader } from '@/components/common/page-header';
import { RoleGatedButton } from '@/components/common/role-gated-button';
import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCrmCampaignsByIdOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmCampaignsByIdResponse } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { UserRole } from '@/types/permission.type';

import { BasicInfoTab } from './_components/basic-info-tab';
import { CampaignDetailSkeleton } from './_components/campaign-detail-skeleton';

type CampaignDetail = NonNullable<GetCrmCampaignsByIdResponse>['campaign'];

function ComingSoonTab({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 py-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();

  const campaignId = params.id as string;

  const { data, isLoading, isError, refetch } = useQuery({
    ...getCrmCampaignsByIdOptions({
      path: { id: campaignId },
    }),
  });

  if (isLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (isError || !data?.campaign) {
    return (
      <DataStateBoundary
        isLoading={false}
        isError={isError}
        isEmpty={!data?.campaign}
        onRetry={() => refetch()}
        emptyTitle="キャンペーンが見つかりません"
      />
    );
  }

  const campaign: CampaignDetail = data.campaign;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        breadcrumb={
          <BackLink
            label="キャンペーン管理に戻る"
            onClick={() => router.push(navigate('/campaigns'))}
          />
        }
        title={campaign.name}
        className="[&_h1]:leading-8"
        actions={
          <div className="flex items-center gap-2">
            <RoleGatedButton
              allowedRoles={[UserRole.Headquarter, UserRole.System]}
              variant="default"
              size="sm"
              className="h-9 gap-1.5 rounded-[10px] px-3 text-sm font-medium"
              onClick={() => undefined}
            >
              <Pencil className="size-4" />
              編集
            </RoleGatedButton>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="border-input hover:bg-accent flex size-8 items-center justify-center rounded-[10px] border">
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <RoleGatedMenuItem
                  allowedRoles={[UserRole.Headquarter, UserRole.System]}
                  onClick={() => undefined}
                >
                  <Pencil className="size-4" />
                  編集
                </RoleGatedMenuItem>
                <DropdownMenuSeparator />
                <RoleGatedMenuItem
                  allowedRoles={[UserRole.Headquarter, UserRole.System]}
                  className="text-destructive focus:text-destructive"
                  disabled
                  tooltip="削除はこの画面では未対応です"
                  onClick={() => undefined}
                >
                  <Trash2 className="size-4" />
                  削除
                </RoleGatedMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <Tabs defaultValue="basic" className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="px-6 pt-4">
          <TabsList>
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="promo">プロモーションコード</TabsTrigger>
            <TabsTrigger value="history">変更履歴</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="basic" className="min-h-0 flex-1 overflow-y-auto px-6 pt-0 pb-4">
          <BasicInfoTab campaign={campaign} />
        </TabsContent>

        <TabsContent value="promo" className="min-h-0 flex-1 overflow-y-auto px-6 pt-0 pb-4">
          <ComingSoonTab
            title="プロモーションコード"
            description="このタブは次のスライスで実装します。"
          />
        </TabsContent>

        <TabsContent value="history" className="min-h-0 flex-1 overflow-y-auto px-6 pt-0 pb-4">
          <ComingSoonTab title="変更履歴" description="このタブは次のスライスで実装します。" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
