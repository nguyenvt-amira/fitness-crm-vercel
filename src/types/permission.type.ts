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
 * Fine-grained permission actions.
 * Format: "<resource>.<action>"
 * Extend this enum as new features are added.
 */
export enum Permission {
  // Members
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

  // Membership applications
  MembershipApplicationsCreate = 'membership-applications.create',
  MembershipApplicationsApprove = 'membership-applications.approve',

  // Staffs
  StaffsCreate = 'staffs.create',
  StaffsEdit = 'staffs.edit',
  StaffsDelete = 'staffs.delete',
  StaffsInvite = 'staffs.invite',

  // Stores
  StoresCreate = 'stores.create',
  StoresEdit = 'stores.edit',
  StoresDelete = 'stores.delete',
  StoresConfigContract = 'stores.config-contract',
  StoresConfigAccess = 'stores.config-access',
  StoresConfigBusiness = 'stores.config-business',

  // Positions
  PositionsCreate = 'positions.create',
  PositionsEdit = 'positions.edit',
  PositionsDelete = 'positions.delete',

  // Family registrations
  FamilyRegistrationsApprove = 'family-registrations.approve',

  // Transfers
  TransfersApprove = 'transfers.approve',

  // Leaves
  LeavesApprove = 'leaves.approve',

  // Blacklist
  BlacklistCreate = 'blacklist.create',
  BlacklistDelete = 'blacklist.delete',

  // Contracts
  ContractsEdit = 'contracts.edit',
  ContractsDelete = 'contracts.delete',
  ContractsCreate = 'contracts.create',
}

/** Authenticated user stored in context */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position: string;
}
