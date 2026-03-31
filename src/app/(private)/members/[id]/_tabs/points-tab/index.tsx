'use client';

import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { DataTable } from '@/components/common/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdPointsOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { GetPointsResponse } from '@/lib/api/types.gen';
import { Brand } from '@/lib/api/types.gen';

import {
  ADJUSTMENT_COLUMNS,
  type AdjustmentRow,
  EARN_COLUMNS,
  type EarnRow,
  SPEND_COLUMNS,
  type SpendRow,
} from './columns';

const EARN_HISTORY_LIMIT = 20;
const SPEND_HISTORY_LIMIT = 20;

type PointsBalance = {
  current_balance: number;
  total_earned: number;
  total_spent: number;
  expiry?: string | 'none' | null;
  usage_destination: string;
};

type PointsRank = {
  current: string;
  benefits: string;
  next_rank?: {
    required_points: number;
    progress: number;
  } | null;
};

type PointsResponseUi = Omit<
  GetPointsResponse,
  'fit365' | 'joyfit' | 'rank' | 'earn_history' | 'spend_history' | 'adjustment_history'
> & {
  fit365?: PointsBalance | null;
  joyfit?: PointsBalance | null;
  rank?: PointsRank | null;
  earn_history?: EarnRow[];
  spend_history?: SpendRow[];
  adjustment_history?: AdjustmentRow[];
};

function PointsBalanceCard({
  title,
  brandLabel,
  balance,
  emptyMessage,
}: {
  title: string;
  brandLabel: string;
  balance: PointsBalance | null;
  emptyMessage: string;
}) {
  if (!balance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{brandLabel}</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">{brandLabel}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-xs">現在の保有ポイント</p>
          <p className="mt-0.5 text-2xl font-bold">{balance.current_balance.toLocaleString()}P</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">累計獲得ポイント</p>
          <p className="mt-0.5 text-lg">{balance.total_earned.toLocaleString()}P</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">累計消費ポイント</p>
          <p className="mt-0.5 text-lg">{balance.total_spent.toLocaleString()}P</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">有効期限</p>
          <p className="mt-0.5">
            {balance.expiry === 'none' || !balance.expiry ? 'なし（無期限）' : balance.expiry}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-muted-foreground text-xs">利用先</p>
          <p className="mt-0.5 text-sm">{balance.usage_destination}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PointsTab({ memberId, brand }: { memberId: string; brand: Brand }) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdPointsOptions({
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
            const pointsData = data as unknown as PointsResponseUi;
            const isFit365 = brand === 'fit365';
            const mainBalance = isFit365
              ? (pointsData.fit365 ?? null)
              : (pointsData.joyfit ?? null);

            const earnList = (pointsData.earn_history ?? []).slice(0, EARN_HISTORY_LIMIT);
            const spendList = (pointsData.spend_history ?? []).slice(0, SPEND_HISTORY_LIMIT);
            const adjustmentList = pointsData.adjustment_history ?? [];

            const hasMoreEarn = (pointsData.earn_history?.length ?? 0) > EARN_HISTORY_LIMIT;
            const hasMoreSpend = (pointsData.spend_history?.length ?? 0) > SPEND_HISTORY_LIMIT;

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <PointsBalanceCard
                    title={isFit365 ? 'FIT365: ベアレージポイント' : 'JOYFIT: エンジョイポイント'}
                    brandLabel={isFit365 ? 'ベアレージポイント' : 'エンジョイポイント'}
                    balance={mainBalance}
                    emptyMessage={
                      isFit365
                        ? 'FIT365のポイントデータがありません。'
                        : 'JOYFITのポイントデータがありません。'
                    }
                  />
                </div>

                {pointsData.rank && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">会員ランク情報</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground text-sm">現在のランク</p>
                        <p className="mt-1 font-medium">{pointsData.rank.current}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">ランク特典内容</p>
                        <p className="mt-1 text-sm">{pointsData.rank.benefits}</p>
                      </div>
                      {pointsData.rank.next_rank && (
                        <div className="sm:col-span-2">
                          <p className="text-muted-foreground text-sm">次回ランクアップ条件</p>
                          <p className="mt-1 text-sm">
                            必要ポイント: {pointsData.rank.next_rank.required_points}P / 進捗率:{' '}
                            {pointsData.rank.next_rank.progress}%
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">ポイント獲得履歴</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      最近20件{hasMoreEarn ? '（全件表示可）' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {earnList.length > 0 ? (
                      <DataTable variant="simple" columns={EARN_COLUMNS} data={earnList} />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">ポイント消費履歴</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {isFit365
                        ? 'FIT365: 月会費充当・ECサイト決済など'
                        : 'JOYFIT: 商品交換・ギフトカード交換など'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      最近20件{hasMoreSpend ? '（全件表示可）' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {spendList.length > 0 ? (
                      <DataTable variant="simple" columns={SPEND_COLUMNS} data={spendList} />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">ポイント調整履歴</CardTitle>
                    <p className="text-muted-foreground text-sm">手動付与・手動減算の履歴</p>
                  </CardHeader>
                  <CardContent>
                    {adjustmentList.length > 0 ? (
                      <DataTable
                        variant="simple"
                        columns={ADJUSTMENT_COLUMNS}
                        data={adjustmentList}
                      />
                    ) : (
                      <p className="text-muted-foreground py-4 text-sm">
                        該当のデータがありません。
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
