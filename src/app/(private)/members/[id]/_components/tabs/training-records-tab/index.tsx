'use client';

import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdTrainingRecordsOptions } from '@/lib/api/@tanstack/react-query.gen';

import {
  BODY_COLUMNS,
  type BodyRow,
  CARDIO_COLUMNS,
  type CardioRow,
  MENU_COLUMNS,
  type MenuRow,
  STRENGTH_COLUMNS,
  type StrengthRow,
} from './columns';

const STRENGTH_LIMIT = 20;
const CARDIO_LIMIT = 20;
const BODY_LIMIT = 10;

export function TrainingRecordsTab({ memberId }: { memberId: string }) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdTrainingRecordsOptions({
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
              recorded_days: number;
              total_training_time: number;
              average_training_time: number;
              frequent_exercises: string[];
            } | null;

            const strengthRecords = ((data as any).strengthRecords ?? []) as StrengthRow[];
            const cardioRecords = ((data as any).cardioRecords ?? []) as CardioRow[];
            const bodyRecords = ((data as any).bodyRecords ?? []) as BodyRow[];
            const trainingMenus = ((data as any).trainingMenus ?? []) as MenuRow[];

            const recentStrength = strengthRecords.slice(0, STRENGTH_LIMIT);
            const recentCardio = cardioRecords.slice(0, CARDIO_LIMIT);
            const recentBody = bodyRecords.slice(0, BODY_LIMIT);

            const hasMoreStrength = strengthRecords.length > STRENGTH_LIMIT;
            const hasMoreCardio = cardioRecords.length > CARDIO_LIMIT;
            const hasMoreBody = bodyRecords.length > BODY_LIMIT;

            return (
              <div className="space-y-4">
                {summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>トレーニングサマリ（直近1ヶ月）</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground text-sm">記録日数</p>
                        <p className="mt-1 text-xl font-bold">{summary.recorded_days}日</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">総トレーニング時間</p>
                        <p className="mt-1 text-xl font-bold">{summary.total_training_time}分</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">平均トレーニング時間</p>
                        <p className="mt-1 text-xl font-bold">{summary.average_training_time}分</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">よく行う種目</p>
                        <p className="mt-1">
                          {summary.frequent_exercises && summary.frequent_exercises.length > 0
                            ? summary.frequent_exercises.join(', ')
                            : '-'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>筋トレ記録</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      最近20件{hasMoreStrength ? '（全件表示可）' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {recentStrength.length > 0 ? (
                      <DataTable
                        variant="simple"
                        columns={STRENGTH_COLUMNS}
                        data={recentStrength}
                      />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>有酸素運動記録</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      最近20件{hasMoreCardio ? '（全件表示可）' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {recentCardio.length > 0 ? (
                      <DataTable variant="simple" columns={CARDIO_COLUMNS} data={recentCardio} />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>身体記録</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      最近10件{hasMoreBody ? '（全件表示可）' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {recentBody.length > 0 ? (
                      <DataTable variant="simple" columns={BODY_COLUMNS} data={recentBody} />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>トレーニングメニュー（保存済み）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {trainingMenus.length > 0 ? (
                      <DataTable variant="simple" columns={MENU_COLUMNS} data={trainingMenus} />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        保存済みのトレーニングメニューがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })()
        : null}
    </DataStateBoundary>
  );
}
