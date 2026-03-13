'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchCommunications(memberId: string) {
  const response = await fetch(`/api/crm/members/${memberId}/communications`);
  if (!response.ok) throw new Error('Failed to fetch communications');
  return response.json();
}

export function CommunicationsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['member-communications', memberId],
    queryFn: () => fetchCommunications(memberId),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="space-y-4">
      {data.memos && data.memos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>スタッフメモ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.memos.map((memo: any) => (
                <div key={memo.id} className="border-b pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{memo.content}</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(memo.date).toLocaleString('ja-JP')} - {memo.created_by}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-sm">{memo.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.inquiries && data.inquiries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>問い合わせ・対応履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.inquiries.map((inq: any) => (
                <div key={inq.id} className="border-b pb-2">
                  <p className="font-medium">{inq.content}</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(inq.date).toLocaleString('ja-JP')} - {inq.staff_name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
