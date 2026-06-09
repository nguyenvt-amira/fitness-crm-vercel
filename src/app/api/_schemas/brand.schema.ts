import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const BRAND_IDENTIFIER_REGEX = /^[a-z0-9_]+$/;
const BRAND_IDENTIFIER_INPUT_REGEX = /^[A-Za-z0-9_]+$/;

export const ManagedBrandCodeSchema = z.string().trim().regex(BRAND_IDENTIFIER_REGEX).openapi({
  title: 'ManagedBrandCode',
  description: 'システム内部で利用するブランドコード',
  example: 'joyfit',
});

export const BrandIdInputSchema = z
  .string()
  .trim()
  .min(1)
  .regex(BRAND_IDENTIFIER_INPUT_REGEX, '英数字とアンダースコアのみ入力できます')
  .openapi({
    title: 'BrandIdInput',
    description: 'ブランドID入力値',
    example: 'joyfit',
  });

const BrandFeeSchema = z.number().int().min(0).nullable();

export const BrandPaginationSchema = z
  .object({
    page: z.number().int().min(1).openapi({
      example: 1,
      description: '現在のページ',
    }),
    limit: z.number().int().min(1).openapi({
      example: 25,
      description: '1ページあたりの表示件数',
    }),
    total: z.number().int().min(0).openapi({
      example: 2,
      description: '検索条件適用後の総件数',
    }),
    total_pages: z.number().int().min(1).openapi({
      example: 1,
      description: '総ページ数',
    }),
    all_total: z.number().int().min(0).openapi({
      example: 5,
      description: '検索条件適用前の総件数',
    }),
  })
  .openapi({
    title: 'BrandPagination',
    description: 'ブランド一覧のページネーション情報',
  });

export const BrandItemSchema = z
  .object({
    brand_id: ManagedBrandCodeSchema.openapi({
      description: 'ブランドID',
      example: 'joyfit',
    }),
    code: ManagedBrandCodeSchema.openapi({
      description: 'ブランドコード',
      example: 'joyfit',
    }),
    display_name: z.string().trim().min(1).openapi({
      example: 'JOYFIT',
      description: 'ブランド名',
    }),
    enrollment_fee_yen: BrandFeeSchema.openapi({
      example: 2000,
      description: '入会金（税別・円）',
    }),
    registration_admin_fee_yen: BrandFeeSchema.openapi({
      example: 3000,
      description: '登録事務手数料（税別・円）',
    }),
    card_issuance_fee_yen: BrandFeeSchema.openapi({
      example: 5000,
      description: 'カード発行料（税別・円）',
    }),
    other_fee_description: z.string().nullable().openapi({
      example: 'セキュリティ管理費・施設メンテナンス料 4,980円（1年ごと）',
      description: 'その他費用の表示文言',
    }),
    currency: z.literal('JPY').openapi({
      description: '通貨コード',
    }),
    sort_order: z.number().int().openapi({
      example: 1,
      description: '一覧表示順',
    }),
    created_at: z.string().openapi({
      example: '2024-01-01T00:00:00.000Z',
      description: '作成日時',
    }),
    updated_at: z.string().openapi({
      example: '2026-04-01T09:00:00.000Z',
      description: '更新日時',
    }),
    created_by: z.string().nullable().optional().openapi({
      example: 'STF-001',
      description: '作成者スタッフID',
    }),
    updated_by: z.string().nullable().optional().openapi({
      example: 'STF-001',
      description: '最終更新者スタッフID',
    }),
  })
  .openapi({
    title: 'BrandItem',
    description: 'Y-07 ブランド基本設定',
  });

export const GetBrandsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({
      example: 1,
      description: 'ページ番号',
    }),
    limit: z.coerce.number().int().min(1).max(200).default(25).openapi({
      example: 25,
      description: '1ページあたりの表示件数',
    }),
    search: z.string().trim().max(255).optional().openapi({
      example: 'joyfit',
      description: 'ブランドID・ブランド名・その他費用で検索',
    }),
  })
  .openapi({
    title: 'GetBrandsQuery',
    description: 'ブランド一覧検索条件',
  });

export const GetBrandsResponseSchema = z
  .object({
    brands: z.array(BrandItemSchema).openapi({
      description: '管理対象ブランド一覧',
    }),
    pagination: BrandPaginationSchema,
  })
  .openapi({
    title: 'GetBrandsResponse',
    description: 'ブランドマスタ一覧',
  });

export const CreateBrandRequestSchema = z
  .object({
    display_name: z.string().trim().min(1).max(255).openapi({
      description: 'ブランド名',
      example: 'JOYFIT',
    }),
    brand_id: BrandIdInputSchema.openapi({
      description: 'ブランドID',
      example: 'joyfit',
    }),
    enrollment_fee_yen: BrandFeeSchema.optional().openapi({
      description: '入会金（税別・円）',
    }),
    registration_admin_fee_yen: BrandFeeSchema.optional().openapi({
      description: '登録事務手数料（税別・円）',
    }),
    card_issuance_fee_yen: BrandFeeSchema.optional().openapi({
      description: 'カード発行料（税別・円）',
    }),
    other_fee_description: z.string().trim().max(1000).nullable().optional().openapi({
      description: 'その他費用',
    }),
    created_by: z.string().trim().min(1).optional().openapi({
      description: '作成者スタッフID（モック用）',
      example: 'STF-001',
    }),
  })
  .openapi({
    title: 'CreateBrandRequest',
    description: 'Y-07 ブランド新規登録',
  });

export const CreateBrandResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'ブランドを作成しました' }),
    brand: BrandItemSchema,
  })
  .openapi({
    title: 'CreateBrandResponse',
    description: '作成後のブランド行',
  });

export const UpdateBrandRequestSchema = z
  .object({
    display_name: z.string().trim().min(1).max(255).optional().openapi({
      description: 'ブランド名',
    }),
    brand_id: BrandIdInputSchema.optional().openapi({
      description: 'ブランドID',
    }),
    enrollment_fee_yen: BrandFeeSchema.optional().openapi({
      description: '入会金（税別・円）',
    }),
    registration_admin_fee_yen: BrandFeeSchema.optional().openapi({
      description: '登録事務手数料（税別・円）',
    }),
    card_issuance_fee_yen: BrandFeeSchema.optional().openapi({
      description: 'カード発行料（税別・円）',
    }),
    other_fee_description: z.string().trim().max(1000).nullable().optional().openapi({
      description: 'その他費用',
    }),
    updated_by: z.string().trim().min(1).optional().openapi({
      description: '更新者スタッフID（モック用）',
      example: 'STF-001',
    }),
  })
  .openapi({
    title: 'UpdateBrandRequest',
    description: 'Y-07 ブランド設定の部分更新',
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
export type BrandPagination = z.infer<typeof BrandPaginationSchema>;
export type CreateBrandRequest = z.infer<typeof CreateBrandRequestSchema>;
export type CreateBrandResponse = z.infer<typeof CreateBrandResponseSchema>;
export type GetBrandsQuery = z.infer<typeof GetBrandsQuerySchema>;
export type GetBrandsResponse = z.infer<typeof GetBrandsResponseSchema>;
export type ManagedBrandCode = z.infer<typeof ManagedBrandCodeSchema>;
export type UpdateBrandRequest = z.infer<typeof UpdateBrandRequestSchema>;
export type UpdateBrandResponse = z.infer<typeof UpdateBrandResponseSchema>;
