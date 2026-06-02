import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { ErrorResponseSchema } from './auth.schema';
import { StoreListBrandSchema } from './store.schema';

extendZodWithOpenApi(z);

export const CampaignAcceptStatusSchema = z.enum(['active', 'inactive']).openapi({
  title: 'CampaignAcceptStatus',
  description: 'Campaign acceptance availability',
});

export const CampaignListItemSchema = z
  .object({
    id: z.string().openapi({ example: 'CP001', description: 'Campaign ID' }),
    name: z.string().openapi({ example: '春の入会キャンペーン', description: 'Campaign name' }),
    code: z.string().openapi({ example: 'STR01-A1B2C', description: 'Campaign code' }),
    brand: StoreListBrandSchema.openapi({ description: 'Brand' }),
    recruitment_period_start: z
      .string()
      .openapi({ example: '2026/03/01', description: 'Recruitment period start date' }),
    recruitment_period_end: z
      .string()
      .openapi({ example: '2026/04/30', description: 'Recruitment period end date' }),
    accept_status: CampaignAcceptStatusSchema.openapi({ description: 'Acceptance status' }),
    main_contract_name: z
      .string()
      .openapi({ example: 'レギュラー会員', description: 'Linked main contract name' }),
  })
  .openapi({
    title: 'CampaignListItem',
    description: 'Campaign master list item',
  });

export const GetCampaignsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(20),
    search: z.string().optional().openapi({ description: 'Search by campaign name, ID, or code' }),
    brand: StoreListBrandSchema.optional(),
    accept_status: CampaignAcceptStatusSchema.optional(),
    recruitment_period_start: z.string().optional().openapi({
      description: 'Recruitment period start date (YYYY-MM-DD)',
    }),
    recruitment_period_end: z.string().optional().openapi({
      description: 'Recruitment period end date (YYYY-MM-DD)',
    }),
    sort_by: z
      .enum([
        'id',
        'name',
        'code',
        'brand',
        'recruitment_period_start',
        'recruitment_period_end',
        'accept_status',
        'main_contract_name',
      ])
      .default('id'),
    sort_order: z.enum(['asc', 'desc']).default('asc'),
  })
  .openapi({
    title: 'GetCampaignsQuery',
    description: 'Campaign master list query',
  });

export const GetCampaignsResponseSchema = z
  .object({
    campaigns: z.array(CampaignListItemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      total_pages: z.number(),
    }),
  })
  .openapi({
    title: 'GetCampaignsResponse',
    description: 'Campaign master list response',
  });

export type CampaignAcceptStatus = z.infer<typeof CampaignAcceptStatusSchema>;
export type CampaignListItem = z.infer<typeof CampaignListItemSchema>;
export type GetCampaignsQuery = z.infer<typeof GetCampaignsQuerySchema>;
export type GetCampaignsResponse = z.infer<typeof GetCampaignsResponseSchema>;

export { ErrorResponseSchema };
