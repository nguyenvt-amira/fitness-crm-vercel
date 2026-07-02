import type { StudioDetail } from '@/app/api/_schemas/studio-detail.schema';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudioBasicInfoCardProps {
  studio: StudioDetail;
}

/**
 * Studio basic information card.
 * Displays core studio metadata including capacity, hours, location, and contact info.
 */
export function StudioBasicInfoCard({ studio }: StudioBasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">基本情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Studio ID */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">スタジオID</p>
            <p className="text-base font-semibold">{studio.id}</p>
          </div>

          {/* Studio Name */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">スタジオ名</p>
            <p className="text-base font-semibold">{studio.name}</p>
          </div>

          {/* Studio Type */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">スタジオ区分</p>
            <p className="text-base font-semibold">
              {studio.studio_type === 'studio-lesson' && 'スタジオレッスン'}
              {studio.studio_type === 'pt' && 'パーソナルトレーニング'}
              {studio.studio_type === 'body-care' && 'ボディケア'}
            </p>
          </div>

          {/* Capacity */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">定員</p>
            <p className="text-base font-semibold">{studio.capacity}名</p>
          </div>

          {/* Buffer Value */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">バッファ値</p>
            <p className="text-base font-semibold">{studio.buffer_value}</p>
          </div>

          {/* Usage Hours */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">営業時間</p>
            <p className="text-base font-semibold">{studio.usage_hours}</p>
          </div>

          {/* Store */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">店舗</p>
            <p className="text-base font-semibold">{studio.store_name}</p>
          </div>

          {/* Created Date */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">作成日</p>
            <p className="text-sm">
              {format(new Date(studio.created_at), 'yyyy年M月d日 HH:mm', {
                locale: ja,
              })}
            </p>
          </div>

          {/* Updated Date */}
          <div>
            <p className="text-muted-foreground text-sm font-medium">更新日</p>
            <p className="text-sm">
              {format(new Date(studio.updated_at), 'yyyy年M月d日 HH:mm', {
                locale: ja,
              })}
            </p>
          </div>
        </div>

        {/* Equipment Notes */}
        {studio.equipment_notes && (
          <div className="border-t pt-4">
            <p className="text-muted-foreground text-sm font-medium">設備備考</p>
            <p className="mt-2 text-sm whitespace-pre-wrap">{studio.equipment_notes}</p>
          </div>
        )}

        {/* Internal Notes */}
        {studio.internal_notes && (
          <div className="border-t pt-4">
            <p className="text-muted-foreground text-sm font-medium">内部メモ</p>
            <p className="mt-2 text-sm whitespace-pre-wrap">{studio.internal_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
