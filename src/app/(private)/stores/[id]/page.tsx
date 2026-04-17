'use client';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Circle, Pencil, TriangleAlert } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCrmStoresByIdOptions } from '@/lib/api/@tanstack/react-query.gen';
import { navigate } from '@/lib/routes/routes.util';

import { STORE_STATUS_BADGE_CLASSES, STORE_STATUS_LABELS } from '../_constants/constants';
import { BasicInfoTab } from './_components/tabs/basic-info-tab';
import { BusinessSettingsTab } from './_components/tabs/business-settings-tab';

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery({
    ...getCrmStoresByIdOptions({ path: { id } }),
    enabled: Boolean(id),
  });

  const store = data?.store;

  if (isLoading || isError || !store) {
    return (
      <DataStateBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={!store}
        onRetry={() => refetch()}
        errorTitle="店舗情報の取得に失敗しました"
      />
    );
  }

  const tabTriggerClass =
    'data-[state=active]:bg-background flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ' +
    'data-[state=active]:shadow-sm disabled:opacity-50';

  return (
    <div className="min-h-full bg-neutral-50">
      <div className="w-full space-y-6 px-4 py-6 md:px-8">
        <div className="space-y-5">
          <div className="space-y-3">
            <BreadcrumbNav
              items={[{ url: navigate('/stores'), label: '店舗管理' }, { label: '店舗詳細' }]}
              variant="section"
            />
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-foreground text-xl font-bold tracking-tight">{store.name}</h1>
              <Badge className={`border ${STORE_STATUS_BADGE_CLASSES[store.status]}`}>
                <span className="inline-flex items-center gap-2">
                  <Circle className="size-2 shrink-0 fill-current" aria-hidden />
                  {STORE_STATUS_LABELS[store.status]}
                </span>
              </Badge>
            </div>
          </div>

          <Alert
            className="rounded-lg border-amber-500 bg-amber-50/90 px-2.5 py-2 text-amber-950 [&>svg]:text-amber-600"
            role="status"
          >
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            <AlertDescription className="text-muted-foreground col-start-2 text-sm leading-relaxed">
              掲載期間や入退室設定の変更は、会員の利用に即時反映されます。
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="basic" className="w-full gap-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="basic" className={tabTriggerClass}>
                基本情報
              </TabsTrigger>
              <TabsTrigger value="business" className={tabTriggerClass}>
                営業設定
              </TabsTrigger>
              <TabsTrigger value="contract" disabled className={tabTriggerClass}>
                契約・料金
              </TabsTrigger>
              <TabsTrigger value="access" disabled className={tabTriggerClass}>
                入退室設定
              </TabsTrigger>
              <TabsTrigger value="restrictions" disabled className={tabTriggerClass}>
                機能制限
              </TabsTrigger>
            </TabsList>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border bg-card shrink-0 gap-2 rounded-lg px-4"
              onClick={() => router.push(navigate('/stores/[id]/edit', store.id))}
            >
              <Pencil className="size-4" />
              基本情報を編集
            </Button>
          </div>

          <TabsContent value="basic" className="mt-6 focus-visible:outline-none">
            <BasicInfoTab store={store} />
          </TabsContent>
          <TabsContent value="business" className="mt-0 focus-visible:outline-none">
            <BusinessSettingsTab storeId={store.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
