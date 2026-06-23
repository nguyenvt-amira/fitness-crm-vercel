'use client';

import { use } from 'react';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { parseAsInteger, useQueryState } from 'nuqs';

import { BackLink } from '@/components/common/back-link';
import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';

import {
  getCrmLessonSchedulesByScheduleIdMemosOptions,
  getCrmLessonSchedulesByScheduleIdReservationsOptions,
  getCrmLessonSchedulesByScheduleIdReservationsStatsOptions,
  getCrmLessonSchedulesByScheduleIdSpacesOptions,
  getCrmLessonSchedulesOptions,
} from '@/lib/api/@tanstack/react-query.gen';
import { navigate } from '@/lib/routes/routes.util';

import {
  LessonHeaderSkeleton,
  ReservationListSkeleton,
  ReservationStatsSkeleton,
  SpaceGridSkeleton,
} from './_components/reservation-page-skeletons';

function formatScheduleDate(iso: string): string {
  try {
    return format(new Date(iso), 'M月d日（E）', { locale: ja });
  } catch {
    return iso;
  }
}

function formatScheduleTimeRange(start: string, end: string): string {
  try {
    const startTime = format(new Date(start), 'HH:mm');
    const endTime = format(new Date(end), 'HH:mm');
    return `${startTime}〜${endTime}`;
  } catch {
    return `${start}〜${end}`;
  }
}

export default function LessonReservationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: scheduleId } = use(params);
  const router = useRouter();
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));

  const scheduleQuery = useQuery({
    ...getCrmLessonSchedulesOptions(),
    select: (data) => data.schedules.find((s) => s.id === scheduleId),
  });

  const reservationsQuery = useQuery({
    ...getCrmLessonSchedulesByScheduleIdReservationsOptions({
      path: { scheduleId },
      query: { page, pageSize: 7 },
    }),
  });

  const statsQuery = useQuery({
    ...getCrmLessonSchedulesByScheduleIdReservationsStatsOptions({
      path: { scheduleId },
    }),
  });

  const spacesQuery = useQuery({
    ...getCrmLessonSchedulesByScheduleIdSpacesOptions({
      path: { scheduleId },
    }),
  });

  const memosQuery = useQuery({
    ...getCrmLessonSchedulesByScheduleIdMemosOptions({
      path: { scheduleId },
    }),
  });

  const schedule = scheduleQuery.data;
  const stats = statsQuery.data?.stats;

  return (
    <>
      <PageHeader
        breadcrumb={
          <BackLink
            label="予約管理に戻る"
            onClick={() => router.push(navigate('/lesson-schedules'))}
          />
        }
        title={schedule?.lesson_name ?? '予約詳細'}
        subtitle={
          schedule
            ? `${formatScheduleDate(schedule.start_time)} ${formatScheduleTimeRange(schedule.start_time, schedule.end_time)}`
            : undefined
        }
        badge={
          schedule?.status === 'cancelled' ? (
            <Badge variant="outline" className="text-xs">
              中止済み
            </Badge>
          ) : stats ? (
            <Badge variant="outline" className="text-xs">
              {stats.total_reserved}/{stats.total_capacity} 予約済（残り{stats.remaining_seats}席）
            </Badge>
          ) : undefined
        }
      />

      <div className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left column: header, grid, list */}
          <div className="flex min-w-0 flex-[3] flex-col gap-4">
            <DataStateBoundary
              isLoading={scheduleQuery.isLoading}
              isError={scheduleQuery.isError}
              isEmpty={!schedule}
              onRetry={() => scheduleQuery.refetch()}
              skeleton={<LessonHeaderSkeleton />}
              emptyTitle="レッスンが見つかりません"
              emptyDescription="スケジュールIDを確認してください"
              errorTitle="レッスン情報の取得に失敗しました"
            >
              {schedule && (
                <div className="rounded-lg border p-4">
                  <p className="text-muted-foreground text-xs">レッスン情報</p>
                  <p className="mt-1 text-lg font-semibold">{schedule.lesson_name}</p>
                  <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span>{formatScheduleDate(schedule.start_time)}</span>
                    <span>{formatScheduleTimeRange(schedule.start_time, schedule.end_time)}</span>
                    <span>{schedule.studio_name ?? '—'}</span>
                    <span>{schedule.instructor_name}</span>
                  </div>
                </div>
              )}
            </DataStateBoundary>

            <DataStateBoundary
              isLoading={spacesQuery.isLoading}
              isError={spacesQuery.isError}
              isEmpty={!spacesQuery.data?.spaces?.length}
              onRetry={() => spacesQuery.refetch()}
              skeleton={<SpaceGridSkeleton />}
              emptyTitle="スペース情報がありません"
              errorTitle="スペース情報の取得に失敗しました"
            >
              {spacesQuery.data && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-semibold">
                    {spacesQuery.data.studio_name} — スペース配置
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {spacesQuery.data.spaces.length}スペース（
                    {spacesQuery.data.spaces.filter((s) => s.type === 'reserved').length}件予約済）
                  </p>
                </div>
              )}
            </DataStateBoundary>

            <DataStateBoundary
              isLoading={reservationsQuery.isLoading}
              isError={reservationsQuery.isError}
              isEmpty={!reservationsQuery.data?.reservations?.length}
              onRetry={() => reservationsQuery.refetch()}
              skeleton={<ReservationListSkeleton />}
              emptyTitle="予約者はいません"
              errorTitle="予約一覧の取得に失敗しました"
            >
              {reservationsQuery.data && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-semibold">予約一覧</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {reservationsQuery.data.total}件中{' '}
                    {(reservationsQuery.data.page - 1) * reservationsQuery.data.pageSize + 1}-
                    {Math.min(
                      reservationsQuery.data.page * reservationsQuery.data.pageSize,
                      reservationsQuery.data.total,
                    )}
                    件を表示
                  </p>
                </div>
              )}
            </DataStateBoundary>
          </div>

          {/* Right column: stats + memos */}
          <div className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-0 lg:w-[40%] lg:self-start">
            <DataStateBoundary
              isLoading={statsQuery.isLoading}
              isError={statsQuery.isError}
              isEmpty={!stats}
              onRetry={() => statsQuery.refetch()}
              skeleton={<ReservationStatsSkeleton />}
              emptyTitle="統計情報がありません"
              errorTitle="統計情報の取得に失敗しました"
            >
              {stats && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">レッスン情報</p>
                    <dl className="text-muted-foreground mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt>定員</dt>
                        <dd>{stats.total_capacity}名</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>予約数</dt>
                        <dd>{stats.total_reserved}名</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>残席</dt>
                        <dd>{stats.remaining_seats}席</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">予約統計</p>
                    <ul className="mt-2 space-y-2">
                      {stats.status_breakdown.map((item) => (
                        <li
                          key={item.status}
                          className="text-muted-foreground flex items-center justify-between text-sm"
                        >
                          <span>{item.status}</span>
                          <span>
                            {item.count}件（{item.percentage}%）
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </DataStateBoundary>

            <DataStateBoundary
              isLoading={memosQuery.isLoading}
              isError={memosQuery.isError}
              isEmpty={!memosQuery.data?.memos?.length}
              onRetry={() => memosQuery.refetch()}
              skeleton={<ReservationStatsSkeleton />}
              emptyTitle="セッションメモはありません"
              errorTitle="メモの取得に失敗しました"
            >
              {memosQuery.data && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-semibold">セッションメモ</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {memosQuery.data.memos.length}件のメモ
                  </p>
                </div>
              )}
            </DataStateBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
