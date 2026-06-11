/** All roles in the system */
export enum UserRole {
  System = 'System',
  Headquarter = 'Headquarter',
  Manager = 'Manager',
  Staff = 'Staff',
  Trainer = 'Trainer',
  Observer = 'Observer',
}

/**
 * Fine-grained permissions grouped by screen/resource.
 * Format: "<resource>.<action>"
 * Extend this enum as new features are added.
 */
export enum Permission {
  // -------------------------------------------------------------------------
  // Staffs
  // -------------------------------------------------------------------------
  StaffsView = 'staffs.view',
  StaffsCreate = 'staffs.create',
  StaffsEdit = 'staffs.edit',
  StaffsDelete = 'staffs.delete',
  StaffsInvite = 'staffs.invite',

  // -------------------------------------------------------------------------
  // Stores
  // -------------------------------------------------------------------------
  StoresView = 'stores.view',
  StoresCreate = 'stores.create',
  StoresEdit = 'stores.edit',
  StoresDelete = 'stores.delete',
  StoresConfigContract = 'stores.config-contract',
  StoresConfigAccess = 'stores.config-access',
  StoresConfigBusiness = 'stores.config-business',

  // -------------------------------------------------------------------------
  // Positions
  // -------------------------------------------------------------------------
  PositionsView = 'positions.view',
  PositionsCreate = 'positions.create',
  PositionsEdit = 'positions.edit',
  PositionsDelete = 'positions.delete',

  // -------------------------------------------------------------------------
  // Members
  // -------------------------------------------------------------------------
  MembersView = 'members.view',
  MembersCreate = 'members.create',
  MembersEdit = 'members.edit',
  MembersDelete = 'members.delete',
  MembersPersonalDataEdit = 'members.personal-data-edit',
  MembersPersonalDataDelete = 'members.personal-data-delete',
  MembersReEnroll = 'members.re-enroll',
  MembersSuspend = 'members.suspend',
  MembersWithdraw = 'members.withdraw',
  MembersTransfer = 'members.transfer',
  MembersGateStop = 'members.gate-stop',
  MembersForceWithdraw = 'members.force-withdraw',

  // -------------------------------------------------------------------------
  // Members — Blacklist
  // -------------------------------------------------------------------------
  MembersBlacklistView = 'members.blacklist-view',
  BlacklistCreate = 'blacklist.create',
  BlacklistDelete = 'blacklist.delete',

  // -------------------------------------------------------------------------
  // Members — Leaves
  // -------------------------------------------------------------------------
  MembersLeavesView = 'members.leaves-view',
  LeavesApprove = 'leaves.approve',

  // -------------------------------------------------------------------------
  // Members — Transfers
  // -------------------------------------------------------------------------
  MembersTransfersView = 'members.transfers-view',
  TransfersApprove = 'transfers.approve',

  // -------------------------------------------------------------------------
  // Membership applications
  // -------------------------------------------------------------------------
  MembershipApplicationsView = 'membership-applications.view',
  MembershipApplicationsCreate = 'membership-applications.create',
  MembershipApplicationsApprove = 'membership-applications.approve',

  // -------------------------------------------------------------------------
  // Family registrations
  // -------------------------------------------------------------------------
  FamilyRegistrationsView = 'family-registrations.view',
  FamilyRegistrationsDashboardView = 'family-registrations.dashboard-view',
  FamilyRegistrationsApprove = 'family-registrations.approve',

  // -------------------------------------------------------------------------
  // Contracts
  // -------------------------------------------------------------------------
  ContractsView = 'contracts.view',
  ContractsEdit = 'contracts.edit',
  ContractsDelete = 'contracts.delete',
  ContractsCreate = 'contracts.create',

  // -------------------------------------------------------------------------
  // Campaigns
  // -------------------------------------------------------------------------
  CampaignsView = 'campaigns.view',
  CampaignsCreate = 'campaigns.create',
  CampaignsEdit = 'campaigns.edit',
  CampaignsPromoCodeCreate = 'campaigns-promo-code.create',
  CampaignsPromoCodeExport = 'campaigns-promo-code.export',

  // -------------------------------------------------------------------------
  // Options
  // -------------------------------------------------------------------------
  OptionsView = 'options.view',
  OptionsEdit = 'options.edit',
  OptionsCreate = 'options.create',
  OptionsDelete = 'options.delete',

  // -------------------------------------------------------------------------
  // Option discounts
  // -------------------------------------------------------------------------
  OptionDiscountsView = 'option-discounts.view',
  OptionDiscountsEdit = 'option-discounts.edit',
  OptionDiscountsCreate = 'option-discounts.create',
  OptionDiscountsDelete = 'option-discounts.delete',

  // -------------------------------------------------------------------------
  // Brands
  // -------------------------------------------------------------------------
  BrandsView = 'brands.view',
  BrandsEdit = 'brands.edit',
  BrandsCreate = 'brands.create',

  // -------------------------------------------------------------------------
  // Lockers
  // -------------------------------------------------------------------------
  LockersView = 'lockers.view',
  LockersEdit = 'lockers.edit',
  LockersCreate = 'lockers.create',
  LockersDelete = 'lockers.delete',
  LockersExport = 'lockers.export',
  LockersPendingView = 'lockers-pending.view',
  LockersPendingExport = 'lockers-pending.export',
  LockersContractsView = 'lockers-contracts.view',
  LockersContractsCreate = 'lockers-contracts.create',
  LockersContractsEdit = 'lockers-contracts.edit',
  LockersContractsExport = 'lockers-contracts.export',

  // -------------------------------------------------------------------------
  // Surveys
  // -------------------------------------------------------------------------
  SurveysView = 'surveys.view',
  SurveysEdit = 'surveys.edit',
  SurveysCreate = 'surveys.create',
  SurveysDelete = 'surveys.delete',
}

/** Authenticated user stored in context */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position: string;
}
