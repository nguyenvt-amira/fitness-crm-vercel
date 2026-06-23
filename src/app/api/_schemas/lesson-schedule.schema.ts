import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ErrorResponseSchema } from './auth.schema';

extendZodWithOpenApi(z);

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const LessonTypeSchema = z
  .enum(['studio', 'personal'])
  .openapi({ title: 'LessonType', description: 'レッスン種別（スタジオ/パーソナル）' });

export const LessonScheduleStatusSchema = z
  .enum(['scheduled', 'in_progress', 'completed', 'cancelled'])
  .openapi({
    title: 'LessonScheduleStatus',
    description: 'レッスンスケジュールステータス',
  });

export const PaymentStatusSchema = z
  .enum(['paid', 'unpaid', 'partial'])
  .openapi({ title: 'PaymentStatus', description: '支払いステータス' });

export const ScheduleAxisSchema = z
  .enum(['store', 'my_schedule'])
  .openapi({ title: 'ScheduleAxis', description: '表示軸（店舗/マイスケジュール）' });

export const ScheduleViewModeSchema = z
  .enum(['day', 'week', 'list'])
  .openapi({ title: 'ScheduleViewMode', description: '表示モード（日/週/リスト）' });

export const ScheduleSortBySchema = z
  .enum(['start_time', 'lesson_name', 'studio_name', 'instructor_name', 'booked_count', 'status'])
  .openapi({ title: 'ScheduleSortBy', description: 'ソートキー' });

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export const BookedMemberSchema = z
  .object({
    member_id: z.string().openapi({ example: 'M001', description: '会員ID' }),
    name: z.string().openapi({ example: '山田 太郎', description: '会員氏名' }),
  })
  .openapi({ title: 'BookedMember', description: '予約会員' });

export const LessonScheduleListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'LS001', description: 'スケジュールID' }),
    lesson_name: z.string().openapi({ example: 'ヨガ入門', description: 'レッスン名' }),
    lesson_type: LessonTypeSchema,
    studio_name: z.string().nullable().openapi({ example: 'スタジオA', description: 'スタジオ名' }),
    instructor_id: z.string().openapi({ example: 'S001', description: 'インストラクターID' }),
    instructor_name: z
      .string()
      .openapi({ example: '田中 花子', description: 'インストラクター名' }),
    store_id: z.string().openapi({ example: 'ST001', description: '店舗ID' }),
    store_name: z.string().openapi({ example: '渋谷店', description: '店舗名' }),
    start_time: z
      .string()
      .openapi({ example: '2026-06-22T09:00:00+09:00', description: '開始時刻 ISO8601' }),
    end_time: z
      .string()
      .openapi({ example: '2026-06-22T10:00:00+09:00', description: '終了時刻 ISO8601' }),
    capacity: z.number().int().nonnegative().openapi({ example: 20, description: '定員' }),
    booked_count: z.number().int().nonnegative().openapi({ example: 15, description: '予約数' }),
    waiting_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 2, description: 'キャンセル待ち数' }),
    payment_status: PaymentStatusSchema,
    status: LessonScheduleStatusSchema,
    is_alert: z.boolean().openapi({ example: false, description: '要対応アラート' }),
    booked_members: z
      .array(BookedMemberSchema)
      .optional()
      .openapi({ description: '予約会員リスト（my_schedule軸のみ）' }),
  })
  .openapi({ title: 'LessonScheduleListItem', description: 'レッスンスケジュール一覧アイテム' });

export const LessonScheduleKpiSummarySchema = z
  .object({
    date: z.string().openapi({ example: '2026-06-22', description: '対象日付' }),
    total_lessons: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 24, description: '本日のレッスン総数' }),
    total_booked: z.number().int().nonnegative().openapi({ example: 180, description: '予約総数' }),
    total_capacity: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 240, description: '定員総数' }),
    occupancy_rate: z.number().nonnegative().openapi({ example: 75.0, description: '稼働率（%）' }),
    alert_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 3, description: 'アラート件数' }),
    cancelled_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 1, description: 'キャンセル数' }),
  })
  .openapi({ title: 'LessonScheduleKpiSummary', description: 'レッスンKPIサマリー' });

export const StoreScheduleSummarySchema = z
  .object({
    store_id: z.string().openapi({ example: 'ST001', description: '店舗ID' }),
    store_name: z.string().openapi({ example: '渋谷店', description: '店舗名' }),
    area: z.string().openapi({ example: '東京', description: 'エリア' }),
    total_lessons: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 8, description: '本日のレッスン数' }),
    total_booked: z.number().int().nonnegative().openapi({ example: 60, description: '予約数' }),
    total_capacity: z.number().int().nonnegative().openapi({ example: 80, description: '定員' }),
    occupancy_rate: z.number().nonnegative().openapi({ example: 75.0, description: '稼働率（%）' }),
    alert_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 1, description: 'アラート件数' }),
  })
  .openapi({ title: 'StoreScheduleSummary', description: '店舗別スケジュールサマリー' });

export const AreaScheduleKpiSummarySchema = z
  .object({
    area: z.string().openapi({ example: '東京', description: 'エリア名' }),
    total_lessons: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 20, description: 'エリアレッスン総数' }),
    total_booked: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 150, description: 'エリア予約総数' }),
    total_capacity: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 200, description: 'エリア定員総数' }),
    occupancy_rate: z
      .number()
      .nonnegative()
      .openapi({ example: 75.0, description: 'エリア稼働率（%）' }),
    alert_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 2, description: 'エリアアラート件数' }),
    store_count: z
      .number()
      .int()
      .nonnegative()
      .openapi({ example: 3, description: 'エリア内店舗数' }),
  })
  .openapi({ title: 'AreaScheduleKpiSummary', description: 'エリア別KPIサマリー' });

export const ScheduleChangeDraftSchema = z
  .object({
    new_instructor_id: z.string().optional().openapi({ description: '変更後インストラクターID' }),
    new_start_time: z.string().optional().openapi({ description: '変更後開始時刻 ISO8601' }),
    new_end_time: z.string().optional().openapi({ description: '変更後終了時刻 ISO8601' }),
    reason: z.string().optional().openapi({ description: '変更理由' }),
  })
  .openapi({ title: 'ScheduleChangeDraft', description: 'スケジュール変更リクエスト' });

// ---------------------------------------------------------------------------
// Query params
// ---------------------------------------------------------------------------

export const GetLessonSchedulesQuerySchema = z
  .object({
    date: z
      .string()
      .optional()
      .openapi({ example: '2026-06-22', description: '対象日付 YYYY-MM-DD' }),
    week_start: z
      .string()
      .optional()
      .openapi({ example: '2026-06-22', description: '週開始日 YYYY-MM-DD（週表示時）' }),
    store_id: z.string().optional().openapi({ description: '店舗IDフィルター' }),
    studio_name: z.string().optional().openapi({ description: 'スタジオ名フィルター' }),
    instructor_id: z.string().optional().openapi({ description: 'インストラクターIDフィルター' }),
    axis: ScheduleAxisSchema.optional(),
    sort_by: ScheduleSortBySchema.optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
  })
  .openapi({ title: 'GetLessonSchedulesQuery', description: 'レッスンスケジュール取得クエリ' });

export const GetStoreSummaryQuerySchema = z
  .object({
    date: z.string().optional().openapi({ description: '対象日付 YYYY-MM-DD' }),
    sort_by: z
      .enum(['store_name', 'total_lessons', 'occupancy_rate', 'alert_count'])
      .optional()
      .openapi({ description: '店舗サマリーソートキー' }),
    sort_order: z.enum(['asc', 'desc']).optional(),
  })
  .openapi({ title: 'GetStoreSummaryQuery', description: '店舗サマリー取得クエリ' });

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export const GetLessonSchedulesResponseSchema = z
  .object({
    schedules: z.array(LessonScheduleListItemSchema),
    total: z.number().int().nonnegative(),
  })
  .openapi({
    title: 'GetLessonSchedulesResponse',
    description: 'レッスンスケジュール一覧レスポンス',
  });

export const GetLessonScheduleKpiSummaryResponseSchema = z
  .object({
    kpi: LessonScheduleKpiSummarySchema,
  })
  .openapi({ title: 'GetLessonScheduleKpiSummaryResponse', description: 'KPIサマリーレスポンス' });

export const GetStoreSummaryResponseSchema = z
  .object({
    areas: z.array(AreaScheduleKpiSummarySchema),
    stores: z.array(StoreScheduleSummarySchema),
    total: z.number().int().nonnegative(),
  })
  .openapi({ title: 'GetStoreSummaryResponse', description: '店舗別サマリーレスポンス' });

export const ScheduleChangeResponseSchema = z
  .object({
    message: z
      .string()
      .openapi({ example: 'スケジュールを変更しました', description: '完了メッセージ' }),
    id: z.string().openapi({ example: 'LS001', description: 'スケジュールID' }),
  })
  .openapi({ title: 'ScheduleChangeResponse', description: 'スケジュール変更レスポンス' });

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type LessonType = z.infer<typeof LessonTypeSchema>;
export type LessonScheduleStatus = z.infer<typeof LessonScheduleStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type ScheduleAxis = z.infer<typeof ScheduleAxisSchema>;
export type ScheduleViewMode = z.infer<typeof ScheduleViewModeSchema>;
export type ScheduleSortBy = z.infer<typeof ScheduleSortBySchema>;
export type BookedMember = z.infer<typeof BookedMemberSchema>;
export type LessonScheduleListItem = z.infer<typeof LessonScheduleListItemSchema>;
export type LessonScheduleKpiSummary = z.infer<typeof LessonScheduleKpiSummarySchema>;
export type StoreScheduleSummary = z.infer<typeof StoreScheduleSummarySchema>;
export type AreaScheduleKpiSummary = z.infer<typeof AreaScheduleKpiSummarySchema>;
export type ScheduleChangeDraft = z.infer<typeof ScheduleChangeDraftSchema>;
export type GetLessonSchedulesQuery = z.infer<typeof GetLessonSchedulesQuerySchema>;
export type GetStoreSummaryQuery = z.infer<typeof GetStoreSummaryQuerySchema>;
export type GetLessonSchedulesResponse = z.infer<typeof GetLessonSchedulesResponseSchema>;
export type GetLessonScheduleKpiSummaryResponse = z.infer<
  typeof GetLessonScheduleKpiSummaryResponseSchema
>;
export type GetStoreSummaryResponse = z.infer<typeof GetStoreSummaryResponseSchema>;
export type ScheduleChangeResponse = z.infer<typeof ScheduleChangeResponseSchema>;

export { ErrorResponseSchema };
