import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const FranchiseCompanyTypeSchema = z
  .enum(['direct', 'fc'])
  .openapi({ title: 'FranchiseCompanyType', description: '直営 / FC 区分' });

export const FranchiseCompanyStatusSchema = z
  .enum(['active', 'inactive'])
  .openapi({ title: 'FranchiseCompanyStatus', description: 'FC企業ステータス' });

export const FranchiseCompanyListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'fc-001', description: 'FC企業ID' }),
    display_name: z
      .string()
      .openapi({ example: 'サンプルFC株式会社', description: '法人名（表示名）' }),
    type: FranchiseCompanyTypeSchema.openapi({ description: '直営 / FC 区分' }),
    managed_store_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 12, description: '管轄店舗数' }),
    status: FranchiseCompanyStatusSchema.openapi({ description: 'ステータス' }),
  })
  .openapi({
    title: 'FranchiseCompanyListItem',
    description: 'FC企業一覧アイテム',
  });

export const FranchiseCompanyDetailSchema = FranchiseCompanyListItemSchema.extend({
  formal_name: z
    .string()
    .openapi({ example: '株式会社フィットネスパートナーズ', description: '法人名（正式名称）' }),
  direct_owned_flag: z.boolean().openapi({ example: false, description: '直営店フラグ' }),
  corporate_number: z
    .string()
    .nullable()
    .openapi({ example: '1234567890123', description: '法人番号' }),
  representative_name: z
    .string()
    .nullable()
    .openapi({ example: '山田 太郎', description: '代表者名' }),
  head_office_address: z
    .string()
    .nullable()
    .openapi({ example: '福岡県福岡市中央区天神1-1-1', description: '本社所在地' }),
  phone: z.string().nullable().openapi({ example: '092-000-0000', description: '電話番号' }),
  contact_person: z.string().nullable().openapi({ example: '佐藤 花子', description: '担当者名' }),
  contact_phone: z
    .string()
    .nullable()
    .openapi({ example: '092-000-0001', description: '担当者連絡先' }),
  fc_contract_start_date: z
    .string()
    .nullable()
    .openapi({ example: '2022-04-01', description: 'FC契約開始日' }),
  fc_contract_renewal_date: z
    .string()
    .nullable()
    .openapi({ example: '2025-04-01', description: 'FC契約更新日' }),
  royalty_rate: z.number().nullable().openapi({ example: 5, description: 'ロイヤリティ率(%)' }),
  note: z.string().nullable().openapi({ description: '備考' }),
  created_at: z.string().openapi({ example: '2026-06-23T09:00:00.000Z', description: '作成日時' }),
  updated_at: z.string().openapi({ example: '2026-06-23T09:00:00.000Z', description: '更新日時' }),
}).openapi({
  title: 'FranchiseCompanyDetail',
  description: 'FC企業詳細',
});

export const GetFranchiseCompaniesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(25),
    search: z.string().optional().openapi({ description: '法人名で検索' }),
    company_type: FranchiseCompanyTypeSchema.optional(),
    status: FranchiseCompanyStatusSchema.optional(),
    sort_by: z.enum(['id', 'display_name']).default('id'),
    sort_order: z.enum(['asc', 'desc']).default('asc'),
  })
  .openapi({
    title: 'GetFranchiseCompaniesQuery',
    description: 'FC企業一覧取得クエリ',
  });

export const GetFranchiseCompaniesResponseSchema = z
  .object({
    franchise_companies: z.array(FranchiseCompanyListItemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
    }),
  })
  .openapi({
    title: 'GetFranchiseCompaniesResponse',
    description: 'FC企業一覧レスポンス',
  });

const DATE_VALUE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const CreateFranchiseCompanyBodySchema = z
  .object({
    formal_name: z.string().min(1, '法人名（正式名称）は必須です'),
    display_name: z.string().default(''),
    type: FranchiseCompanyTypeSchema.openapi({ description: '直営 / FC 区分' }),
    direct_owned_flag: z.boolean().default(false).openapi({ description: '直営店フラグ' }),
    corporate_number: z.string().nullable().optional().openapi({ description: '法人番号' }),
    representative_name: z.string().nullable().optional().openapi({ description: '代表者名' }),
    head_office_address: z.string().nullable().optional().openapi({ description: '本社所在地' }),
    phone: z.string().nullable().optional().openapi({ description: '電話番号' }),
    contact_person: z.string().nullable().optional().openapi({ description: '担当者名' }),
    contact_phone: z.string().nullable().optional().openapi({ description: '担当者連絡先' }),
    fc_contract_start_date: z
      .string()
      .nullable()
      .optional()
      .refine((value) => value == null || DATE_VALUE_REGEX.test(value), {
        message: 'FC契約開始日はYYYY-MM-DD形式で入力してください',
      })
      .openapi({ description: 'FC契約開始日' }),
    fc_contract_renewal_date: z
      .string()
      .nullable()
      .optional()
      .refine((value) => value == null || DATE_VALUE_REGEX.test(value), {
        message: 'FC契約更新日はYYYY-MM-DD形式で入力してください',
      })
      .openapi({ description: 'FC契約更新日' }),
    royalty_rate: z
      .number()
      .min(0, 'ロイヤリティ率は0以上で入力してください')
      .max(100, 'ロイヤリティ率は100以下で入力してください')
      .nullable()
      .optional()
      .openapi({ description: 'ロイヤリティ率(%)' }),
    note: z.string().nullable().optional().openapi({ description: '備考' }),
    status: FranchiseCompanyStatusSchema.default('active').openapi({ description: 'ステータス' }),
  })
  .superRefine((value, ctx) => {
    if (
      value.fc_contract_start_date &&
      value.fc_contract_renewal_date &&
      value.fc_contract_renewal_date < value.fc_contract_start_date
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fc_contract_renewal_date'],
        message: 'FC契約更新日は開始日以降の日付を指定してください',
      });
    }
  })
  .openapi({
    title: 'CreateFranchiseCompanyBody',
    description: 'FC企業作成リクエスト',
  });

export const CreateFranchiseCompanyResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'FC企業を作成しました' }),
    franchise_company: FranchiseCompanyDetailSchema,
  })
  .openapi({
    title: 'CreateFranchiseCompanyResponse',
    description: 'FC企業作成レスポンス',
  });

export type FranchiseCompanyListItem = z.infer<typeof FranchiseCompanyListItemSchema>;
export type FranchiseCompanyDetail = z.infer<typeof FranchiseCompanyDetailSchema>;
export type GetFranchiseCompaniesQuery = z.infer<typeof GetFranchiseCompaniesQuerySchema>;
export type GetFranchiseCompaniesResponse = z.infer<typeof GetFranchiseCompaniesResponseSchema>;
export type FranchiseCompanyType = z.infer<typeof FranchiseCompanyTypeSchema>;
export type FranchiseCompanyStatus = z.infer<typeof FranchiseCompanyStatusSchema>;
export type CreateFranchiseCompanyBody = z.infer<typeof CreateFranchiseCompanyBodySchema>;
export type CreateFranchiseCompanyResponse = z.infer<typeof CreateFranchiseCompanyResponseSchema>;
