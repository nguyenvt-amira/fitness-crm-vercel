import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/** G-01 main contract status (mock) */
export const StoreMainContractStatusSchema = z
  .enum(['draft', 'active', 'suspended', 'expired', 'terminated'])
  .openapi({
    title: 'StoreMainContractStatus',
    description: 'Main contract lifecycle for the store',
  });

/** Mutual-use mechanism type */
export const MutualUseTypeSchema = z
  .enum(['none', 'within_brand', 'cross_brand', 'custom'])
  .openapi({
    title: 'MutualUseType',
    description: 'Cơ chế sử dụng lẫn nhau / mutual use type',
  });

/** Brand (list/filter + master) */
export const StoreListBrandSchema = z
  .enum(['joyfit', 'fit365', 'joyfit24', 'joyfit_yoga', 'joyfit_plus'])
  .openapi({
    title: 'StoreListBrand',
    description: 'Store brand',
  });

export const StoreAreaSchema = z.enum(['kanto', 'kansai', 'chubu', 'other']).openapi({
  title: 'StoreArea',
  description: 'Rough geographic area for filtering',
});

/** 営業中 / 準備中 / 休業中 / 閉店 — UI status (mock) */
export const StoreListStatusSchema = z
  .enum(['operating', 'preparing', 'closed_temp', 'closed_perm'])
  .openapi({
    title: 'StoreListStatus',
    description: 'Store operating status (list / detail)',
  });

/**
 * Store master (Y-01) — single shape for list, detail, and mock DB
 */
export const StoreSchema = z
  .object({
    /** Internal primary key (API paths, FK) */
    id: z.string().openapi({ example: 'store-001', description: '内部ID' }),
    /** Display store id (一覧・帳票) */
    store_id: z.string().openapi({ example: 'S-001', description: '店舗ID (表示)' }),
    club_code: z.string().openapi({ example: 'STR-00001', description: 'クラブコード' }),
    name: z.string().openapi({ example: 'Fit365八潮店', description: '店舗名' }),
    brand: StoreListBrandSchema.openapi({ description: 'ブランド' }),
    area: StoreAreaSchema.openapi({ description: 'エリア' }),
    operating_company_name: z.string().openapi({
      example: '株式会社ウェルネスフロンティア',
      description: '運営企業',
    }),
    /** UIステータス (一覧・詳細共通) */
    status: StoreListStatusSchema.openapi({ description: 'ステータス' }),
    fc_company_id: z.string().nullable().optional().openapi({
      example: 'fc-001',
      description: 'FK FC company (Y-03), null for directly managed',
    }),
    manager_staff_id: z.string().nullable().optional().openapi({
      example: '12',
      description: 'FK Staff — 店舗責任者 (Y-01)',
    }),
    main_contract_id: z.string().nullable().optional().openapi({
      example: 'ctr-store-001',
      description: 'FK G-01 main contract',
    }),
    main_contract_status: StoreMainContractStatusSchema.nullable().optional().openapi({
      description: 'Main contract status snapshot',
    }),
    option_pass_price: z.number().openapi({
      example: 800,
      description: '1Day Pass price (staff with permission may edit)',
    }),
    mutual_use_enabled: z.boolean().openapi({ description: '相互利用を有効にするか' }),
    mutual_use_type: MutualUseTypeSchema.openapi({ description: '相互利用タイプ' }),
    closing_date: z.string().nullable().optional().openapi({
      example: '2027-03-31',
      description: '閉店日 — null while operating',
    }),
    locker_map_id: z.string().nullable().optional().openapi({
      example: 'locker-map-001',
      description: 'FK E-01 locker map',
    }),
    asset_id: z.string().nullable().optional().openapi({
      example: 'asset-ph2-001',
      description: 'FK I-01 (Phase 2)',
    }),
    created_by: z.string().openapi({ example: 'STF-001', description: '作成者' }),
    created_at: z.string().openapi({ example: '2024-01-10T09:00:00Z' }),
    updated_by: z.string().openapi({ example: 'STF-002', description: '更新者' }),
    updated_at: z.string().openapi({ example: '2026-03-01T12:00:00Z' }),
  })
  .openapi({
    title: 'Store',
    description: 'Store master row',
  });

export type Store = z.infer<typeof StoreSchema>;

export const GetStoresQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce.number().int().min(1).max(100).default(30).openapi({ example: 30 }),
    search: z.string().optional().openapi({
      description: '店舗名・クラブコードで検索',
    }),
    brand: StoreListBrandSchema.optional().openapi({ description: 'ブランド' }),
    area: StoreAreaSchema.optional().openapi({ description: 'エリア' }),
    status: StoreListStatusSchema.optional().openapi({ description: 'ステータス' }),
    sort_by: z
      .enum(['id', 'store_id', 'name', 'brand', 'area', 'club_code', 'operating_company_name'])
      .default('store_id')
      .openapi({ description: 'Sort field' }),
    sort_order: z.enum(['asc', 'desc']).default('asc').openapi({ description: 'Sort order' }),
  })
  .openapi({
    title: 'GetStoresQuery',
    description: 'Query parameters for store list',
  });

export const GetStoresResponseSchema = z
  .object({
    stores: z.array(StoreSchema).openapi({ description: 'Stores' }),
    pagination: z
      .object({
        page: z.number().openapi({ example: 1 }),
        limit: z.number().openapi({ example: 30 }),
        total: z.number().openapi({ example: 10 }),
        total_pages: z.number().openapi({ example: 1 }),
      })
      .openapi({ title: 'StorePagination' }),
  })
  .openapi({
    title: 'GetStoresResponse',
    description: 'Store list response with pagination',
  });

export type StoreListBrand = z.infer<typeof StoreListBrandSchema>;
export type StoreArea = z.infer<typeof StoreAreaSchema>;
export type StoreListStatus = z.infer<typeof StoreListStatusSchema>;
export type GetStoresQuery = z.infer<typeof GetStoresQuerySchema>;
export type GetStoresResponse = z.infer<typeof GetStoresResponseSchema>;

export { ErrorResponseSchema } from './auth.schema';
