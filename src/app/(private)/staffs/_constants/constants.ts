import { StaffBrand, StaffRole, StaffStatus } from '@/lib/api/types.gen';

export { StaffBrand, StaffRole, StaffStatus } from '@/lib/api/types.gen';

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

export const STAFF_STATUS_CLASSES: Record<StaffStatus, string> = {
  [StaffStatus.ACTIVE]: 'bg-green-100 text-green-700 border-green-200',
  [StaffStatus.INACTIVE]: 'bg-gray-100 text-gray-500 border-gray-200',
};
