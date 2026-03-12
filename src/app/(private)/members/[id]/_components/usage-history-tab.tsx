'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchUsageHistory(memberId: string) {
  const response = await fetch(`/api/crm/members/${memberId}/usage-history`);
  if (!response.ok) throw new Error('Failed to fetch usage history');
  return response.json();
}

export function UsageHistoryTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['member-usage-history', memberId],
    queryFn: () => fetchUsageHistory(memberId),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="space-y-4">
      {data.summary && (
        <Card>
          <CardHeader>
            <CardTitle>利用サマリ（直近3ヶ月）</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-muted-foreground text-sm">総来館回数</p>
              <p className="mt-1 text-xl font-bold">{data.summary.totalVisits}回</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">平均滞在時間</p>
              <p className="mt-1 text-xl font-bold">{data.summary.averageStayTime}分</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">最終来館日</p>
              <p className="mt-1">
                {data.summary.lastVisitDate
                  ? new Date(data.summary.lastVisitDate).toLocaleDateString('ja-JP')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">よく利用する時間帯</p>
              <p className="mt-1">{data.summary.frequentTimeSlot || '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">よく利用する曜日</p>
              <p className="mt-1">{data.summary.frequentDayOfWeek || '-'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.visitRecords && data.visitRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>来館記録</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.visitRecords.map((record: any) => (
                <div key={record.id} className="border-b pb-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground text-sm">来館日時</p>
                      <p className="mt-1">{new Date(record.entryTime).toLocaleString('ja-JP')}</p>
                    </div>
                    {record.exitTime && (
                      <div>
                        <p className="text-muted-foreground text-sm">退館日時</p>
                        <p className="mt-1">{new Date(record.exitTime).toLocaleString('ja-JP')}</p>
                      </div>
                    )}
                    {record.stayTime && (
                      <div>
                        <p className="text-muted-foreground text-sm">滞在時間</p>
                        <p className="mt-1">{record.stayTime}分</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground text-sm">利用店舗</p>
                      <p className="mt-1">{record.storeName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
