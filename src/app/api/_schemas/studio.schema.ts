import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const StudioTypeSchema = z
  .enum(['studio-lesson', 'pt', 'body-care'])
  .openapi({ example: 'studio-lesson' });

export const BrandSchema = z
  .enum(['joyfit', 'joyfit24', 'joyfit_yoga', 'joyfit_plus', 'fit365'])
  .openapi({ example: 'joyfit' });

export const StudioStatusSchema = z.enum(['active', 'inactive']).openapi({ example: 'active' });

export const StudioListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'STU-001', description: 'スタジオID' }),
    name: z.string().min(1).max(100).openapi({ example: 'スタジオA' }),
    store_id: z.string().openapi({ example: 'store-001' }),
    store_name: z.string().openapi({ example: '渋谷店' }),
    studio_type: StudioTypeSchema,
    capacity: z.number().int().min(1).max(1000).openapi({ example: 30 }),
    available_hours: z.string().openapi({ example: '10:00–21:00' }),
    brand: BrandSchema,
    status: StudioStatusSchema,
  })
  .openapi({ title: 'StudioListItem', description: 'スタジオ一覧アイテム' });

export const StudioListResponseSchema = z
  .object({
    items: z.array(StudioListItemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int(),
    has_next: z.boolean(),
  })
  .openapi({ title: 'StudioListResponse', description: 'スタジオ一覧レスポンス' });

export const GetStudiosQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce
      .number()
      .int()
      .refine((v) => [25, 50, 100, 200].includes(v), 'Must be 25, 50, 100, or 200')
      .default(50)
      .openapi({ example: 50 }),
    search: z.string().optional().openapi({ description: 'スタジオ名で検索（部分一致）' }),
    store_id: z.string().optional().openapi({ description: '店舗IDでフィルタ' }),
    studio_type: StudioTypeSchema.optional().openapi({ description: 'スタジオ区分でフィルタ' }),
    brand: BrandSchema.optional().openapi({ description: 'ブランドでフィルタ' }),
    status: StudioStatusSchema.optional().openapi({ description: 'ステータスでフィルタ' }),
    sort_by: z
      .enum(['id', 'name', 'store_name', 'studio_type', 'capacity'])
      .default('id')
      .openapi({ description: 'ソート項目' }),
    sort_order: z.enum(['asc', 'desc']).default('asc').openapi({ description: 'ソート順' }),
  })
  .openapi({ title: 'GetStudiosQuery', description: 'スタジオ一覧クエリパラメータ' });

export type StudioListItem = z.infer<typeof StudioListItemSchema>;
export type StudioListResponse = z.infer<typeof StudioListResponseSchema>;
export type GetStudiosQuery = z.infer<typeof GetStudiosQuerySchema>;
