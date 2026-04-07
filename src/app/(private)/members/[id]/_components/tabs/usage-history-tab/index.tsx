'use client';

import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdUsageHistoryOptions } from '@/lib/api/@tanstack/react-query.gen';

import { STORE_USAGE_COLUMNS, type StoreUsageRow, VISIT_COLUMNS, type VisitRow } from './columns';

const VISIT_HISTORY_LIMIT = 50;

const TIME_SLOTS = ['6-9時', '9-12時', '12-15時', '15-18時', '18-21時', '21-24時'] as const;
const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'] as const;

export function UsageHistoryTab({ memberId }: { memberId: string }) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdUsageHistoryOptions({
      path: { id: memberId },
    }),
  );

  return (
    <DataStateBoundary
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data}
      onRetry={() => refetch()}
    >
      {data
        ? (() => {
            const summary = (data as any).summary as {
              total_visits: number;
              average_stay_time: number;
              last_visit_date?: string;
              frequent_time_slot?: string;
              frequent_day_of_week?: string;
            } | null;

            const storeUsage = ((data as any).storeUsage ?? []) as StoreUsageRow[];
            const visitRecords = ((data as any).visitRecords ?? []) as VisitRow[];

            const recentVisits = visitRecords.slice(0, VISIT_HISTORY_LIMIT);
            const hasMoreVisits = visitRecords.length > VISIT_HISTORY_LIMIT;

            const timeSlotCounts: Record<(typeof TIME_SLOTS)[number], number> = {
              '6-9時': 0,
              '9-12時': 0,
              '12-15時': 0,
              '15-18時': 0,
              '18-21時': 0,
              '21-24時': 0,
            };
            const weekdayCounts: Record<(typeof WEEKDAYS)[number], number> = {
              月: 0,
              火: 0,
              水: 0,
              木: 0,
              金: 0,
              土: 0,
              日: 0,
            };

            for (const v of visitRecords) {
              const d = new Date(v.entry_time);
              const hour = d.getHours();
              if (hour >= 6 && hour < 9) timeSlotCounts['6-9時']++;
              else if (hour >= 9 && hour < 12) timeSlotCounts['9-12時']++;
              else if (hour >= 12 && hour < 15) timeSlotCounts['12-15時']++;
              else if (hour >= 15 && hour < 18) timeSlotCounts['15-18時']++;
              else if (hour >= 18 && hour < 21) timeSlotCounts['18-21時']++;
              else if (hour >= 21 && hour < 24) timeSlotCounts['21-24時']++;

              const day = d.getDay(); // 0=日, 1=月...
              const label = WEEKDAYS[day === 0 ? 6 : day - 1];
              weekdayCounts[label]++;
            }

            const maxTimeSlotCount = Math.max(1, ...Object.values(timeSlotCounts));
            const maxWeekdayCount = Math.max(1, ...Object.values(weekdayCounts));

            return (
              <div className="space-y-4">
                {summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>利用サマリ（直近3ヶ月）</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                      <div>
                        <p className="text-muted-foreground text-sm">総来館回数</p>
                        <p className="mt-1 text-xl font-bold">{summary.total_visits}回</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">平均滞在時間</p>
                        <p className="mt-1 text-xl font-bold">{summary.average_stay_time}分</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">最終来館日</p>
                        <p className="mt-1">
                          {summary.last_visit_date
                            ? new Date(summary.last_visit_date).toLocaleDateString('ja-JP')
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">よく利用する時間帯</p>
                        <p className="mt-1">{summary.frequent_time_slot || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">よく利用する曜日</p>
                        <p className="mt-1">{summary.frequent_day_of_week || '-'}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {storeUsage.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>店舗別利用実績（直近3ヶ月）</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DataTable variant="simple" columns={STORE_USAGE_COLUMNS} data={storeUsage} />
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>来館記録</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      最近50件{hasMoreVisits ? '（全件表示可）' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {recentVisits.length > 0 ? (
                      <DataTable variant="simple" columns={VISIT_COLUMNS} data={recentVisits} />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>利用パターン分析</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium">時間帯別利用（来館回数）</p>
                      <div className="space-y-2">
                        {TIME_SLOTS.map((slot) => {
                          const count = timeSlotCounts[slot];
                          const width = `${(count / maxTimeSlotCount) * 100 || 0}%`;
                          return (
                            <div key={slot} className="flex items-center gap-2">
                              <div className="text-muted-foreground w-16 text-xs">{slot}</div>
                              <div className="bg-muted flex-1 rounded-full">
                                <div
                                  className="bg-primary h-3 rounded-full transition-all"
                                  style={{ width }}
                                />
                              </div>
                              <div className="text-muted-foreground w-10 text-right text-xs">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium">曜日別利用（来館回数）</p>
                      <div className="space-y-2">
                        {WEEKDAYS.map((day) => {
                          const count = weekdayCounts[day];
                          const width = `${(count / maxWeekdayCount) * 100 || 0}%`;
                          return (
                            <div key={day} className="flex items-center gap-2">
                              <div className="text-muted-foreground w-8 text-xs">{day}</div>
                              <div className="bg-muted flex-1 rounded-full">
                                <div
                                  className="bg-primary/70 h-3 rounded-full transition-all"
                                  style={{ width }}
                                />
                              </div>
                              <div className="text-muted-foreground w-10 text-right text-xs">
                                {count}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()
        : null}
    </DataStateBoundary>
  );
}
