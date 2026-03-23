import { Brand, MemberStatus, MemberType } from '@/types/member.type';

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  [MemberType.REGULAR]: '通常会員',
  [MemberType.FAMILY]: '家族会員',
  [MemberType.CORPORATE]: '法人会員',
  [MemberType.COMPANY_DISCOUNT]: '社割会員',
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: '利用中',
  [MemberStatus.SUSPENDED]: '休会中',
  [MemberStatus.WITHDRAWN]: '退会済み',
  [MemberStatus.FORCE_WITHDRAWN]: '強制退会済み',
};

export const BRAND_LABELS: Record<Brand, string> = {
  [Brand.JOYFIT]: 'JOYFIT',
  [Brand.FIT365]: 'FIT365',
};

export const STATUS_VARIANTS: Record<
  MemberStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [MemberStatus.ACTIVE]: 'default',
  [MemberStatus.SUSPENDED]: 'secondary',
  [MemberStatus.WITHDRAWN]: 'outline',
  [MemberStatus.FORCE_WITHDRAWN]: 'destructive',
};
