'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Permission } from '@/types/permission.type';

interface FranchiseCompanyRowActionsProps {
  companyId: string;
}

export function FranchiseCompanyRowActions({ companyId }: FranchiseCompanyRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" />}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        <RoleGatedMenuItem
          requiredPermission={Permission.FCCompaniesEdit}
          onClick={(event) => {
            event.stopPropagation();
            void companyId;
          }}
        >
          <Pencil className="size-4" />
          編集
        </RoleGatedMenuItem>
        <RoleGatedMenuItem
          requiredPermission={Permission.FCCompaniesDelete}
          className="text-destructive"
          onClick={(event) => {
            event.stopPropagation();
            void companyId;
          }}
        >
          <Trash2 className="size-4" />
          削除
        </RoleGatedMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
