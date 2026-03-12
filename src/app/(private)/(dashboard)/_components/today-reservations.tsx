'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, SquareDashed } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';

interface Reservation {
  id: string;
  lessonName: string;
  dateTime: string;
  space: string;
  trainer: {
    name: string;
    initials: string;
  };
  bookedCount: number;
  capacity: number;
}

interface TodayReservationsProps {
  reservations: Reservation[];
  totalCount: number;
}

const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: 'lessonName',
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>レッスン名</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.lessonName}</span>,
  },
  {
    accessorKey: 'dateTime',
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>日時</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.dateTime}</span>,
  },
  {
    accessorKey: 'space',
    header: 'スペース',
    cell: ({ row }) => <span className="text-sm">{row.original.space}</span>,
  },
  {
    accessorKey: 'trainer',
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>トレーナー</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const trainer = row.original.trainer;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-100 text-xs font-semibold">
              {trainer.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{trainer.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'bookedCount',
    header: '予約人数',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.bookedCount}/{row.original.capacity}
      </span>
    ),
  },
];

export function TodayReservations({ reservations, totalCount }: TodayReservationsProps) {
  return (
    <Card className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-4">
        <div className="flex items-baseline gap-1">
          <h3 className="text-lg font-semibold">本日の予約</h3>
          <span className="text-sm text-gray-500">{totalCount}件</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
          すべて見る
          <SquareDashed className="h-3 w-3" />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={reservations}
        variant="simple"
        className="rounded-none border-none"
      />
    </Card>
  );
}
