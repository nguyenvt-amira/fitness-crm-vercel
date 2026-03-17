'use client';

import { GetPointsResponse } from '@/app/api/_schemas/member.schema';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getCrmMembersByIdPointsOptions } from '@/lib/api/@tanstack/react-query.gen';

import { Brand } from '@/types/api/member.type';

const EARN_HISTORY_LIMIT = 20;
const SPEND_HISTORY_LIMIT = 20;

function formatDateTime(v: string) {
  return new Date(v).toLocaleString('ja-JP');
}

function PointsBalanceCard({
  title,
  brandLabel,
  balance,
  emptyMessage,
}: {
  title: string;
  brandLabel: string;
  balance: GetPointsResponse['fit365'] | GetPointsResponse['joyfit'];
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
  const { data, isLoading } = useQuery(
    getCrmMembersByIdPointsOptions({
      path: { id: memberId },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">データが見つかりません</div>
      </div>
    );
  }

  const pointsData = data as unknown as GetPointsResponse;
  const isFit365 = brand === Brand.FIT365;
  const mainBalance = isFit365 ? (pointsData.fit365 ?? null) : (pointsData.joyfit ?? null);
  const earnList = (pointsData.earn_history ?? []).slice(0, EARN_HISTORY_LIMIT);
  const spendList = (pointsData.spend_history ?? []).slice(0, SPEND_HISTORY_LIMIT);
  const adjustmentList = pointsData.adjustment_history ?? [];
  const hasMoreEarn = (pointsData.earn_history?.length ?? 0) > EARN_HISTORY_LIMIT;
  const hasMoreSpend = (pointsData.spend_history?.length ?? 0) > SPEND_HISTORY_LIMIT;

  return (
    <div className="space-y-4">
      {/* ポイント保有状況カード（会員のブランドに応じて表示） */}
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

      {/* 会員ランク情報 */}
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

      {/* ポイント獲得履歴（最近20件） */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">ポイント獲得履歴</CardTitle>
          <p className="text-muted-foreground text-sm">
            最近20件{hasMoreEarn ? '（全件表示可）' : ''}
          </p>
        </CardHeader>
        <CardContent>
          {earnList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">獲得日時</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">獲得理由</TableHead>
                  <TableHead className="text-foreground text-right text-sm font-medium">
                    ポイント数
                  </TableHead>
                  <TableHead className="text-foreground text-sm font-medium">詳細・備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm">{formatDateTime(row.date)}</TableCell>
                    <TableCell className="text-sm">{row.reason}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-green-600">
                      +{row.points}P
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {row.notes ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground py-4 text-sm">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* ポイント消費履歴（最近20件） */}
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">消費日時</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">消費内容</TableHead>
                  <TableHead className="text-foreground text-right text-sm font-medium">
                    ポイント数
                  </TableHead>
                  <TableHead className="text-foreground text-sm font-medium">詳細・備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spendList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm">{formatDateTime(row.date)}</TableCell>
                    <TableCell className="text-sm">{row.content}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-red-600">
                      -{row.points}P
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {row.notes ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground py-4 text-sm">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>

      {/* ポイント調整履歴（該当する場合） */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">ポイント調整履歴</CardTitle>
          <p className="text-muted-foreground text-sm">手動付与・手動減算の履歴</p>
        </CardHeader>
        <CardContent>
          {adjustmentList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-foreground text-sm font-medium">調整日時</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">調整種別</TableHead>
                  <TableHead className="text-foreground text-right text-sm font-medium">
                    ポイント数
                  </TableHead>
                  <TableHead className="text-foreground text-sm font-medium">調整理由</TableHead>
                  <TableHead className="text-foreground text-sm font-medium">
                    実施スタッフ
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustmentList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm">{formatDateTime(row.date)}</TableCell>
                    <TableCell className="text-sm">
                      {row.adjustment_type === 'add' ? '手動付与' : '手動減算'}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {row.adjustment_type === 'add' ? '+' : '-'}
                      {row.points}P
                    </TableCell>
                    <TableCell className="text-sm">{row.reason}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {row.adjusted_by ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground py-4 text-sm">該当のデータがありません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
