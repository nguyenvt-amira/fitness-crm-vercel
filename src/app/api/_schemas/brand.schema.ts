import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * Brands under Y-07 management (現在: JOYFIT / FIT365 のみ).
 * 将来ブランド追加はマスタ行の追加で対応（StaffBrand の全値とは別概念）
 */
export const ManagedBrandCodeSchema = z.enum(['joyfit', 'fit365']).openapi({
  title: 'ManagedBrandCode',
  description: 'Y-07 管理対象ブランドコード（2ブランド共通運用）',
});

/**
 * Y-07 ブランドマスタ — 入会金・手数料の基本設定（G-01 主契約のデフォルト参照元）
 */
export const BrandItemSchema = z
  .object({
    brand_id: z.string().openapi({
      example: 'brand-joyfit',
      description: 'Canonical id（店舗.brand_id 等と整合）',
    }),
    code: ManagedBrandCodeSchema.openapi({
      description: 'ブランドコード',
    }),
    display_name: z.string().openapi({
      example: 'JOYFIT',
      description: '表示名',
    }),
    /** 入会金（円）— G-01 新規登録時のデフォルト（主契約で個別上書き可） */
    enrollment_fee_yen: z.number().int().min(0).openapi({
      example: 3300,
      description: '入会金デフォルト（円）',
    }),
    /** 手数料（円）— 基本設定（モックは単一金額。詳細項目は将来拡張可） */
    handling_fee_yen: z.number().int().min(0).openapi({
      example: 1100,
      description: '手数料デフォルト（円）',
    }),
    currency: z.literal('JPY').openapi({
      description: '通貨',
    }),
    sort_order: z.number().int().openapi({
      example: 1,
      description: '一覧表示順',
    }),
    created_at: z.string().openapi({
      example: '2024-01-01T00:00:00.000Z',
    }),
    updated_at: z.string().openapi({
      example: '2026-04-01T09:00:00.000Z',
    }),
    updated_by: z.string().nullable().optional().openapi({
      example: 'STF-001',
      description: '最終更新者（本部のみ編集）',
    }),
  })
  .openapi({
    title: 'BrandItem',
    description: 'Y-07 ブランド基本設定。本部のみ編集、Manager/Staff は参照のみ（権限マトリクス）',
  });

export const GetBrandsResponseSchema = z
  .object({
    brands: z.array(BrandItemSchema).openapi({
      description: '管理対象ブランド一覧（JOYFIT / FIT365）',
    }),
  })
  .openapi({
    title: 'GetBrandsResponse',
    description: 'Y-07 ブランドマスタ一覧',
  });

export const UpdateBrandRequestSchema = z
  .object({
    enrollment_fee_yen: z.number().int().min(0).optional().openapi({
      description: '入会金（円）',
    }),
    handling_fee_yen: z.number().int().min(0).optional().openapi({
      description: '手数料（円）',
    }),
    updated_by: z.string().optional().openapi({
      description: '更新者スタッフID（モック用）',
    }),
  })
  .openapi({
    title: 'UpdateBrandRequest',
    description: 'Y-07 ブランド設定の部分更新（本部のみ）',
  });

export const UpdateBrandResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'ブランド設定を保存しました' }),
    brand: BrandItemSchema,
  })
  .openapi({
    title: 'UpdateBrandResponse',
    description: '更新後のブランド行',
  });

export type BrandItem = z.infer<typeof BrandItemSchema>;
export type GetBrandsResponse = z.infer<typeof GetBrandsResponseSchema>;
export type ManagedBrandCode = z.infer<typeof ManagedBrandCodeSchema>;
export type UpdateBrandRequest = z.infer<typeof UpdateBrandRequestSchema>;
export type UpdateBrandResponse = z.infer<typeof UpdateBrandResponseSchema>;
