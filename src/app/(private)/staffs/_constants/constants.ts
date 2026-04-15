import type { StaffJobTitle } from '@/app/api/_schemas/staff.schema';

import { StaffBrand, StaffRole, StaffStatus } from '@/lib/api/types.gen';

export { StaffBrand, StaffRole, StaffStatus } from '@/lib/api/types.gen';

/** 役職: APIコード(key) と表示ラベル（API はコードのみ保持） */
export const STAFF_JOB_TITLES = [
  { key: 'manager', label: '店長' },
  { key: 'assistant_manager', label: '副店長' },
  { key: 'chief', label: 'チーフ' },
  { key: 'fulltime', label: 'スタッフ' },
  { key: 'part_time', label: 'アルバイト' },
] as const satisfies ReadonlyArray<{ key: StaffJobTitle; label: string }>;

export function getStaffJobTitleLabel(code: string | undefined | null): string {
  if (code == null || code === '') return '—';
  const row = STAFF_JOB_TITLES.find((t) => t.key === code);
  return row?.label ?? code;
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
  [StaffBrand.JOYFIT_PLUS]: 'JOYFIT+',
  [StaffBrand.JOYFIT_YOGA]: 'JOYFIT YOGA',
  [StaffBrand.JOYFIT24]: 'JOYFIT24',
  [StaffBrand.FIT365]: 'FIT365',
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
