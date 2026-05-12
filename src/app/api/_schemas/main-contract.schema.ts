import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ErrorResponseSchema } from './auth.schema';
import { StoreListBrandSchema } from './store.schema';

extendZodWithOpenApi(z);

export const MainContractTypeSchema = z
  .enum([
    'general',
    'oneDay',
    'family',
    'kids',
    'student',
    'corporate',
    'welfare',
    'prepaid',
    'special',
  ])
  .openapi({
    title: 'MainContractType',
    description: '主契約タイプ（G-01）',
  });

export const MainContractStatusSchema = z.enum(['active', 'inactive']).openapi({
  title: 'MainContractStatus',
  description: '主契約の有効/無効ステータス',
});

export const MainContractListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'MC001', description: '主契約ID' }),
    name: z.string().openapi({ example: 'レギュラー会員', description: '主契約名' }),
    contract_type: MainContractTypeSchema.openapi({ description: '契約タイプ' }),
    brand: StoreListBrandSchema.openapi({ description: 'ブランド' }),
    target_store_name: z.string().nullable().optional().openapi({
      example: 'JOYFIT24新宿店',
      description: '特殊契約の場合の対象店舗名',
    }),
    price_including_tax: z
      .number()
      .nonnegative()
      .openapi({ example: 7700, description: '料金（税込）' }),
    companion_benefit_enabled: z.boolean().openapi({
      example: false,
      description: '同伴特典フラグ',
    }),
    status: MainContractStatusSchema.openapi({ description: 'ステータス' }),
  })
  .openapi({
    title: 'MainContractListItem',
    description: '主契約一覧アイテム',
  });

export const GetMainContractsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(20),
    search: z.string().optional().openapi({ description: '主契約名・IDで検索' }),
    contract_type: MainContractTypeSchema.optional(),
    brand: StoreListBrandSchema.optional(),
    status: MainContractStatusSchema.optional(),
    sort_by: z.enum(['id', 'name', 'contract_type', 'brand', 'price_including_tax']).default('id'),
    sort_order: z.enum(['asc', 'desc']).default('asc'),
  })
  .openapi({
    title: 'GetMainContractsQuery',
    description: '主契約一覧取得クエリ',
  });

export const GetMainContractsResponseSchema = z
  .object({
    main_contracts: z.array(MainContractListItemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
    }),
  })
  .openapi({
    title: 'GetMainContractsResponse',
    description: '主契約一覧レスポンス',
  });

export type MainContractListItem = z.infer<typeof MainContractListItemSchema>;
export type GetMainContractsQuery = z.infer<typeof GetMainContractsQuerySchema>;
export type GetMainContractsResponse = z.infer<typeof GetMainContractsResponseSchema>;

export { ErrorResponseSchema };
