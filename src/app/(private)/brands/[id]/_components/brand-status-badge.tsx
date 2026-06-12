import { Badge } from '@/components/ui/badge';

interface BrandStatusBadgeProps {
  status: 'active' | 'inactive';
}

const BRAND_STATUS_LABELS: Record<BrandStatusBadgeProps['status'], string> = {
  active: '有効',
  inactive: '無効',
};

const BRAND_STATUS_CLASSES: Record<BrandStatusBadgeProps['status'], string> = {
  active: 'border-green-200 bg-green-100 text-green-700',
  inactive: 'border-amber-200 bg-amber-100 text-amber-700',
};

export function BrandStatusBadge({ status }: BrandStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`h-5 gap-1 rounded-full px-2 py-0 text-[10px] font-semibold ${BRAND_STATUS_CLASSES[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {BRAND_STATUS_LABELS[status]}
    </Badge>
  );
}
