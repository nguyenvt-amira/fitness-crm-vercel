'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchChangeHistory(memberId: string) {
  const response = await fetch(`/api/crm/members/${memberId}/change-history`);
  if (!response.ok) throw new Error('Failed to fetch change history');
  return response.json();
}

export function ChangeHistoryTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['member-change-history', memberId],
    queryFn: () => fetchChangeHistory(memberId),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="space-y-4">
      {data.timeline && data.timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>タイムライン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.timeline.map((item: any) => (
                <div key={item.id} className="border-b pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.eventType}</p>
                      <p className="text-muted-foreground text-sm">{item.content}</p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {new Date(item.date).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.membershipHistory && (
        <Card>
          <CardHeader>
            <CardTitle>入会履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">入会日</p>
                <p className="mt-1">
                  {new Date(data.membershipHistory.joinedAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">入会ルート</p>
                <p className="mt-1">{data.membershipHistory.joinRoute}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">入会店舗</p>
                <p className="mt-1">{data.membershipHistory.joinStore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
