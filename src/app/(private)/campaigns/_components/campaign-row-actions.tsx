'use client';

import { useRouter } from 'next/navigation';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { navigate } from '@/lib/routes/routes.util';

import { UserRole } from '@/types/permission.type';

type CampaignRowActionsProps = {
  campaignId: string;
  className?: string;
};

export function CampaignRowActions({ campaignId, className }: Readonly<CampaignRowActionsProps>) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(navigate('/campaigns/[id]', campaignId));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={className ?? 'hover:bg-muted flex size-8 items-center justify-center rounded-md'}
        aria-label="campaign row actions"
        onClick={(event) => event.stopPropagation()}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        <RoleGatedMenuItem
          allowedRoles={[UserRole.Headquarter, UserRole.System]}
          onClick={(event) => {
            event.stopPropagation();
            handleEdit();
          }}
        >
          <Pencil className="size-4" />
          編集
        </RoleGatedMenuItem>
        <DropdownMenuSeparator />
        <RoleGatedMenuItem
          allowedRoles={[UserRole.Headquarter, UserRole.System]}
          className="text-destructive"
          disabled
          tooltip="削除はこの画面では未対応です"
          onClick={(event) => event.stopPropagation()}
        >
          <Trash2 className="size-4" />
          削除
        </RoleGatedMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
