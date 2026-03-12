'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchTrainingRecords(memberId: string) {
  const response = await fetch(`/api/crm/members/${memberId}/training-records`);
  if (!response.ok) throw new Error('Failed to fetch training records');
  return response.json();
}

export function TrainingRecordsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['member-training-records', memberId],
    queryFn: () => fetchTrainingRecords(memberId),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="space-y-4">
      {data.summary && (
        <Card>
          <CardHeader>
            <CardTitle>トレーニングサマリ（直近1ヶ月）</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">記録日数</p>
              <p className="mt-1 text-xl font-bold">{data.summary.recordedDays}日</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">総トレーニング時間</p>
              <p className="mt-1 text-xl font-bold">{data.summary.totalTrainingTime}分</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">平均トレーニング時間</p>
              <p className="mt-1 text-xl font-bold">{data.summary.averageTrainingTime}分</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">よく行う種目</p>
              <p className="mt-1">{data.summary.frequentExercises.join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.strengthRecords && data.strengthRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>筋トレ記録</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.strengthRecords.map((record: any) => (
                <div key={record.id} className="border-b pb-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground text-sm">記録日時</p>
                      <p className="mt-1">{new Date(record.date).toLocaleString('ja-JP')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">種目名</p>
                      <p className="mt-1">{record.exerciseName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">重量・回数</p>
                      <p className="mt-1">
                        {record.weight}kg × {record.reps}回 × {record.sets}セット
                      </p>
                    </div>
                    {record.notes && (
                      <div>
                        <p className="text-muted-foreground text-sm">メモ</p>
                        <p className="mt-1">{record.notes}</p>
                      </div>
                    )}
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
