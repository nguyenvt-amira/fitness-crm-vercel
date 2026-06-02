'use client';

/**
 * RoleGatedButton
 *
 * Renders a Button that is automatically disabled + wrapped in a Tooltip
 * when the current user lacks the required role or permission.
 *
 * Usage — role-based:
 * ```tsx
 * <RoleGatedButton allowedRoles={[UserRole.System, UserRole.Headquarter]} onClick={...}>
 *   <Plus className="size-4" /> 新規登録
 * </RoleGatedButton>
 * ```
 *
 * Usage — permission-based:
 * ```tsx
 * <RoleGatedButton requiredPermission={Permission.StaffsInvite} onClick={...}>
 *   招待
 * </RoleGatedButton>
 * ```
 *
 * Logic:
 * - allowedRoles only  → user's role must be in the list
 * - requiredPermission only → user must hold the permission
 * - both specified    → AND (role AND permission must pass)
 * - neither specified → always allowed
 *
 * When denied:
 * - Button is disabled + aria-disabled
 * - Wrapped in a Tooltip showing `denyTooltip`
 */
import { type ComponentProps, type ReactNode } from 'react';

import { useAuthUser } from '@/contexts/auth-user.context';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

import { Permission, UserRole } from '@/types/permission.type';

interface RoleGatedButtonProps extends ComponentProps<typeof Button> {
  /** Roles that are permitted to use this action */
  allowedRoles?: readonly UserRole[];
  /** Fine-grained permission required (on top of, or instead of, role check) */
  requiredPermission?: Permission;
  /** Tooltip shown when the user is not allowed (default: '権限がありません') */
  denyTooltip?: string;
  children: ReactNode;
}

export function RoleGatedButton({
  allowedRoles,
  requiredPermission,
  denyTooltip = '権限がありません',
  children,
  className,
  disabled: externalDisabled,
  onClick,
  ...props
}: RoleGatedButtonProps) {
  const { hasRole, hasPermission } = useAuthUser();

  const roleAllowed = allowedRoles ? hasRole(allowedRoles) : true;
  const permissionAllowed = requiredPermission ? hasPermission(requiredPermission) : true;
  const allowed = roleAllowed && permissionAllowed;

  if (allowed) {
    return (
      <Button className={className} onClick={onClick} disabled={externalDisabled} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        {/* span wrapper is required because a disabled button swallows pointer events */}
        <TooltipTrigger render={<span className="inline-flex cursor-not-allowed" />}>
          <Button
            {...props}
            disabled
            aria-disabled="true"
            className={cn('pointer-events-none opacity-50', className)}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{denyTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
