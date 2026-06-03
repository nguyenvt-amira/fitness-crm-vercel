'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Store, Trash2 } from 'lucide-react';

import { BrandBadge } from '@/components/common/brand-badge';
import { DataTableColumnHeader } from '@/components/common/data-table/data-table-column-header';
import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { GetCrmOptionsResponse } from '@/lib/api/types.gen';
import { cn } from '@/lib/utils';

import { Permission } from '@/types/permission.type';

import {
  OPTION_STATUS_BADGE_CLASSES,
  OPTION_STATUS_LABELS,
  OPTION_TYPE_BADGE_CLASSES,
  OPTION_TYPE_LABELS,
  OPTION_USAGE_RULE_LABELS,
} from '../_constants/constants';

type OptionRow = GetCrmOptionsResponse['options'][number];

interface OptionsTableColumnsProps {
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

function ActionsCell({
  optionId,
  onEditClick,
  onDeleteClick,
}: {
  optionId: string;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" />}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <RoleGatedMenuItem
          requiredPermission={Permission.StoresEdit}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.(optionId);
          }}
        >
          <Pencil className="size-4" />
          編集
        </RoleGatedMenuItem>
        <DropdownMenuSeparator />
        <RoleGatedMenuItem
          requiredPermission={Permission.StoresEdit}
          className="text-destructive focus:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick?.(optionId);
          }}
        >
          <Trash2 className="size-4" />
          削除
        </RoleGatedMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OptionsTableColumns({
  onEditClick,
  onDeleteClick,
}: OptionsTableColumnsProps): ColumnDef<OptionRow>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">{row.original.id}</span>
      ),
      size: 80,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="オプション名" />,
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.name}</span>,
      minSize: 180,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="コード" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">{row.original.code}</span>
      ),
      size: 100,
    },
    {
      accessorKey: 'brand',
      header: () => <span className="text-xs font-semibold">ブランド</span>,
      cell: ({ row }) => <BrandBadge brand={row.original.brand} />,
      size: 110,
    },
    {
      accessorKey: 'prorated_enabled',
      header: () => <span className="text-xs font-semibold">日割り</span>,
      cell: ({ row }) => {
        const { prorated_enabled, prorata_method } = row.original;
        if (!prorated_enabled) {
          return <span className="text-muted-foreground text-xs">－</span>;
        }
        const label = prorata_method === 'daily' ? '日割り計算' : '固定金額';
        return <span className="text-success text-xs">✓ {label}</span>;
      },
      size: 120,
    },
    {
      accessorKey: 'option_type',
      header: () => <span className="text-xs font-semibold">種別</span>,
      cell: ({ row }) => {
        const type = row.original.option_type;
        return (
          <Badge variant="outline" className={cn('text-[10px]', OPTION_TYPE_BADGE_CLASSES[type])}>
            {OPTION_TYPE_LABELS[type]}
          </Badge>
        );
      },
      size: 90,
    },
    {
      accessorKey: 'usage_rule',
      header: () => <span className="text-xs font-semibold">利用可否</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {OPTION_USAGE_RULE_LABELS[row.original.usage_rule]}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: 'price_including_tax',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="料金(税込)" className="justify-end" />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-medium">
          ¥{row.original.price_including_tax.toLocaleString()}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: 'tax_rate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="税率" className="justify-end" />
      ),
      cell: ({ row }) => <span className="text-xs">{row.original.tax_rate}%</span>,
      size: 60,
    },
    {
      accessorKey: 'member_count',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="利用会員数" className="justify-end" />
      ),
      cell: ({ row }) => (
        <span className="text-xs">{row.original.member_count.toLocaleString()}名</span>
      ),
      size: 100,
    },
    {
      accessorKey: 'accounting_code',
      header: () => <span className="text-xs font-semibold">会計コード</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.original.accounting_code}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: 'store_name',
      header: () => <span className="text-xs font-semibold">店舗</span>,
      cell: ({ row }) => {
        const name = row.original.store_name;
        return (
          <div className="flex items-center gap-1">
            <Store className="text-muted-foreground size-3" />
            <span className="text-xs">{name ?? '全店舗'}</span>
          </div>
        );
      },
      size: 130,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="状態" />,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={cn('text-[10px]', OPTION_STATUS_BADGE_CLASSES[status])}
          >
            {OPTION_STATUS_LABELS[status]}
          </Badge>
        );
      },
      size: 80,
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => (
        <ActionsCell
          optionId={row.original.id}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ),
      size: 40,
    },
  ];
}
