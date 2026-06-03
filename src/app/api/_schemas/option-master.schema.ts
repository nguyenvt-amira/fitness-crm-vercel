import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ErrorResponseSchema } from './auth.schema';
import { StoreListBrandSchema } from './store.schema';

extendZodWithOpenApi(z);

export const OptionTypeSchema = z.enum(['standard', 'metered', 'auto_attached']).openapi({
  title: 'OptionType',
  description: 'オプション種別（通常/都次/自動付与）',
});

export const OptionStatusSchema = z.enum(['active', 'inactive']).openapi({
  title: 'OptionStatus',
  description: 'オプション有効/無効ステータス',
});

export const OptionProrataMethodSchema = z.enum(['daily', 'fixed']).openapi({
  title: 'OptionProrataMethod',
  description: '日割り計算方法（daily: 日割り計算 / fixed: 固定金額）',
});

export const OptionUsageRuleSchema = z
  .enum(['disabled', 'add_remove', 'add_remove_change', 'change_remove'])
  .openapi({
    title: 'OptionUsageRule',
    description: '利用可否ルール',
  });

export const OptionMasterListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'OP002', description: 'オプションID' }),
    name: z.string().openapi({ example: '水素水', description: 'オプション名' }),
    code: z.string().openapi({ example: 'H2O-001', description: 'オプションコード' }),
    brand: StoreListBrandSchema.openapi({ description: 'ブランド' }),
    option_type: OptionTypeSchema.openapi({ description: 'オプション種別' }),
    price_including_tax: z
      .number()
      .nonnegative()
      .openapi({ example: 1100, description: '料金（税込）' }),
    tax_rate: z.number().nonnegative().openapi({ example: 10, description: '税率（%）' }),
    prorated_enabled: z.boolean().openapi({ example: true, description: '日割り要否' }),
    prorata_method: OptionProrataMethodSchema.nullable().openapi({
      description: '日割り計算方法（prorated_enabled=true の場合のみ）',
    }),
    usage_rule: OptionUsageRuleSchema.openapi({ description: '利用可否ルール' }),
    linked_contracts: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 10, description: '紐付き契約プラン数' }),
    member_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 680, description: '利用会員数' }),
    store_id: z.string().nullable().openapi({ description: '対象店舗ID（null = 全店舗）' }),
    store_name: z.string().nullable().openapi({ description: '対象店舗名（null = 全店舗）' }),
    accounting_code: z.string().openapi({ example: 'OPT-102', description: '会計コード' }),
    status: OptionStatusSchema.openapi({ description: 'ステータス' }),
  })
  .openapi({
    title: 'OptionMasterListItem',
    description: 'オプション一覧アイテム',
  });

export const GetOptionMastersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(20),
    search: z.string().optional().openapi({ description: 'オプション名・コードで検索' }),
    brand: StoreListBrandSchema.optional(),
    option_type: OptionTypeSchema.optional(),
    status: OptionStatusSchema.optional(),
    store_id: z.string().optional().openapi({ description: '店舗IDで絞り込み' }),
    sort_by: z
      .enum(['id', 'name', 'code', 'price_including_tax', 'member_count', 'tax_rate', 'status'])
      .default('id'),
    sort_order: z.enum(['asc', 'desc']).default('asc'),
  })
  .openapi({
    title: 'GetOptionMastersQuery',
    description: 'オプション一覧取得クエリ',
  });

export const GetOptionMastersResponseSchema = z
  .object({
    options: z.array(OptionMasterListItemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
    }),
  })
  .openapi({
    title: 'GetOptionMastersResponse',
    description: 'オプション一覧レスポンス',
  });

export type OptionMasterListItem = z.infer<typeof OptionMasterListItemSchema>;
export type GetOptionMastersQuery = z.infer<typeof GetOptionMastersQuerySchema>;
export type GetOptionMastersResponse = z.infer<typeof GetOptionMastersResponseSchema>;
export type OptionProrataMethod = z.infer<typeof OptionProrataMethodSchema>;
export type OptionUsageRule = z.infer<typeof OptionUsageRuleSchema>;

export { ErrorResponseSchema };
