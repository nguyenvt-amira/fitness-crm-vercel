import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// ─── Enum Schemas ─────────────────────────────────────────────────────────────

export const TransferStatusSchema = z
  .enum(['pending', 'from_store_approved', 'approved', 'rejected', 'completed'])
  .openapi({
    title: 'TransferStatus',
    description:
      'Transfer request status: pending=申請中, from_store_approved=店舗承認済, approved=承認済, rejected=却下, completed=移籍完了',
  });

export const TransferBrandSchema = z.enum(['joyfit', 'fit365']).openapi({
  title: 'TransferBrand',
  description: 'Brand of the member contract: joyfit=JOYFIT, fit365=FIT365',
});

// ─── Entity Schema ────────────────────────────────────────────────────────────

export const TransferRequestSchema = z
  .object({
    id: z.string().openapi({ example: 'TR-001', description: '移籍申請ID' }),
    member_id: z.string().openapi({ example: 'M-12345', description: '会員ID' }),
    member_name: z.string().openapi({ example: '山田 太郎', description: '会員氏名' }),
    from_store_id: z.string().openapi({ example: 'store-001', description: '移籍元店舗ID' }),
    from_store_name: z.string().openapi({ example: 'JOYFIT池袋店', description: '移籍元店舗名' }),
    to_store_id: z.string().openapi({ example: 'store-002', description: '移籍先店舗ID' }),
    to_store_name: z.string().openapi({ example: 'JOYFIT新宿店', description: '移籍先店舗名' }),
    brand: TransferBrandSchema,
    applied_at: z
      .string()
      .openapi({ example: '2026-04-15T10:30:00Z', description: '申請日時 (ISO 8601)' }),
    scheduled_date: z
      .string()
      .openapi({ example: '2026-05-01T00:00:00Z', description: '移籍予定日 (ISO 8601)' }),
    status: TransferStatusSchema,
  })
  .openapi({ title: 'TransferRequest', description: '移籍申請レコード' });

export type TransferRequest = z.infer<typeof TransferRequestSchema>;

// ─── Query Schema ─────────────────────────────────────────────────────────────

export const GetTransfersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1).openapi({
      description: 'ページ番号',
      example: 1,
    }),
    limit: z.coerce.number().int().positive().optional().default(20).openapi({
      description: '1ページあたりの件数',
      example: 20,
    }),
    search: z.string().optional().openapi({ description: '申請ID・会員名の検索文字列' }),
    status: TransferStatusSchema.optional().openapi({ description: 'ステータスフィルター' }),
    from_store_id: z.string().optional().openapi({ description: '移籍元店舗IDフィルター' }),
    to_store_id: z.string().optional().openapi({ description: '移籍先店舗IDフィルター' }),
    brand: TransferBrandSchema.optional().openapi({ description: 'ブランドフィルター' }),
    applied_period: z
      .enum(['this_month', 'last_month', 'this_year'])
      .optional()
      .openapi({ description: '申請日期間フィルター' }),
    sort_by: z
      .string()
      .optional()
      .default('applied_at')
      .openapi({ description: 'ソートカラム', example: 'applied_at' }),
    sort_order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc')
      .openapi({ description: 'ソート順', example: 'desc' }),
  })
  .openapi({ title: 'GetTransfersQuery' });

export type GetTransfersQuery = z.infer<typeof GetTransfersQuerySchema>;

// ─── Response Schema ──────────────────────────────────────────────────────────

export const TransferPaginationSchema = z
  .object({
    page: z.number().int().openapi({ example: 1 }),
    limit: z.number().int().openapi({ example: 20 }),
    total: z.number().int().openapi({ example: 42 }),
    total_pages: z.number().int().openapi({ example: 3 }),
  })
  .openapi({ title: 'TransferPagination' });

export const GetTransfersResponseSchema = z
  .object({
    transfers: z.array(TransferRequestSchema),
    pagination: TransferPaginationSchema,
  })
  .openapi({ title: 'GetTransfersResponse', description: '移籍申請一覧レスポンス' });

export type GetTransfersResponse = z.infer<typeof GetTransfersResponseSchema>;

// ─── Error Schema (re-export for convenience) ─────────────────────────────────

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    details: z.unknown().optional(),
  })
  .openapi({ title: 'ErrorResponse' });
