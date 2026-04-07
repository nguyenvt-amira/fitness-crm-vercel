'use client';

import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdServiceUsageOptions } from '@/lib/api/@tanstack/react-query.gen';

import {
  LOCKER_COLUMNS,
  type LockerRow,
  PT_HISTORY_COLUMNS,
  PT_RESERVATION_COLUMNS,
  PURCHASE_COLUMNS,
  type PtHistoryRow,
  type PtReservationRow,
  type PurchaseRow,
  STUDIO_PARTICIPATION_COLUMNS,
  STUDIO_RESERVATION_COLUMNS,
  type StudioParticipationRow,
  type StudioReservationRow,
  TANNING_COLUMNS,
  type TanningRow,
} from './columns';

export function ServiceUsageTab({ memberId }: { memberId: string }) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdServiceUsageOptions({
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
            const personalTraining = (data as any).personalTraining as {
              reservations: PtReservationRow[];
              history: PtHistoryRow[];
            } | null;

            const studioProgram = (data as any).studioProgram as {
              participation_history: StudioParticipationRow[];
              reservation_history: StudioReservationRow[];
            } | null;

            const otherServices = (data as any).otherServices as {
              tanning: TanningRow[];
              locker: LockerRow[];
              purchases: PurchaseRow[];
            } | null;

            return (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>パーソナルトレーニング</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm font-semibold">予約状況</p>
                      {personalTraining?.reservations &&
                      personalTraining.reservations.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={PT_RESERVATION_COLUMNS}
                          data={personalTraining.reservations}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          予約中のデータがありません。
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold">
                        実施履歴（最近10件
                        {(personalTraining?.history?.length ?? 0) > 10 ? '、全件表示可' : ''}）
                      </p>
                      {personalTraining?.history && personalTraining.history.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={PT_HISTORY_COLUMNS}
                          data={personalTraining.history.slice(0, 10)}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">実施履歴がありません。</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>スタジオプログラム</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm font-semibold">
                        参加履歴（最近20件
                        {(studioProgram?.participation_history?.length ?? 0) > 20
                          ? '、全件表示可'
                          : ''}
                        ）
                      </p>
                      {studioProgram?.participation_history &&
                      studioProgram.participation_history.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={STUDIO_PARTICIPATION_COLUMNS}
                          data={studioProgram.participation_history.slice(0, 20)}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">参加履歴がありません。</p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold">予約・キャンセル履歴</p>
                      {studioProgram?.reservation_history &&
                      studioProgram.reservation_history.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={STUDIO_RESERVATION_COLUMNS}
                          data={studioProgram.reservation_history}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          予約・キャンセル履歴がありません。
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>その他オプション利用</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="mb-2 text-sm font-semibold">タンニング利用</p>
                      {otherServices?.tanning && otherServices.tanning.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={TANNING_COLUMNS}
                          data={otherServices.tanning}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          タンニング利用履歴がありません。
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold">ロッカー利用</p>
                      {otherServices?.locker && otherServices.locker.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={LOCKER_COLUMNS}
                          data={otherServices.locker}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          ロッカー利用情報がありません。
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold">物販購入履歴</p>
                      {otherServices?.purchases && otherServices.purchases.length > 0 ? (
                        <DataTable
                          variant="simple"
                          columns={PURCHASE_COLUMNS}
                          data={otherServices.purchases}
                        />
                      ) : (
                        <p className="text-muted-foreground text-sm">物販購入履歴がありません。</p>
                      )}
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
