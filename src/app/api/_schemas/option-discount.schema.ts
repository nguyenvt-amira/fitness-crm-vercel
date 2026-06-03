import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ErrorResponseSchema } from './auth.schema';

extendZodWithOpenApi(z);

export const OptionDiscountTypeSchema = z.enum(['fixed_amount', 'percentage']).openapi({
  title: 'OptionDiscountType',
  description: 'セット割の割引タイプ',
});

export const OptionDiscountStatusSchema = z.enum(['active', 'inactive']).openapi({
  title: 'OptionDiscountStatus',
  description: 'セット割の有効/無効ステータス',
});

export const OptionDiscountListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'SD001', description: 'セット割ID' }),
    name: z.string().openapi({ example: 'レギュラー＋水素水セット', description: 'セット割名' }),
    code: z.string().openapi({ example: 'SET-001', description: 'セット割コード' }),
    target_contracts: z
      .array(z.string())
      .openapi({ description: '対象契約名一覧', example: ['レギュラー会員'] }),
    target_options: z
      .array(z.string())
      .openapi({ description: '対象オプション名一覧', example: ['水素水'] }),
    discount_type: OptionDiscountTypeSchema.openapi({ description: '割引タイプ' }),
    discount_value: z.number().nonnegative().openapi({ example: 330, description: '割引値' }),
    conditions: z.string().openapi({ example: '同時申込時', description: '適用条件' }),
    store_id: z.string().nullable().openapi({ description: '対象店舗ID（null = 全店舗）' }),
    store_name: z.string().nullable().openapi({ description: '対象店舗名（null = 全店舗）' }),
    applied_count: z.number().int().nonnegative().openapi({ example: 180, description: '適用数' }),
    status: OptionDiscountStatusSchema.openapi({ description: 'ステータス' }),
  })
  .openapi({
    title: 'OptionDiscountListItem',
    description: 'セット割一覧アイテム',
  });

export const GetOptionDiscountsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(25),
    search: z.string().optional().openapi({ description: 'セット割名・コードで検索' }),
    discount_type: OptionDiscountTypeSchema.optional(),
    status: OptionDiscountStatusSchema.optional(),
    sort_by: z
      .enum([
        'id',
        'name',
        'code',
        'discount_type',
        'discount_value',
        'store_name',
        'applied_count',
        'status',
      ])
      .default('id'),
    sort_order: z.enum(['asc', 'desc']).default('asc'),
  })
  .openapi({
    title: 'GetOptionDiscountsQuery',
    description: 'セット割一覧取得クエリ',
  });

export const GetOptionDiscountsResponseSchema = z
  .object({
    option_discounts: z.array(OptionDiscountListItemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
    }),
  })
  .openapi({
    title: 'GetOptionDiscountsResponse',
    description: 'セット割一覧レスポンス',
  });

export { ErrorResponseSchema };

export type OptionDiscountType = z.infer<typeof OptionDiscountTypeSchema>;
export type OptionDiscountStatus = z.infer<typeof OptionDiscountStatusSchema>;
export type OptionDiscountListItem = z.infer<typeof OptionDiscountListItemSchema>;
export type GetOptionDiscountsQuery = z.infer<typeof GetOptionDiscountsQuerySchema>;
export type GetOptionDiscountsResponse = z.infer<typeof GetOptionDiscountsResponseSchema>;
