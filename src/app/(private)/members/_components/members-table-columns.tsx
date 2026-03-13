'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertOctagon,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react';

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

import { Brand, MemberStatus, MemberType } from '@/types/api/member.type';

/** API sort field names */
const SORT_FIELD_MEMBER_NUMBER = 'member_number';
const SORT_FIELD_JOINED_AT = 'joined_at';
const SORT_FIELD_LAST_VISIT = 'last_visit';
const SORT_FIELD_NAME = 'name';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  onSort: (field: string, order: 'asc' | 'desc') => void;
}

function SortableHeader({ label, sortKey, sort_by, sort_order, onSort }: SortableHeaderProps) {
  const isActive = sort_by === sortKey;
  const handleClick = () => {
    if (isActive) {
      onSort(sortKey, sort_order === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(sortKey, 'asc');
    }
  };
  return (
    <div className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      {isActive ? (
        sort_order === 'asc' ? (
          <ArrowUp className="text-muted-foreground size-4 cursor-pointer" onClick={handleClick} />
        ) : (
          <ArrowDown
            className="text-muted-foreground size-4 cursor-pointer"
            onClick={handleClick}
          />
        )
      ) : (
        <ArrowUpDown
          className="text-muted-foreground size-4 cursor-pointer opacity-50"
          onClick={handleClick}
        />
      )}
    </div>
  );
}

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
  /** Navigate to member detail with コミュニケーション tab and memo modal open */
  onMemoClick: (memberId: string) => void;
  selectedMembers: string[];
  onSelectionChange: (ids: string[]) => void;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

export function MembersTableColumns({
  onMemberClick,
  onMemoClick,
  selectedMembers,
  onSelectionChange,
  sort_by,
  sort_order,
  onSortChange,
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
      header: () => (
        <SortableHeader
          label="会員番号"
          sortKey={SORT_FIELD_MEMBER_NUMBER}
          sort_by={sort_by}
          sort_order={sort_order}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <button
          onClick={() => row.original.id && onMemberClick(row.original.id)}
          className="text-left text-blue-600 hover:underline"
        >
          {row.original.member_number || '-'}
        </button>
      ),
      meta: {
        label: '会員番号',
      },
    },
    {
      accessorKey: 'name_kanji',
      header: () => (
        <SortableHeader
          label="氏名"
          sortKey={SORT_FIELD_NAME}
          sort_by={sort_by}
          sort_order={sort_order}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.has_unpaid && <AlertOctagon className="text-destructive size-4" />}
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
          {row.original.status ? STATUS_LABELS[row.original.status as MemberStatus] : '-'}
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
      header: () => (
        <SortableHeader
          label="入会日"
          sortKey={SORT_FIELD_JOINED_AT}
          sort_by={sort_by}
          sort_order={sort_order}
          onSort={onSortChange}
        />
      ),
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
      header: () => (
        <SortableHeader
          label="最終来館日"
          sortKey={SORT_FIELD_LAST_VISIT}
          sort_by={sort_by}
          sort_order={sort_order}
          onSort={onSortChange}
        />
      ),
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
