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

export type FranchiseCompanyListItem = z.infer<typeof FranchiseCompanyListItemSchema>;
export type GetFranchiseCompaniesQuery = z.infer<typeof GetFranchiseCompaniesQuerySchema>;
export type GetFranchiseCompaniesResponse = z.infer<typeof GetFranchiseCompaniesResponseSchema>;
export type FranchiseCompanyType = z.infer<typeof FranchiseCompanyTypeSchema>;
export type FranchiseCompanyStatus = z.infer<typeof FranchiseCompanyStatusSchema>;
