import {
  InternalTermsTypeSchema,
  TERMS_STATUS_LABELS,
  TERMS_TYPE_LABELS,
} from '@/app/api/_schemas/terms.schema';
import { z } from 'zod';

export const BRAND_OPTIONS = ['JOYFIT', 'FIT365'] as const;
export const TERMS_TYPE_OPTIONS = [
  'membership',
  'privacy',
  'payment',
  'companion',
  'withdrawal',
  'suspension',
] as const;
export const TERMS_STATUS_OPTIONS = ['published', 'expired', 'draft'] as const;
export const TERMS_SORT_OPTIONS = ['displayOrder', 'effectiveFrom', 'createdAt'] as const;
export const TERMS_ORDER_OPTIONS = ['asc', 'desc'] as const;
export const INCLUDE_DELETED_VALUES = ['true', 'false'] as const;
export const TERMS_PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
export const DEFAULT_TERMS_PAGE_SIZE = 20;
export const DEFAULT_TERMS_SORT = 'displayOrder';
export const DEFAULT_TERMS_ORDER = 'asc';

export const TermsBrandSchema = z.enum(BRAND_OPTIONS);
export const TermsTypeSchema = InternalTermsTypeSchema;
export const TermsStatusSchema = z.enum(TERMS_STATUS_OPTIONS);
export const TermsSortSchema = z.enum(TERMS_SORT_OPTIONS);
export const TermsOrderSchema = z.enum(TERMS_ORDER_OPTIONS);
export const IncludeDeletedSchema = z.enum(INCLUDE_DELETED_VALUES);

export const TermsListFiltersSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  sort: TermsSortSchema,
  order: TermsOrderSchema,
  search: z.string(),
  status: TermsStatusSchema.nullable(),
  termsType: TermsTypeSchema.nullable(),
  brandEnum: TermsBrandSchema.nullable(),
  includeDeleted: IncludeDeletedSchema,
});

export const TermsListApiQuerySchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  sort: TermsSortSchema,
  order: TermsOrderSchema,
  search: z.string().trim().max(100).optional(),
  status: TermsStatusSchema.optional(),
  termsType: TermsTypeSchema.optional(),
  brandEnum: TermsBrandSchema.optional(),
  includeDeleted: z.boolean(),
});

export type TermsFiltersState = z.infer<typeof TermsListFiltersSchema>;
export type TermsBrand = z.infer<typeof TermsBrandSchema>;
export type TermsType = z.infer<typeof TermsTypeSchema>;
export type TermsStatus = z.infer<typeof TermsStatusSchema>;
export type TermsSort = z.infer<typeof TermsSortSchema>;
export type TermsOrder = z.infer<typeof TermsOrderSchema>;
export type IncludeDeleted = z.infer<typeof IncludeDeletedSchema>;
export type TermsListApiQuery = z.infer<typeof TermsListApiQuerySchema>;

export { TERMS_TYPE_LABELS, TERMS_STATUS_LABELS };

export const TERMS_SORT_LABELS: Record<TermsSort, string> = {
  displayOrder: '表示順',
  effectiveFrom: '適用開始日',
  createdAt: '作成日時',
};

export const TERMS_ORDER_LABELS: Record<TermsOrder, string> = {
  asc: '昇順',
  desc: '降順',
};
