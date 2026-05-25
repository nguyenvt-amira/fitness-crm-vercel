import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { StoreListBrandSchema } from './store.schema';

export { ErrorResponseSchema } from './auth.schema';

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

export const MainContractOtherStoreUsageSchema = z.enum(['all', 'direct', 'none']).openapi({
  title: 'MainContractOtherStoreUsage',
  description: '他店舗利用範囲',
});

export const MainContractListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'MC001', description: '主契約ID' }),
    name: z.string().openapi({ example: 'レギュラー会員', description: '主契約名' }),
    code: z.string().openapi({ example: 'REG-001', description: 'コード' }),
    old_code: z.string().nullable().optional().openapi({
      example: 'OLD-REG-001',
      description: '旧コード',
    }),
    contract_type: MainContractTypeSchema.openapi({ description: '契約タイプ' }),
    brand: StoreListBrandSchema.openapi({ description: 'ブランド' }),
    parent_contract_name: z.string().nullable().optional().openapi({
      example: 'レギュラー会員',
      description: '親主契約名',
    }),
    start_date: z.string().openapi({ example: '2024/04/01', description: '利用開始日' }),
    target_store_name: z.string().nullable().optional().openapi({
      example: 'JOYFIT24新宿店',
      description: '特殊契約の場合の対象店舗名',
    }),
    price_including_tax: z
      .number()
      .nonnegative()
      .openapi({ example: 7700, description: '料金（税込）' }),
    suspension_fee: z.number().nonnegative().openapi({
      example: 1100,
      description: '休会時請求額',
    }),
    monthly_limit: z.number().int().nonnegative().nullable().optional().openapi({
      example: 8,
      description: '回数上限',
    }),
    tax_rate: z.number().min(0).max(100).openapi({
      example: 10,
      description: '税率',
    }),
    suspendable_months: z.string().openapi({
      example: '1〜3月',
      description: '休会可能月',
    }),
    cancellable_months: z.string().openapi({
      example: '毎月',
      description: '退会可能月',
    }),
    active_contracts: z.number().int().nonnegative().openapi({
      example: 1250,
      description: '有効契約数',
    }),
    other_store_usage: MainContractOtherStoreUsageSchema.openapi({ description: '他店舗利用' }),
    companion_benefit_enabled: z.boolean().openapi({
      example: false,
      description: '同伴特典フラグ',
    }),
    enabled_stores: z.number().int().nonnegative().openapi({
      example: 10,
      description: '利用可能店舗数',
    }),
    total_stores: z.number().int().nonnegative().openapi({
      example: 12,
      description: '総店舗数',
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
    companion_benefit_enabled: z
      .preprocess((val) => {
        if (val === undefined || val === null || val === '') return undefined;
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') {
          if (val === 'true') return true;
          if (val === 'false') return false;
          return undefined;
        }
        return undefined;
      }, z.boolean().optional())
      .openapi({
        description: '同伴特典の有無でフィルタリング',
      }),
    sort_by: z
      .enum([
        'id',
        'name',
        'code',
        'contract_type',
        'start_date',
        'price_including_tax',
        'suspension_fee',
        'monthly_limit',
        'tax_rate',
        'active_contracts',
        'enabled_stores',
        'status',
      ])
      .default('id'),
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
