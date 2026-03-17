'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, SquareDashed } from 'lucide-react';

import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Notification {
  id: string;
  title: string;
  date: string;
}

interface NotificationsTableProps {
  notifications: Notification[];
  totalCount: number;
}

const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>XXXX</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.title}</span>,
  },
  {
    accessorKey: 'date',
    header: 'XXXX',
    cell: ({ row }) => <span className="text-sm">{row.original.date}</span>,
  },
];

export function NotificationsTable({ notifications, totalCount }: NotificationsTableProps) {
  return (
    <Card className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-4">
        <div className="flex items-baseline gap-1">
          <h3 className="text-lg font-semibold">通知・告知予約</h3>
          <span className="text-sm text-gray-500">{totalCount}件</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
          すべて見る
          <SquareDashed className="h-3 w-3" />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={notifications}
        variant="simple"
        className="rounded-none border-none"
      />
    </Card>
  );
}
