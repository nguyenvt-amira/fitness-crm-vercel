import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface HistoryRecord {
  id: string;
  name: string;
  kana: string;
  avatar: string;
  date: string; // Format: "11/30"
  entry_time: string; // Format: "18:05"
  exit_time: string; // Format: "19:32"
  member_type: 'FC会員' | '正会員';
  gender: '男性' | '女性';
  store: string;
  entryStore: string;
}

export function HistoriesTableColumns(): ColumnDef<HistoryRecord>[] {
  return [
    {
      accessorKey: 'name',
      header: '利用者',
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={record.avatar} alt={record.name} />
            </Avatar>
            <div>
              <p className="text-xs font-medium">{record.name}</p>
              <p className="text-[10px] text-gray-600">{record.kana}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: '日時',
      cell: ({ row }) => {
        return <span className="text-xs">{row.original.date}</span>;
      },
    },
    {
      accessorKey: 'entry_time',
      header: () => (
        <div className="flex items-center gap-1">
          <span>入館時刻</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: ({ row }) => {
        return <span className="text-xs">{row.original.entry_time}</span>;
      },
    },
    {
      accessorKey: 'exit_time',
      header: () => (
        <div className="flex items-center gap-1">
          <span>退館時刻</span>
          <ArrowUpDown className="h-3 w-3" />
        </div>
      ),
      cell: ({ row }) => {
        return <span className="text-xs">{row.original.exit_time}</span>;
      },
    },
    {
      accessorKey: 'member_type',
      header: '会員種別',
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="bg-gray-50 text-[10px] font-normal text-gray-800">
            {row.original.member_type}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'gender',
      header: '性別',
      cell: ({ row }) => {
        return <span className="text-xs">{row.original.gender}</span>;
      },
    },
    {
      accessorKey: 'store',
      header: '所属店舗',
      cell: ({ row }) => {
        return <span className="text-xs">{row.original.store}</span>;
      },
    },
    {
      accessorKey: 'entryStore',
      header: '入館店舗',
      cell: ({ row }) => {
        return <span className="text-xs">{row.original.entryStore}</span>;
      },
    },
  ];
}
