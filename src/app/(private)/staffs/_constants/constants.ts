//TODO: Delete when API is ready

// Staff permission/role types
export enum StaffRole {
  HEADQUARTERS = 'headquarters', // 本部
  STORE_STAFF = 'store_staff', // 店舗スタッフ
  VIEWER = 'viewer', // 閲覧のみ
}

// Staff status types
export enum StaffStatus {
  ACTIVE = 'active', // 有効
  INACTIVE = 'inactive', // 無効
}

// Staff brand types (extended from member brands)
export enum StaffBrand {
  ALL = 'all', // 全ブランド
  JOYFIT = 'joyfit',
  FIT365 = 'fit365',
  JOYFIT24 = 'joyfit24',
  JOYFIT_YOGA = 'joyfit_yoga',
  JOYFIT_PLUS = 'joyfit_plus',
}

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  [StaffRole.HEADQUARTERS]: '本部',
  [StaffRole.STORE_STAFF]: '店舗スタッフ',
  [StaffRole.VIEWER]: '閲覧のみ',
};

export const STAFF_STATUS_LABELS: Record<StaffStatus, string> = {
  [StaffStatus.ACTIVE]: '有効',
  [StaffStatus.INACTIVE]: '無効',
};

export const STAFF_BRAND_LABELS: Record<StaffBrand, string> = {
  [StaffBrand.ALL]: '全ブランド',
  [StaffBrand.JOYFIT]: 'JOYFIT',
  [StaffBrand.FIT365]: 'FIT365',
  [StaffBrand.JOYFIT24]: 'JOYFIT24',
  [StaffBrand.JOYFIT_YOGA]: 'JOYFIT YOGA',
  [StaffBrand.JOYFIT_PLUS]: 'JOYFIT+',
};

export const STAFF_STATUS_VARIANTS: Record<
  StaffStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [StaffStatus.ACTIVE]: 'default',
  [StaffStatus.INACTIVE]: 'outline',
};
