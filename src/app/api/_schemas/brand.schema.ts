import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * Brands under management.
 */
export const ManagedBrandCodeSchema = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9_]+$/)
  .openapi({
    title: 'ManagedBrandCode',
    example: 'joyfit',
    description: '管理対象ブランドコード（英数字とアンダースコアのみ）',
  });

/**
 * Y-07 ブランドマスタ — 入会金・手数料の基本設定（G-01 主契約のデフォルト参照元）
 */
export const BrandItemSchema = z
  .object({
    brand_id: z.string().openapi({
      example: 'joyfit',
      description: 'ブランドID',
    }),
    code: ManagedBrandCodeSchema.openapi({
      description: 'ブランドコード',
    }),
    display_name: z.string().openapi({
      example: 'JOYFIT',
      description: '表示名',
    }),
    /** 入会金（税別・円）— G-01 新規登録時のデフォルト（主契約で個別上書き可） */
    enrollment_fee_yen: z.number().int().min(0).nullable().openapi({
      example: 2000,
      description: '入会金デフォルト（円）。設定なしの場合は null',
    }),
    /** 登録事務手数料（税別・円） */
    registration_admin_fee_yen: z.number().int().min(0).nullable().openapi({
      example: 3000,
      description: '登録事務手数料デフォルト（円）。設定なしの場合は null',
    }),
    /** カード発行料（税別・円） */
    card_issuance_fee_yen: z.number().int().min(0).nullable().openapi({
      example: 5000,
      description: 'カード発行料デフォルト（円）。設定なしの場合は null',
    }),
    other_fee_description: z.string().nullable().openapi({
      example: 'セキュリティ管理費・施設メンテナンス料 4,980円（1年ごと）',
      description: 'その他費用の表示テキスト。設定なしの場合は null',
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
    created_by: z.string().openapi({
      example: 'STF-001',
      description: '作成者スタッフID',
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
      description: '管理対象ブランド一覧',
    }),
  })
  .openapi({
    title: 'GetBrandsResponse',
    description: 'ブランドマスタ一覧',
  });

export const UpdateBrandRequestSchema = z
  .object({
    enrollment_fee_yen: z.number().int().min(0).nullable().optional().openapi({
      description: '入会金（円）',
    }),
    registration_admin_fee_yen: z.number().int().min(0).nullable().optional().openapi({
      description: '登録事務手数料（円）',
    }),
    card_issuance_fee_yen: z.number().int().min(0).nullable().optional().openapi({
      description: 'カード発行料（円）',
    }),
    other_fee_description: z.string().nullable().optional().openapi({
      description: 'その他費用の表示テキスト。設定なしの場合は null',
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
