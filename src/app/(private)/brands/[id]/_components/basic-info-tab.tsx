import { formatDate } from '@/utils/format.util';
import { Tag } from 'lucide-react';

import { Card } from '@/components/ui/card';

import type { GetCrmBrandsByIdResponse } from '@/lib/api/types.gen';

import { BrandStatusBadge } from './brand-status-badge';

type BrandDetail = NonNullable<GetCrmBrandsByIdResponse>['brand'];

interface BasicInfoTabProps {
  brand: BrandDetail;
}

export function BasicInfoTab({ brand }: BasicInfoTabProps) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <Card className="overflow-hidden rounded-[20px] border p-0">
        <div className="border-b px-5 py-4">
          <h2 className="text-sm font-semibold">一般情報</h2>
        </div>
        <div className="grid gap-8 px-5 py-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground mb-1 text-xs leading-none">ブランドID</p>
            <p className="font-mono text-sm leading-6 font-medium">{brand.brand_id}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs leading-none">ブランド名</p>
            <p className="text-sm leading-6 font-semibold">{brand.display_name}</p>
          </div>
        </div>
      </Card>

      <Card className="min-h-[228px] rounded-[20px] border px-5 py-4">
        <h2 className="text-sm font-semibold">ステータス</h2>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-[88px] items-center justify-center rounded-full bg-green-50 text-green-600">
            <Tag className="size-9" />
          </div>
          <BrandStatusBadge status={brand.status} />
          <div className="text-muted-foreground space-y-0.5 text-xs leading-5">
            <p>作成: {formatDate(brand.created_at)}</p>
            <p>更新: {formatDate(brand.updated_at)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
