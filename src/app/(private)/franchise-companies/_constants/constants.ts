import type {
  FranchiseCompanyStatus,
  FranchiseCompanyType,
} from '@/app/api/_schemas/franchise-company.schema';

export const FRANCHISE_COMPANY_TYPE_VALUES = [
  'direct',
  'fc',
] as const satisfies readonly FranchiseCompanyType[];
export const FRANCHISE_COMPANY_STATUS_VALUES = [
  'active',
  'inactive',
] as const satisfies readonly FranchiseCompanyStatus[];

export const FRANCHISE_COMPANY_TYPE_LABELS: Record<FranchiseCompanyType, string> = {
  direct: '直営',
  fc: 'FC',
};

export const FRANCHISE_COMPANY_STATUS_LABELS: Record<FranchiseCompanyStatus, string> = {
  active: '有効',
  inactive: '無効',
};

export const FRANCHISE_COMPANY_TYPE_OPTIONS = [
  { value: 'all', label: '全区分' },
  ...FRANCHISE_COMPANY_TYPE_VALUES.map((value) => ({
    value,
    label: FRANCHISE_COMPANY_TYPE_LABELS[value],
  })),
] as const;

export const FRANCHISE_COMPANY_STATUS_OPTIONS = [
  { value: 'all', label: '全ステータス' },
  ...FRANCHISE_COMPANY_STATUS_VALUES.map((value) => ({
    value,
    label: FRANCHISE_COMPANY_STATUS_LABELS[value],
  })),
] as const;

export const FRANCHISE_COMPANY_TYPE_BADGE_CLASSES: Record<FranchiseCompanyType, string> = {
  direct: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  fc: '',
};

export const FRANCHISE_COMPANY_STATUS_BADGE_CLASSES: Record<FranchiseCompanyStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-muted text-muted-foreground border-border',
};
