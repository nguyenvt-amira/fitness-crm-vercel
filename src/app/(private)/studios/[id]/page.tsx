'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { BackLink } from '@/components/common/back-link';
import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { StaffRole } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';
import { cn } from '@/lib/utils';

import { StudioBasicInfoCard } from './_components/studio-basic-info-card';
import { StudioDeleteDialog } from './_components/studio-delete-dialog';
import { StudioDetailHeaderActions } from './_components/studio-detail-header-actions';
import { StudioDetailSkeleton } from './_components/studio-detail-skeleton';
import { StudioImagesCard } from './_components/studio-images-card';
import { StudioLayoutCard } from './_components/studio-layout-card';
import { StudioLinkedLessonsCard } from './_components/studio-linked-lessons-card';
import { StudioUtilizationCard } from './_components/studio-utilization-card';
import { useStudioDetail } from './_hooks/use-studio-detail';

const STUDIO_STATUS_BADGE_CLASSES: Record<'active' | 'inactive', string> = {
  active: 'bg-success/15 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
};

const STUDIO_TYPE_BADGE_CLASSES = {
  'studio-lesson': 'bg-info/10 text-info border-info/20',
  pt: 'bg-warning/10 text-warning border-warning/20',
  'body-care': 'bg-muted text-muted-foreground border-border',
} as const;

/**
 * Studio Detail Page (FR-003: Studio Detail Display)
 * Displays complete studio information including:
 * - Header with studio name, type, and status badges
 * - Basic information card
 * - Studio images
 * - Layout preview or not-configured state
 * - Utilization summary
 * - Linked lessons
 * - Change History tab (title-only in Phase 1)
 * - Role-based action visibility (Edit/Delete)
 * - Delete guard for in-use studios
 */
export default function StudioDetailPage() {
  const params = useParams();
  const studioId = params.id as string;
  const [activeTab, setActiveTab] = useState('basic');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Phase 1: use a fixed role until auth context wiring is added.
  const userRole: StaffRole = 'headquarter';

  const { data: studioData, isLoading, isError, error, refetch } = useStudioDetail(studioId);
  const isNotFound = error?.message === 'NOT_FOUND';

  if (!studioData?.data && !isLoading && !isError) {
    return null;
  }

  const studio = studioData?.data;
  if (!studio) {
    return (
      <DataStateBoundary
        isLoading={isLoading}
        isError={isError && !isNotFound}
        isEmpty={isNotFound || !studioData?.data}
        onRetry={() => void refetch()}
        emptyTitle="スタジオが見つかりません"
        emptyDescription={`指定されたスタジオID（${studioId}）は存在しません。`}
        skeleton={<StudioDetailSkeleton />}
      />
    );
  }
  const studioTypeLabel = {
    'studio-lesson': 'スタジオレッスン',
    pt: 'パーソナル',
    'body-care': 'ボディケア',
  }[studio.studio_type];

  const handleDelete = async () => {
    // Phase 1 placeholder: delete flow will be wired to API in a later task.
    console.log('Delete studio:', studioId);
    setShowDeleteDialog(false);
    // router.push('/studios'); // Navigate back after delete
  };

  return (
    <DataStateBoundary
      isLoading={isLoading}
      isError={isError && !isNotFound}
      isEmpty={isNotFound || !studioData?.data}
      onRetry={() => void refetch()}
      emptyTitle="スタジオが見つかりません"
      emptyDescription={`指定されたスタジオID（${studioId}）は存在しません。`}
      skeleton={<StudioDetailSkeleton />}
    >
      <div className="flex flex-col">
        <PageHeader
          breadcrumb={<BackLink label="スタジオ管理に戻る" href={navigate('/studios')} />}
          title={studio.name}
          badge={
            <>
              <Badge
                variant="outline"
                className={cn('text-xs font-medium', STUDIO_TYPE_BADGE_CLASSES[studio.studio_type])}
              >
                {studioTypeLabel}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'gap-1 text-xs font-medium',
                  STUDIO_STATUS_BADGE_CLASSES[studio.status],
                )}
              >
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    studio.status === 'active' ? 'bg-success' : 'bg-muted-foreground',
                  )}
                />
                {studio.status === 'active' ? '有効' : '無効'}
              </Badge>
            </>
          }
          actions={
            <StudioDetailHeaderActions
              studioId={studioId}
              userRole={userRole}
              onDelete={() => setShowDeleteDialog(true)}
            />
          }
        />

        <div className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
            <TabsList variant="line">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="history">変更履歴</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="pt-4">
              <div className="flex flex-col gap-6 xl:flex-row">
                {/* Left column */}
                <div className="min-w-0 flex-1 space-y-4">
                  {/* Basic Info Card */}
                  <StudioBasicInfoCard studio={studio} />

                  {/* Layout Card */}
                  <StudioLayoutCard layout={studioData.layout} />

                  {/* Images Card */}
                  <StudioImagesCard images={studioData.images} />
                </div>

                {/* Right column */}
                <div className="w-full space-y-4 xl:w-90 xl:shrink-0">
                  {/* Status Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">ステータス</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">状態：</span>
                        <span className="ml-2 font-medium">
                          {studio.status === 'active' ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">リンクレッスン数：</span>
                        <span className="ml-2 font-medium">{studio.assigned_lesson_count}件</span>
                      </p>
                    </CardContent>
                  </Card>

                  {/* Utilization Card */}
                  <StudioUtilizationCard utilization={studioData.utilization} />

                  {/* Linked Lessons Card */}
                  <StudioLinkedLessonsCard lessons={studioData.linked_lessons} />
                </div>
              </div>
            </TabsContent>

            {/* Change History Tab - Phase 1 empty placeholder */}
            <TabsContent value="history" className="pt-4">
              <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <p className="text-muted-foreground text-sm">変更履歴は今後実装予定です</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete Confirmation Dialog */}
        <StudioDeleteDialog
          open={showDeleteDialog}
          studioName={studio.name}
          assignedLessonCount={studio.assigned_lesson_count}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </DataStateBoundary>
  );
}
