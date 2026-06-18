import { z } from 'zod';

export const VisitExperienceStatusSchema = z.enum([
  'application_received',
  'info_missing',
  'bl_checking',
  'visiting',
  'visit_completed',
  'membership_applied',
  'cancelled',
]);

export const VisitExperienceSchema = z.object({
  id: z.string(),
  customer_name: z.string(),
  status: VisitExperienceStatusSchema,
  bl_match: z.boolean(),
  brand_name: z.string(),
  store_name: z.string(),
  reserved_at: z.string().datetime({ offset: true }),
  visit_start_at: z.string().datetime({ offset: true }).nullable(),
  visit_end_scheduled_at: z.string().datetime({ offset: true }),
  visit_end_actual_at: z.string().datetime({ offset: true }).nullable(),
});

export const GetVisitExperiencesQuerySchema = z.object({
  search: z.string().optional(),
  status: VisitExperienceStatusSchema.optional(),
  brand_name: z.string().optional(),
  store_name: z.string().optional(),
  date_range: z.enum(['today', 'last_3_days', 'last_7_days']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .refine((v) => [25, 50, 100, 200].includes(v))
    .default(50),
});

export const GetVisitExperiencesResponseSchema = z.object({
  items: z.array(VisitExperienceSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  limit: z.number().int(),
  total_pages: z.number().int().nonnegative(),
});

export const GetVisitExperiencesSummaryResponseSchema = z.object({
  today_applications: z.number().int().nonnegative(),
  visiting_count: z.number().int().nonnegative(),
  today_membership_count: z.number().int().nonnegative(),
  today_cancelled_count: z.number().int().nonnegative(),
});

export type VisitExperience = z.infer<typeof VisitExperienceSchema>;
export type GetVisitExperiencesQuery = z.infer<typeof GetVisitExperiencesQuerySchema>;
export type GetVisitExperiencesResponse = z.infer<typeof GetVisitExperiencesResponseSchema>;
export type GetVisitExperiencesSummaryResponse = z.infer<
  typeof GetVisitExperiencesSummaryResponseSchema
>;
