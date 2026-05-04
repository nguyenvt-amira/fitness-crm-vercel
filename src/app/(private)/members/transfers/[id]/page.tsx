'use client';

import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { navigate } from '@/lib/routes/routes.util';

export default function TransferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      <BreadcrumbNav
        items={[
          { url: '/', label: 'ホーム' },
          { url: navigate('/members/transfers'), label: '移籍管理' },
          { label: id },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">詳細ページ準備中</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <p className="text-muted-foreground text-sm">
            この機能の詳細ページはまだ準備中です。（申請ID: {id}）
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => router.push(navigate('/members/transfers'))}
          >
            <ArrowLeft className="size-4" />
            移籍管理一覧に戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
