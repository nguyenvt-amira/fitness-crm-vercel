/**
 * - `PAGE_ROLES`: maps each route pattern to the roles that can access it.
 *   Omitting a route means ALL authenticated roles can access it.
 *
 * - `ROLE_PERMISSIONS`: fine-grained action permissions used by RoleGatedButton / RoleGatedMenuItem
 *   to gate individual UI actions (Create, Edit, Delete, Approve, Invite …).
 *   View permissions are intentionally omitted — page visibility is already governed by PAGE_ROLES.
 */
import type { RoutePattern } from '@/lib/routes/routes.type';

import { Permission, UserRole } from '@/types/permission.type';

// ---------------------------------------------------------------------------
// Page-level access (route pattern → allowed roles)
// ---------------------------------------------------------------------------
export const PAGE_ROLES: Partial<Record<RoutePattern, readonly UserRole[]>> = {
  // Staffs
  '/staffs': [UserRole.System, UserRole.Headquarter, UserRole.Manager, UserRole.Staff],
  '/staffs/:id': [UserRole.System, UserRole.Headquarter, UserRole.Manager, UserRole.Staff],
  '/staffs/:id/edit': [UserRole.System, UserRole.Headquarter, UserRole.Staff],

  // Stores
  '/stores': [UserRole.System, UserRole.Headquarter, UserRole.Manager, UserRole.Staff],
  '/stores/:id': [UserRole.System, UserRole.Headquarter, UserRole.Manager, UserRole.Staff],
  '/stores/:id/edit': [UserRole.System, UserRole.Headquarter],
  '/stores/create': [UserRole.System, UserRole.Headquarter],

  // Positions
  '/positions': [UserRole.System, UserRole.Headquarter],

  // Members
  '/members': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/members/:id': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/members/:id/edit': [UserRole.System, UserRole.Headquarter, UserRole.Manager, UserRole.Staff],
  '/members/create': [UserRole.System, UserRole.Headquarter, UserRole.Manager, UserRole.Staff],
  '/members/blacklist': [UserRole.System, UserRole.Headquarter],
  '/members/blacklist/:id': [UserRole.System, UserRole.Headquarter],
  '/members/leaves': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/members/leaves/:id': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/members/transfers': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/members/transfers/:id': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],

  // Membership applications
  '/membership-applications': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/membership-applications/:id': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/membership-applications/create': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
  ],

  // Family registrations
  '/family-registrations': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/family-registrations/:id': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
  '/family-registrations/dashboard': [
    UserRole.System,
    UserRole.Headquarter,
    UserRole.Manager,
    UserRole.Staff,
    UserRole.Observer,
  ],
};

// ---------------------------------------------------------------------------
// Role → default Permission set
// ---------------------------------------------------------------------------
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.System]: Object.values(Permission),

  [UserRole.Headquarter]: [
    Permission.MembersCreate,
    Permission.MembersEdit,
    Permission.MembersDelete,
    Permission.MembersPersonalDataEdit,
    Permission.MembersPersonalDataDelete,
    Permission.MembersReEnroll,
    Permission.MembersSuspend,
    Permission.MembersWithdraw,
    Permission.MembersTransfer,
    Permission.MembersGateStop,
    Permission.MembersForceWithdraw,
    Permission.MembershipApplicationsCreate,
    Permission.MembershipApplicationsApprove,
    Permission.StaffsCreate,
    Permission.StaffsEdit,
    Permission.StaffsDelete,
    Permission.StaffsInvite,
    Permission.StoresCreate,
    Permission.StoresEdit,
    Permission.StoresDelete,
    Permission.StoresConfigContract,
    Permission.StoresConfigAccess,
    Permission.StoresConfigBusiness,
    Permission.PositionsCreate,
    Permission.PositionsEdit,
    Permission.PositionsDelete,
    Permission.FamilyRegistrationsApprove,
    Permission.TransfersApprove,
    Permission.LeavesApprove,
    Permission.BlacklistCreate,
    Permission.BlacklistDelete,
    Permission.ContractsEdit,
    Permission.ContractsDelete,
    Permission.ContractsCreate,
  ],

  [UserRole.Manager]: [
    Permission.MembersCreate,
    Permission.MembersEdit,
    Permission.MembersReEnroll,
    Permission.MembersSuspend,
    Permission.MembersWithdraw,
    Permission.MembersTransfer,
    Permission.MembersGateStop,
    Permission.MembershipApplicationsCreate,
  ],

  [UserRole.Staff]: [
    Permission.MembersCreate,
    Permission.MembersEdit,
    Permission.MembersReEnroll,
    Permission.MembersSuspend,
    Permission.MembersWithdraw,
    Permission.MembersTransfer,
    Permission.MembersGateStop,
    Permission.MembershipApplicationsCreate,
    Permission.StoresCreate,
    Permission.StoresEdit,
    Permission.StoresConfigBusiness,
  ],

  [UserRole.Trainer]: [],

  [UserRole.Observer]: [],
};

// ---------------------------------------------------------------------------
// Helper: check if a role can access a given route pattern
// ---------------------------------------------------------------------------
export function canRoleAccessPage(role: UserRole, pattern: RoutePattern): boolean {
  const allowed = PAGE_ROLES[pattern];
  if (!allowed) return true; // not restricted → any authenticated role can access
  return (allowed as readonly UserRole[]).includes(role);
}
