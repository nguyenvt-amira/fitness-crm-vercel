'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { UserRole } from '@/types/permission.type';

type CampaignRowActionsProps = {
  className?: string;
};

export function CampaignRowActions({ className }: Readonly<CampaignRowActionsProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={className ?? 'hover:bg-muted flex size-8 items-center justify-center rounded-md'}
        aria-label="campaign row actions"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <RoleGatedMenuItem
          allowedRoles={[UserRole.Headquarter, UserRole.System]}
          onClick={() => {}}
        >
          <Pencil className="size-4" />
          編集
        </RoleGatedMenuItem>
        <DropdownMenuSeparator />
        <RoleGatedMenuItem
          allowedRoles={[UserRole.Headquarter, UserRole.System]}
          className="text-destructive"
          onClick={() => {}}
        >
          <Trash2 className="size-4" />
          削除
        </RoleGatedMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
