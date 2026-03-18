import { ButtonProps } from '@base-ui/react';
import type { Column, Row } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, MoveDown, MoveUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';

interface DataTableColumnCheckboxProps<TData, TValue> extends ButtonProps {
  row: Row<TData>;
  title?: string;
}

export function DataTableColumnCheckbox<TData, TValue>({
  row,
  className,
}: DataTableColumnCheckboxProps<TData, TValue>) {
  return (
    <div className={cn('w-[32px] px-2', className)}>
      <Checkbox
        checked={row.getIsSelected()}
        aria-label="select row"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="translate-y-[2px]"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
