'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchServiceUsage(memberId: string) {
  const response = await fetch(`/api/crm/members/${memberId}/service-usage`);
  if (!response.ok) throw new Error('Failed to fetch service usage');
  return response.json();
}

export function ServiceUsageTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['member-service-usage', memberId],
    queryFn: () => fetchServiceUsage(memberId),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="space-y-4">
      {data.personalTraining && (
        <Card>
          <CardHeader>
            <CardTitle>パーソナルトレーニング</CardTitle>
          </CardHeader>
          <CardContent>
            {data.personalTraining.reservations &&
              data.personalTraining.reservations.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 font-medium">予約状況</p>
                  <div className="space-y-2">
                    {data.personalTraining.reservations.map((res: any) => (
                      <div key={res.id} className="border-b pb-2">
                        <p>
                          {new Date(res.date).toLocaleString('ja-JP')} - {res.trainer_name} -{' '}
                          {res.menu}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {data.personalTraining.history && data.personalTraining.history.length > 0 && (
              <div>
                <p className="mb-2 font-medium">実施履歴</p>
                <div className="space-y-2">
                  {data.personalTraining.history.map((hist: any) => (
                    <div key={hist.id} className="border-b pb-2">
                      <p>
                        {new Date(hist.date).toLocaleString('ja-JP')} - {hist.trainer_name} -{' '}
                        {hist.rating ? `評価: ${hist.rating}/5` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {data.studioProgram && (
        <Card>
          <CardHeader>
            <CardTitle>スタジオプログラム</CardTitle>
          </CardHeader>
          <CardContent>
            {data.studioProgram.participation_history &&
              data.studioProgram.participation_history.length > 0 && (
                <div className="space-y-2">
                  {data.studioProgram.participation_history.map((part: any) => (
                    <div key={part.id} className="border-b pb-2">
                      <p>
                        {new Date(part.date).toLocaleString('ja-JP')} - {part.program_name} -{' '}
                        {part.instructor_name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
