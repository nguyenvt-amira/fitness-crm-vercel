import { Brand, Gender, MemberStatus, MemberType, MemoType } from '@/lib/api/types.gen';

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

export const MEMBER_STATUS_CLASSES: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [MemberStatus.SUSPENDED]: 'bg-amber-100 text-amber-700 border-amber-200',
  [MemberStatus.WITHDRAWN]: 'bg-slate-100 text-slate-600 border-slate-200',
  [MemberStatus.FORCE_WITHDRAWN]: 'bg-red-100 text-red-700 border-red-200',
};

export const BRAND_CLASSES: Record<Brand, string> = {
  [Brand.JOYFIT]: 'bg-blue-100 text-blue-600',
  [Brand.FIT365]: 'bg-green-100 text-green-600',
};

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: '男性',
  [Gender.FEMALE]: '女性',
  [Gender.OTHER]: 'その他',
};

export const MEMO_TYPE_LABELS: Record<MemoType, string> = {
  [MemoType.CAUTION]: '要注意',
  [MemoType.VIP]: 'VIP',
  [MemoType.OTHER]: 'その他',
};
