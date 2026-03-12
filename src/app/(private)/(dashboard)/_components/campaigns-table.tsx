'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, SquareDashed } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';

interface Campaign {
  id: string;
  name: string;
  contractCount: number;
  period: string;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  totalCount: number;
}

const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>キャンペーン名</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
  },
  {
    accessorKey: 'contractCount',
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>契約数</span>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.contractCount}</span>,
  },
  {
    accessorKey: 'period',
    header: '期間',
    cell: ({ row }) => <span className="text-sm">{row.original.period}</span>,
  },
];

export function CampaignsTable({ campaigns, totalCount }: CampaignsTableProps) {
  return (
    <Card className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-4">
        <div className="flex items-baseline gap-1">
          <h3 className="text-lg font-semibold">キャンペーン</h3>
          <span className="text-sm text-gray-500">{totalCount}件</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
          すべて見る
          <SquareDashed className="h-3 w-3" />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={campaigns}
        variant="simple"
        className="rounded-none border-none"
      />
    </Card>
  );
}
