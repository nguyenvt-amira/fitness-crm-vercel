'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { AlertOctagon, Edit, MessageSquare, MoreHorizontal } from 'lucide-react';

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

const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  [MemberType.REGULAR]: '通常',
  [MemberType.FAMILY]: '家族',
  [MemberType.CORPORATE]: '法人',
  [MemberType.COMPANY_DISCOUNT]: '社割',
};

const STATUS_LABELS: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: '利用中',
  [MemberStatus.SUSPENDED]: '休会中',
  [MemberStatus.WITHDRAWN]: '退会済み',
  [MemberStatus.FORCE_WITHDRAWN]: '強制退会済み',
};

const STATUS_VARIANTS: Record<MemberStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [MemberStatus.ACTIVE]: 'default',
  [MemberStatus.SUSPENDED]: 'secondary',
  [MemberStatus.WITHDRAWN]: 'outline',
  [MemberStatus.FORCE_WITHDRAWN]: 'destructive',
};

interface MembersTableColumnsProps {
  onMemberClick: (memberId: string) => void;
  selectedMembers: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function MembersTableColumns({
  onMemberClick,
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
    },
    {
      accessorKey: 'memberNumber',
      header: '会員番号',
      cell: ({ row }) => (
        <button
          onClick={() => row.original.id && onMemberClick(row.original.id)}
          className="text-left text-blue-600 hover:underline"
        >
          {row.original.memberNumber || '-'}
        </button>
      ),
    },
    {
      accessorKey: 'nameKanji',
      header: '氏名',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.hasUnpaid && <AlertOctagon className="text-destructive size-4" />}
          <span>{row.original.nameKanji || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'memberType',
      header: '会員種別',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {/* TODO: Add member type icon */}
          <span>
            {row.original.memberType
              ? MEMBER_TYPE_LABELS[row.original.memberType as MemberType]
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
          {row.original.status ? STATUS_LABELS[row.original.status as MemberStatus] : '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'storeName',
      header: '所属店舗',
      cell: ({ row }) => row.original.storeName || '-',
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
      accessorKey: 'contractPlanName',
      header: '主契約プラン',
      cell: ({ row }) => row.original.contractPlanName || '-',
    },
    {
      accessorKey: 'joinedAt',
      header: '入会日',
      cell: ({ row }) => {
        if (!row.original.joinedAt) return '-';
        const date = new Date(row.original.joinedAt);
        return date.toLocaleDateString('ja-JP');
      },
    },
    {
      accessorKey: 'lastVisitDate',
      header: '最終来館日',
      cell: ({ row }) => {
        if (!row.original.lastVisitDate) return '-';
        const date = new Date(row.original.lastVisitDate);
        return date.toLocaleDateString('ja-JP');
      },
    },
    {
      id: 'unpaid',
      header: '未納',
      cell: ({ row }) =>
        row.original.hasUnpaid ? (
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onMemberClick(memberId)}>詳細</DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                編集
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 size-4" />
                メモ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
