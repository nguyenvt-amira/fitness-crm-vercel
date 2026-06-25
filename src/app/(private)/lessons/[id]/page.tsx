'use client';

import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';

import { navigate } from '@/lib/routes/routes.util';

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  return (
    <div className="flex flex-col">
      <PageHeader
        title="レッスン内容詳細"
        subtitle={params.id}
        actions={
          <Button variant="outline" onClick={() => router.push(navigate('/lessons'))}>
            <ArrowLeft className="size-4" />
            一覧へ戻る
          </Button>
        }
      />
      <div className="text-muted-foreground px-6 py-12 text-center text-sm">
        この画面は準備中です。
      </div>
    </div>
  );
}
