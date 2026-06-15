/**
 * - `PAGE_PERMISSIONS`: maps each route pattern to the Permission required to view it.
 *   Omitting a route means ALL authenticated roles can access it.
 *
 * - `ROLE_PERMISSIONS`: the full set of Permission values granted to each role.
 *   Includes both page-view permissions (used for routing) and action permissions
 *   (used by RoleGatedButton / RoleGatedMenuItem).
 */
import type { RoutePattern } from '@/lib/routes/routes.type';

import { Permission, UserRole } from '@/types/permission.type';

// ---------------------------------------------------------------------------
// Page-level access (route pattern → required Permission)
// ---------------------------------------------------------------------------
export const PAGE_PERMISSIONS: Partial<Record<RoutePattern, Permission>> = {
  // Staffs
  '/staffs': Permission.StaffsView,
  '/staffs/:id': Permission.StaffsView,
  '/staffs/:id/edit': Permission.StaffsEdit,

  // Stores
  '/stores': Permission.StoresView,
  '/stores/:id': Permission.StoresView,
  '/stores/:id/edit': Permission.StoresEdit,
  '/stores/create': Permission.StoresCreate,

  // Positions
  '/positions': Permission.PositionsView,

  // Members
  '/members': Permission.MembersView,
  '/members/:id': Permission.MembersView,
  '/members/:id/edit': Permission.MembersEdit,
  '/members/create': Permission.MembersCreate,
  '/members/blacklist': Permission.MembersBlacklistView,
  '/members/blacklist/:id': Permission.MembersBlacklistView,
  '/members/leaves': Permission.MembersLeavesView,
  '/members/leaves/:id': Permission.MembersLeavesView,
  '/members/transfers': Permission.MembersTransfersView,
  '/members/transfers/:id': Permission.MembersTransfersView,

  // Membership applications
  '/membership-applications': Permission.MembershipApplicationsView,
  '/membership-applications/:id': Permission.MembershipApplicationsView,
  '/membership-applications/create': Permission.MembershipApplicationsCreate,

  // Family registrations
  '/family-registrations': Permission.FamilyRegistrationsView,
  '/family-registrations/:id': Permission.FamilyRegistrationsView,
  '/family-registrations/dashboard': Permission.FamilyRegistrationsDashboardView,

  // Contracts
  '/contracts': Permission.ContractsView,
  '/contracts/:id': Permission.ContractsView,
  '/contracts/create': Permission.ContractsCreate,
  '/contracts/:id/edit': Permission.ContractsEdit,

  // Campaigns
  '/campaigns': Permission.CampaignsView,
  '/campaigns/:id': Permission.CampaignsView,
  '/campaigns/create': Permission.CampaignsCreate,
  '/campaigns/:id/edit': Permission.CampaignsEdit,

  // Options
  '/options': Permission.OptionsView,
  '/options/:id': Permission.OptionsView,
  '/options/create': Permission.OptionsCreate,
  '/options/:id/edit': Permission.OptionsEdit,

  // Surveys
  '/surveys': Permission.SurveysView,
  '/surveys/:id': Permission.SurveysView,
  '/surveys/create': Permission.SurveysCreate,
  '/surveys/:id/edit': Permission.SurveysEdit,
  '/surveys/responses': Permission.SurveysView,
  '/surveys/responses/:responseId': Permission.SurveysView,
  '/surveys/analytics': Permission.SurveysView,

  // Option discounts
  '/option-discount': Permission.OptionDiscountsView,
  '/option-discount/:id': Permission.OptionDiscountsView,
  '/option-discount/create': Permission.OptionDiscountsCreate,
  '/option-discount/:id/edit': Permission.OptionDiscountsEdit,

  // Brands
  '/brands': Permission.BrandsView,
  '/brands/:id': Permission.BrandsView,

  // Lockers
  '/lockers': Permission.LockersView,
  '/lockers/:id': Permission.LockersView,
  '/lockers/create': Permission.LockersCreate,
  '/lockers/:id/edit': Permission.LockersEdit,
  '/lockers/contracts': Permission.LockersContractsView,
  '/lockers/contracts/:id': Permission.LockersContractsView,
  '/lockers/contracts/create': Permission.LockersContractsCreate,
  '/lockers/contracts/:id/edit': Permission.LockersContractsEdit,
  '/lockers/pending': Permission.LockersPendingView,
};

// ---------------------------------------------------------------------------
// Role → full Permission set  (view + action)
// ---------------------------------------------------------------------------
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  [UserRole.System]: Object.values(Permission),

  [UserRole.Headquarter]: [
    Permission.StaffsView,
    Permission.StaffsCreate,
    Permission.StaffsEdit,
    Permission.StaffsDelete,
    Permission.StaffsInvite,
    Permission.StoresView,
    Permission.StoresCreate,
    Permission.StoresEdit,
    Permission.StoresDelete,
    Permission.StoresConfigContract,
    Permission.StoresConfigAccess,
    Permission.StoresConfigBusiness,
    Permission.PositionsView,
    Permission.PositionsCreate,
    Permission.PositionsEdit,
    Permission.PositionsDelete,
    Permission.MembersView,
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
    Permission.MembersBlacklistView,
    Permission.BlacklistCreate,
    Permission.BlacklistDelete,
    Permission.MembersLeavesView,
    Permission.LeavesApprove,
    Permission.MembersTransfersView,
    Permission.TransfersApprove,
    Permission.MembershipApplicationsView,
    Permission.MembershipApplicationsCreate,
    Permission.MembershipApplicationsApprove,
    Permission.FamilyRegistrationsView,
    Permission.FamilyRegistrationsDashboardView,
    Permission.FamilyRegistrationsApprove,
    Permission.ContractsView,
    Permission.CampaignsView,
    Permission.CampaignsCreate,
    Permission.CampaignsEdit,
    Permission.CampaignsPromoCodeCreate,
    Permission.CampaignsPromoCodeExport,
    Permission.ContractsEdit,
    Permission.ContractsDelete,
    Permission.ContractsCreate,
    Permission.OptionsView,
    Permission.OptionsCreate,
    Permission.OptionsEdit,
    Permission.OptionsDelete,
    Permission.SurveysView,
    Permission.SurveysCreate,
    Permission.SurveysEdit,
    Permission.SurveysDelete,
    Permission.OptionDiscountsView,
    Permission.OptionDiscountsCreate,
    Permission.OptionDiscountsEdit,
    Permission.OptionDiscountsDelete,
    Permission.BrandsView,
    Permission.BrandsCreate,
    Permission.BrandsEdit,
    Permission.LockersView,
    Permission.LockersCreate,
    Permission.LockersEdit,
    Permission.LockersDelete,
    Permission.LockersExport,
    Permission.LockersPendingView,
    Permission.LockersPendingExport,
    Permission.LockersContractsView,
    Permission.LockersContractsCreate,
    Permission.LockersContractsEdit,
    Permission.LockersContractsExport,
  ],

  [UserRole.Manager]: [
    Permission.StaffsView,
    Permission.StoresView,
    Permission.MembersView,
    Permission.MembersCreate,
    Permission.MembersEdit,
    Permission.MembersReEnroll,
    Permission.MembersSuspend,
    Permission.MembersWithdraw,
    Permission.MembersTransfer,
    Permission.MembersGateStop,
    Permission.MembersLeavesView,
    Permission.MembersTransfersView,
    Permission.MembershipApplicationsView,
    Permission.MembershipApplicationsCreate,
    Permission.FamilyRegistrationsView,
    Permission.FamilyRegistrationsDashboardView,
    Permission.ContractsView,
    Permission.CampaignsView,
    Permission.CampaignsPromoCodeCreate,
    Permission.CampaignsPromoCodeExport,
    Permission.OptionsView,
    Permission.BrandsView,
    Permission.LockersView,
    Permission.LockersCreate,
    Permission.LockersEdit,
    Permission.LockersDelete,
    Permission.LockersExport,
    Permission.LockersPendingView,
    Permission.LockersPendingExport,
    Permission.LockersContractsView,
    Permission.LockersContractsCreate,
    Permission.LockersContractsEdit,
    Permission.LockersContractsExport,
    Permission.SurveysView,
  ],

  [UserRole.Staff]: [
    Permission.StaffsView,
    Permission.StaffsEdit,
    Permission.StoresView,
    Permission.StoresCreate,
    Permission.StoresEdit,
    Permission.StoresConfigBusiness,
    Permission.MembersView,
    Permission.MembersCreate,
    Permission.MembersEdit,
    Permission.MembersReEnroll,
    Permission.MembersSuspend,
    Permission.MembersWithdraw,
    Permission.MembersTransfer,
    Permission.MembersGateStop,
    Permission.MembersLeavesView,
    Permission.MembersTransfersView,
    Permission.MembershipApplicationsView,
    Permission.MembershipApplicationsCreate,
    Permission.FamilyRegistrationsView,
    Permission.FamilyRegistrationsDashboardView,
    Permission.ContractsView,
    Permission.CampaignsView,
    Permission.CampaignsPromoCodeCreate,
    Permission.CampaignsPromoCodeExport,
    Permission.OptionsView,
    Permission.BrandsView,
    Permission.LockersView,
    Permission.LockersCreate,
    Permission.LockersEdit,
    Permission.LockersDelete,
    Permission.LockersExport,
    Permission.LockersPendingView,
    Permission.LockersPendingExport,
    Permission.LockersContractsView,
    Permission.LockersContractsCreate,
    Permission.LockersContractsEdit,
    Permission.LockersContractsExport,
    Permission.SurveysView,
  ],

  [UserRole.Trainer]: [Permission.MembersView],

  [UserRole.Observer]: [
    Permission.MembersView,
    Permission.MembersLeavesView,
    Permission.MembersTransfersView,
    Permission.MembershipApplicationsView,
    Permission.FamilyRegistrationsView,
    Permission.FamilyRegistrationsDashboardView,
    Permission.LockersView,
    Permission.LockersPendingView,
    Permission.LockersPendingExport,
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the given role holds the permission required to view the route.
 * Routes not listed in PAGE_PERMISSIONS are unrestricted — any authenticated role can access.
 */
export function canRoleAccessPage(role: UserRole, pattern: RoutePattern): boolean {
  const required = PAGE_PERMISSIONS[pattern];
  if (!required) return true; // not restricted
  return (ROLE_PERMISSIONS[role] as readonly Permission[]).includes(required);
}

/**
 * Returns true if the given role holds all of the specified permissions.
 */
export function hasPermissions(role: UserRole, permissions: readonly Permission[]): boolean {
  const granted = ROLE_PERMISSIONS[role] as readonly Permission[];
  return permissions.every((p) => granted.includes(p));
}

/**
 * Returns true if the given route is restricted to Headquarter/System only.
 * Determined by checking whether only those two roles hold the required page-view permission.
 */
export function isPageHqOnly(pattern: RoutePattern): boolean {
  const required = PAGE_PERMISSIONS[pattern];
  if (!required) return false;
  const accessibleRoles = Object.values(UserRole).filter((role) =>
    (ROLE_PERMISSIONS[role] as readonly Permission[]).includes(required),
  );
  return (
    accessibleRoles.length > 0 &&
    accessibleRoles.every((r) => r === UserRole.System || r === UserRole.Headquarter)
  );
}
