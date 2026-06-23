'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { StoreScheduleSummary } from '@/lib/api/types.gen';

function SortHeader({
  column,
  label,
}: {
  column: { getIsSorted: () => false | 'asc' | 'desc'; toggleSorting: (asc?: boolean) => void };
  label: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      className="group/sort h-auto gap-1 p-0 text-xs font-semibold hover:bg-transparent"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="size-3" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3" />
      ) : (
        <ArrowUpDown className="text-muted-foreground group-hover/sort:text-foreground size-3 transition-colors" />
      )}
    </Button>
  );
}

export const areaSummaryColumns: ColumnDef<StoreScheduleSummary>[] = [
  {
    accessorKey: 'store_name',
    header: ({ column }) => <SortHeader column={column} label="店舗名" />,
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.store_name}</span>,
  },
  {
    accessorKey: 'total_lessons',
    header: ({ column }) => <SortHeader column={column} label="本日レッスン" />,
    cell: ({ row }) => (
      <span className="text-center text-xs">{row.original.total_lessons}コマ</span>
    ),
  },
  {
    accessorKey: 'occupancy_rate',
    header: ({ column }) => <SortHeader column={column} label="平均予約率" />,
    cell: ({ row }) => {
      const rate = Math.round(row.original.occupancy_rate);
      const barColor = rate >= 80 ? 'bg-success' : rate >= 60 ? 'bg-warning' : 'bg-destructive';
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
          <span className="text-xs">{rate}%</span>
        </div>
      );
    },
  },
  {
    id: 'staff',
    header: ({ column }) => <SortHeader column={column} label="スタッフ" />,
    cell: () => <span className="text-center text-xs">—</span>,
  },
  {
    accessorKey: 'alert_count',
    header: ({ column }) => <SortHeader column={column} label="アラート" />,
    cell: ({ row }) =>
      row.original.alert_count > 0 ? (
        <Badge
          variant="secondary"
          className="bg-destructive/15 text-destructive h-auto px-1 py-0 text-[10px]"
        >
          {row.original.alert_count}件
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      ),
  },
  {
    id: 'in_progress',
    header: ({ column }) => <SortHeader column={column} label="実施中" />,
    cell: () => <span className="text-muted-foreground text-xs">—</span>,
  },
];
