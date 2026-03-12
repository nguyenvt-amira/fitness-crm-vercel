'use client';

import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchRelationships(memberId: string) {
  const response = await fetch(`/api/crm/members/${memberId}/relationships`);
  if (!response.ok) throw new Error('Failed to fetch relationships');
  return response.json();
}

export function RelationshipsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['member-relationships', memberId],
    queryFn: () => fetchRelationships(memberId),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="space-y-4">
      {data.family && data.family.children && data.family.children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>家族関係</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.family.children.map((child: any) => (
                <div key={child.id} className="border-b pb-2">
                  <p className="font-medium">
                    {child.name} ({child.memberNumber})
                  </p>
                  <p className="text-muted-foreground text-sm">続柄: {child.relationship}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.referral && data.referral.asReferrer && (
        <Card>
          <CardHeader>
            <CardTitle>紹介実績</CardTitle>
          </CardHeader>
          <CardContent>
            {data.referral.asReferrer.summary && (
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">紹介人数</p>
                  <p className="mt-1 text-xl font-bold">
                    {data.referral.asReferrer.summary.totalReferrals}人
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">累計紹介ポイント</p>
                  <p className="mt-1 text-xl font-bold">
                    {data.referral.asReferrer.summary.totalPoints}P
                  </p>
                </div>
              </div>
            )}
            {data.referral.asReferrer.referrals &&
              data.referral.asReferrer.referrals.length > 0 && (
                <div className="space-y-2">
                  {data.referral.asReferrer.referrals.map((ref: any) => (
                    <div key={ref.id} className="border-b pb-2">
                      <p className="font-medium">
                        {ref.name} ({ref.memberNumber})
                      </p>
                      <p className="text-muted-foreground text-sm">
                        紹介日: {new Date(ref.referredAt).toLocaleDateString('ja-JP')}
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
