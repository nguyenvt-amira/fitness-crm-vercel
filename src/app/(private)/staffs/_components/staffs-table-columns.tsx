'use client';

import { useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/common/data-table/data-table-column-header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { GetCrmStaffsResponse } from '@/lib/api/types.gen';

import {
  STAFF_BRAND_LABELS,
  STAFF_ROLE_LABELS,
  STAFF_STATUS_LABELS,
  type StaffBrand,
  type StaffRole,
  StaffStatus,
} from '../_constants/constants';

type Staff = GetCrmStaffsResponse['staffs'][number];

interface StaffsTableColumnsProps {
  onEditClick?: (staffId: string) => void;
  onDeleteClick?: (staffId: string) => void;
}

function ActionsCell({
  staffId,
  onEditClick,
  onDeleteClick,
}: {
  staffId: string;
  onEditClick?: (staffId: string) => void;
  onDeleteClick?: (staffId: string) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
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
              onEditClick?.(staffId);
            }}
          >
            <Pencil className="size-4" />
            編集
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="text-destructive size-4" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>スタッフを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              このスタッフアカウントを削除すると、ログインできなくなります。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDeleteClick?.(staffId);
              }}
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function StaffsTableColumns({
  onEditClick,
  onDeleteClick,
}: StaffsTableColumnsProps): ColumnDef<Staff>[] {
  return [
    {
      accessorKey: 'staff_id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="管理者ID" />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.staff_id}</span>,
      meta: {
        label: '管理者ID',
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="管理者名" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      meta: {
        label: '管理者名',
      },
    },
    {
      accessorKey: 'email',
      header: 'メールアドレス',
      cell: ({ row }) => <span className="">{row.original.email}</span>,
      meta: {
        label: 'メールアドレス',
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="権限" />,
      cell: ({ row }) => (
        <span className="">
          <Badge variant="secondary">
            {STAFF_ROLE_LABELS[row.original.role as StaffRole] || '-'}
          </Badge>
        </span>
      ),
      meta: {
        label: '権限',
      },
    },
    {
      accessorKey: 'brand',
      header: 'ブランド',
      cell: ({ row }) => (
        <span className="">{STAFF_BRAND_LABELS[row.original.brand as StaffBrand] || '-'}</span>
      ),
      meta: {
        label: 'ブランド',
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ステータス" />,
      cell: ({ row }) => {
        const status = row.original.status as StaffStatus;
        if (status === StaffStatus.ACTIVE) {
          return (
            <Badge className="border border-green-700/20 bg-green-50 text-green-700">
              {STAFF_STATUS_LABELS[status]}
            </Badge>
          );
        }
        return <span className="text-muted-foreground">{STAFF_STATUS_LABELS[status] || '-'}</span>;
      },
      meta: {
        label: 'ステータス',
      },
    },
    {
      accessorKey: 'last_login',
      header: ({ column }) => <DataTableColumnHeader column={column} title="最終ログイン" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.last_login || '-'}</span>
      ),
      meta: {
        label: '最終ログイン',
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ActionsCell
          staffId={row.original.id}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ),
      enableHiding: false,
      enableSorting: false,
    },
  ];
}
