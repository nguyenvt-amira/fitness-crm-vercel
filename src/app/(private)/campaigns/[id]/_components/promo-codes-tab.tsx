'use client';

import type { CampaignDetail } from '@/app/api/_schemas/campaign.schema';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type PromoCodePreview = CampaignDetail['promo_code_previews'][number];

interface PromoCodesTabProps {
  promoCodePreviews?: CampaignDetail['promo_code_previews'];
}

const STATUS_LABELS: Record<PromoCodePreview['status'], string> = {
  active: '有効',
  expired: '期限切れ',
  limit_reached: '上限到達',
  inactive: '無効',
};

const STATUS_CLASS_NAMES: Record<PromoCodePreview['status'], string> = {
  active: 'border-success/20 bg-success/15 text-success',
  expired: 'border-warning/20 bg-warning/15 text-warning',
  limit_reached: 'border-destructive/20 bg-destructive/15 text-destructive',
  inactive: 'border-border bg-muted text-muted-foreground',
};

export function PromoCodesTab({ promoCodePreviews }: PromoCodesTabProps) {
  if (!promoCodePreviews) {
    return (
      <Card className="gap-0 py-0">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm font-medium">プロモーションコード一覧</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-6">
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-muted h-10 animate-pulse rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (promoCodePreviews.length === 0) {
    return (
      <Card className="gap-0 py-0">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm font-medium">プロモーションコード一覧</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-6">
          <p className="text-muted-foreground text-sm">
            このキャンペーンに紐づくプロモーションコードはありません。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-medium">プロモーションコード一覧</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="min-w-[160px] text-xs font-semibold">コード</TableHead>
            <TableHead className="min-w-[180px] text-xs font-semibold">説明</TableHead>
            <TableHead className="min-w-[180px] text-xs font-semibold">有効期間</TableHead>
            <TableHead className="w-[100px] text-xs font-semibold">ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodePreviews.map((promoCode) => (
            <TableRow key={promoCode.code}>
              <TableCell>
                <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                  {promoCode.code}
                </code>
              </TableCell>
              <TableCell className="text-sm">
                {promoCode.description ? (
                  promoCode.description
                ) : (
                  <span className="text-muted-foreground">&mdash;</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {promoCode.valid_from} 〜 {promoCode.valid_to}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${STATUS_CLASS_NAMES[promoCode.status]}`}
                >
                  {STATUS_LABELS[promoCode.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
