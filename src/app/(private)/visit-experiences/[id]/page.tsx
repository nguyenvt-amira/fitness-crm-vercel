import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { navigate } from '@/lib/routes/routes.util';

export default async function VisitExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="bg-muted/40 min-h-0 flex-1 overflow-auto p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground text-sm">予約 {id} の詳細画面は準備中です。</p>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href={navigate('/visit-experiences')}>
              <ArrowLeft className="mr-2 size-4" />
              見学・体験一覧に戻る
            </Link>
          }
        />
      </div>
    </main>
  );
}
