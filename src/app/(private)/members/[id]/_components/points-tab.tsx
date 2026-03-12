'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdPointsOptions } from '@/lib/api/@tanstack/react-query.gen';

export function PointsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery(
    getCrmMembersByIdPointsOptions({
      path: {
        id: memberId,
      },
    }),
  );

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  const pointsData = data as any;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ポイント保有状況</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-sm">現在の保有ポイント</p>
            <p className="mt-1 text-2xl font-bold">
              {pointsData.points?.currentBalance?.toLocaleString() || 0}P
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">累計獲得ポイント</p>
            <p className="mt-1 text-xl">{pointsData.points?.totalEarned?.toLocaleString() || 0}P</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">累計消費ポイント</p>
            <p className="mt-1 text-xl">{pointsData.points?.totalSpent?.toLocaleString() || 0}P</p>
          </div>
          {pointsData.points?.rank && (
            <>
              <div>
                <p className="text-muted-foreground text-sm">現在のランク</p>
                <p className="mt-1">{pointsData.points.rank.current}</p>
              </div>
              {pointsData.points.rank.nextRank && (
                <div className="md:col-span-2">
                  <p className="text-muted-foreground text-sm">次回ランクアップ</p>
                  <p className="mt-1">
                    必要ポイント: {pointsData.points.rank.nextRank.requiredPoints}P / 進捗率:{' '}
                    {pointsData.points.rank.nextRank.progress}%
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {pointsData.earnHistory && pointsData.earnHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ポイント獲得履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pointsData.earnHistory.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.reason}</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(item.date).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">+{item.points}P</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pointsData.spendHistory && pointsData.spendHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ポイント消費履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pointsData.spendHistory.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.reason}</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(item.date).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-red-600">{item.points}P</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
