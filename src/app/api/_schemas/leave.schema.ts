import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// ─── Enum Schemas ────────────────────────────────────────────────────────────

export const LeaveTypeSchema = z.enum(['suspension', 'withdrawal']).openapi({
  title: 'LeaveType',
  description: 'Leave type: suspension=休会, withdrawal=退会',
});

export const LeaveStatusSchema = z
  .enum([
    'suspension_scheduled',
    'suspended',
    'withdrawal_scheduled',
    'withdrawal_pending',
    'completed',
  ])
  .openapi({
    title: 'LeaveStatus',
    description:
      'Leave status: suspension_scheduled=休会予定, suspended=休会中, withdrawal_scheduled=退会予定, withdrawal_pending=退会処理待ち, completed=処理完了',
  });

export type LeaveType = z.infer<typeof LeaveTypeSchema>;
export type LeaveStatus = z.infer<typeof LeaveStatusSchema>;

// ─── List Item Schema ─────────────────────────────────────────────────────────

export const LeaveListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'LV-001', description: '申請ID' }),
    member_id: z.string().openapi({ example: 'M-00101', description: '会員ID' }),
    member_name: z.string().openapi({ example: '田中 次郎', description: '会員名' }),
    brand: z.string().openapi({ example: 'JOYFIT', description: 'ブランド' }),
    store_id: z.string().openapi({ example: 'store-006', description: '店舗ID' }),
    store_name: z.string().openapi({ example: 'JOYFIT24新宿店', description: '店舗名' }),
    type: LeaveTypeSchema,
    status: LeaveStatusSchema,
    applied_at: z.string().openapi({ example: '2026/03/20', description: '申請日' }),
    scheduled_date: z
      .string()
      .openapi({ example: '2026/04', description: '予定日（休会開始日/退会予定日）' }),
    end_date: z
      .string()
      .nullable()
      .openapi({ example: '2026/06', description: '終了日（休会終了月）' }),
    unpaid_amount: z.number().openapi({ example: 0, description: '未納金額（円）' }),
  })
  .openapi({ title: 'LeaveListItem' });

export type LeaveListItem = z.infer<typeof LeaveListItemSchema>;

// ─── Query Schema ─────────────────────────────────────────────────────────────

export const GetLeavesQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 1))
      .pipe(z.number().int().min(1))
      .openapi({ example: '1', description: 'ページ番号' }),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 20))
      .pipe(z.number().int().min(1).max(100))
      .openapi({ example: '20', description: '1ページあたりの件数' }),
    search: z
      .string()
      .optional()
      .openapi({ example: 'LV-001', description: '申請ID・会員名で検索' }),
    type: LeaveTypeSchema.optional().openapi({ description: '種別フィルター' }),
    status: LeaveStatusSchema.optional().openapi({ description: 'ステータスフィルター' }),
    brand: z.string().optional().openapi({ description: 'ブランドフィルター' }),
    store_id: z.string().optional().openapi({ description: '店舗IDフィルター' }),
    scheduled_period: z
      .enum(['current_month', 'next_month', 'current_year'])
      .optional()
      .openapi({ description: '予定期間フィルター' }),
    sort_by: z
      .enum(['id', 'applied_at', 'scheduled_date'])
      .optional()
      .openapi({ description: 'ソートフィールド' }),
    sort_order: z.enum(['asc', 'desc']).optional().openapi({ description: 'ソート順' }),
  })
  .openapi({ title: 'GetLeavesQuery' });

export type GetLeavesQuery = z.infer<typeof GetLeavesQuerySchema>;

// ─── Response Schema ──────────────────────────────────────────────────────────

export const GetLeavesResponseSchema = z
  .object({
    leaves: z.array(LeaveListItemSchema),
    total: z.number().openapi({ example: 8 }),
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 20 }),
    total_pages: z.number().openapi({ example: 1 }),
  })
  .openapi({ title: 'GetLeavesResponse' });

export type GetLeavesResponse = z.infer<typeof GetLeavesResponseSchema>;

export const ErrorResponseSchema = z
  .object({ error: z.string() })
  .openapi({ title: 'LeaveErrorResponse' });
