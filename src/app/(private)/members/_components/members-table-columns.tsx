'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { AlertOctagon, Edit, MessageSquare, MoreHorizontal } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/common/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { GetCrmMembersResponse } from '@/lib/api/types.gen';

import { Brand, MemberStatus, MemberType } from '@/types/member.type';

import { STATUS_VARIANTS } from '../_lib/constants';
import { MEMBER_STATUS_LABELS, MEMBER_TYPE_LABELS } from '../_lib/constants';

interface MembersTableColumnsProps {
  onMemberClick: (memberId: string) => void;
  /** Navigate to member detail with コミュニケーション tab and memo modal open */
  onMemoClick: (memberId: string) => void;
  selectedMembers: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function MembersTableColumns({
  onMemberClick,
  onMemoClick,
  selectedMembers,
  onSelectionChange,
}: MembersTableColumnsProps): ColumnDef<NonNullable<GetCrmMembersResponse['members']>[0]>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(checked === true);
            if (checked === true) {
              onSelectionChange(
                table
                  .getRowModel()
                  .rows.map((row) => row.original.id || '')
                  .filter(Boolean),
              );
            } else {
              onSelectionChange([]);
            }
          }}
        />
      ),
      cell: ({ row }) => {
        const memberId = row.original.id || '';
        if (!memberId) return null;
        return (
          <Checkbox
            checked={selectedMembers.includes(memberId)}
            onCheckedChange={(checked) => {
              if (checked === true) {
                onSelectionChange([...selectedMembers, memberId]);
              } else {
                onSelectionChange(selectedMembers.filter((id) => id !== memberId));
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'member_number',
      header: ({ column }) => <DataTableColumnHeader column={column} title="会員番号" />,
      cell: ({ row }) => row.original.member_number || '-',
      meta: {
        label: '会員番号',
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="氏名" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.name_kanji || '-'}</span>
        </div>
      ),
      meta: {
        label: '氏名',
      },
    },
    {
      accessorKey: 'member_type',
      header: '会員種別',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {/* TODO: Add member type icon */}
          <span>
            {row.original.member_type
              ? MEMBER_TYPE_LABELS[row.original.member_type as MemberType]
              : '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'ステータス',
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANTS[row.original.status as MemberStatus]}>
          {row.original.status ? MEMBER_STATUS_LABELS[row.original.status as MemberStatus] : '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'store_name',
      header: '所属店舗',
      cell: ({ row }) => row.original.store_name || '-',
    },
    {
      accessorKey: 'brand',
      header: 'ブランド',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {/* TODO: Add brand icon */}
          <span>
            {row.original.brand === Brand.FIT365
              ? 'FIT365'
              : row.original.brand === Brand.JOYFIT
                ? 'JOYFIT'
                : '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'contract_plan_name',
      header: '主契約プラン',
      cell: ({ row }) => row.original.contract_plan_name || '-',
    },
    {
      accessorKey: 'joined_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="入会日" />,
      cell: ({ row }) => {
        if (!row.original.joined_at) return '-';
        const date = new Date(row.original.joined_at);
        return date.toLocaleDateString('ja-JP');
      },
      meta: {
        label: '入会日',
      },
    },
    {
      accessorKey: 'last_visit_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="最終来館日" />,
      cell: ({ row }) => {
        if (!row.original.last_visit_date) return '-';
        const date = new Date(row.original.last_visit_date);
        return date.toLocaleDateString('ja-JP');
      },
      meta: {
        label: '最終来館日',
      },
    },
    {
      id: 'unpaid',
      header: '未納',
      cell: ({ row }) =>
        row.original.has_unpaid ? (
          <AlertOctagon className="text-destructive size-4" />
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const memberId = row.original.id || '';
        if (!memberId) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onMemberClick(memberId);
                }}
              >
                詳細
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Edit className="mr-2 size-4" />
                編集
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onMemoClick?.(memberId);
                }}
              >
                <MessageSquare className="mr-2 size-4" />
                メモ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
    },
  ];
}
