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

export const OptionMasterListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'OP002', description: 'オプションID' }),
    name: z.string().openapi({ example: '水素水', description: 'オプション名' }),
    brand: StoreListBrandSchema.openapi({ description: 'ブランド' }),
    option_type: OptionTypeSchema.openapi({ description: 'オプション種別' }),
    price_including_tax: z
      .number()
      .nonnegative()
      .openapi({ example: 1100, description: '料金（税込）' }),
    prorated_enabled: z.boolean().openapi({ example: true, description: '日割り要否' }),
    usage_rule: z
      .enum(['disabled', 'add_remove', 'add_remove_change', 'change_remove'])
      .openapi({ description: '利用可否ルール' }),
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
    search: z.string().optional().openapi({ description: 'オプション名・IDで検索' }),
    brand: StoreListBrandSchema.optional(),
    option_type: OptionTypeSchema.optional(),
    status: OptionStatusSchema.optional(),
    sort_by: z.enum(['id', 'name', 'brand', 'price_including_tax']).default('id'),
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

export { ErrorResponseSchema };
