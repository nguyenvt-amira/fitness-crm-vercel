import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

/**
 * Member Type Schema
 */
export const MemberTypeSchema = z.enum(['regular', 'family', 'corporate', 'one_day_member']);
export const ContractTypeSchema = z.enum(['regular', 'one_day_member', 'family']);

/**
 * Member Status Schema
 */
export const MemberStatusSchema = z.enum([
  'active',
  'suspended',
  'gate_stop',
  'pending_withdrawal',
  'withdrawn',
  'force_withdrawn',
]);

/**
 * Brand Schema
 */
export const BrandSchema = z.enum(['joyfit', 'fit365']);

/**
 * Gender Schema
 */
export const GenderSchema = z.enum(['male', 'female', 'other']).openapi({
  title: 'Gender',
  description: 'Gender',
});

export const CampaignStatusSchema = z
  .enum(['active', 'expired', 'upcoming'])
  .openapi({ title: 'CampaignStatus', description: 'Campaign status' });

/**
 * Member List Item Schema (simplified for list view)
 */
export const MemberListItemSchema = z
  .object({
    id: z.string().openapi({
      example: 'M-00001',
      description: 'Member ID',
    }),
    member_number: z.string().openapi({
      example: 'M-00001',
      description: 'Member number',
    }),
    name_kanji: z.string().openapi({
      example: '佐藤 花子',
      description: 'Name in kanji',
    }),
    name_kana: z.string().openapi({
      example: 'サトウ ハナコ',
      description: 'Name in kana',
    }),
    member_type: MemberTypeSchema.openapi({
      example: 'regular',
      description: 'Member type',
    }),
    contract_type: ContractTypeSchema.openapi({
      example: 'regular',
      description: 'Contract type',
    }),
    status: MemberStatusSchema.openapi({
      example: 'active',
      description: 'Member status',
    }),
    store_name: z.string().openapi({
      example: 'Fit365八潮店',
      description: 'Store name',
    }),
    store_id: z.string().openapi({
      example: 'store-001',
      description: 'Store ID',
    }),
    brand: BrandSchema.openapi({
      example: 'fit365',
      description: 'Brand',
    }),
    contract_plan_name: z.string().openapi({
      example: 'ベーシックプラン',
      description: 'Contract plan name',
    }),
    contract_plan_id: z.string().openapi({
      example: 'plan-001',
      description: 'Contract plan ID',
    }),
    joined_at: z.string().date().openapi({
      example: '2024-01-15',
      description: 'Join date',
    }),
    last_visit_date: z.string().date().optional().openapi({
      example: '2024-12-15',
      description: 'Last visit date',
    }),
    has_unpaid: z.boolean().openapi({
      example: false,
      description: 'Whether member has unpaid fees',
    }),
    phone: z.string().openapi({
      example: '090-1234-5678',
      description: 'Phone number',
    }),
    email: z.string().email().openapi({
      example: 'member00001@example.jp',
      description: 'Email address',
    }),
  })
  .openapi({
    title: 'MemberListItem',
    description: 'Member information for list view',
  });

/**
 * Pagination Schema (reused from membership-application)
 */
export const PaginationSchema = z
  .object({
    page: z.number().openapi({
      example: 1,
      description: 'Current page number',
    }),
    limit: z.number().openapi({
      example: 50,
      description: 'Items per page',
    }),
    total: z.number().openapi({
      example: 200,
      description: 'Total number of items',
    }),
    total_pages: z.number().openapi({
      example: 4,
      description: 'Total number of pages',
    }),
  })
  .openapi({
    title: 'Pagination',
    description: 'Pagination information',
  });

/**
 * Get Members Query Schema
 */
export const GetMembersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1).openapi({
      example: 1,
      description: 'Page number',
    }),
    limit: z.coerce.number().int().positive().optional().default(50).openapi({
      example: 50,
      description: 'Items per page',
    }),
    search: z.string().optional().openapi({
      example: '佐藤',
      description: 'Search query (name, member number, phone, email)',
    }),
    contract_type: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [val];
      },
      z
        .array(ContractTypeSchema)
        .optional()
        .openapi({
          example: ['regular', 'family'],
          description: 'Filter by contract type (array)',
        }),
    ),
    status: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [val];
      },
      z
        .array(MemberStatusSchema)
        .optional()
        .openapi({
          example: ['active', 'suspended'],
          description: 'Filter by status (array)',
        }),
    ),
    brand: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [val];
      },
      z
        .array(BrandSchema)
        .optional()
        .openapi({
          example: ['joyfit', 'fit365'],
          description: 'Filter by brand (array)',
        }),
    ),
    store_id: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [val];
      },
      z
        .array(z.string())
        .optional()
        .openapi({
          example: ['store-001', 'store-002'],
          description: 'Filter by store ID (array)',
        }),
    ),
    contract_plan_id: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [val];
      },
      z
        .array(z.string())
        .optional()
        .openapi({
          example: ['plan-001', 'plan-002'],
          description: 'Filter by contract plan ID (array)',
        }),
    ),
    last_visit_days: z.coerce.number().int().optional().openapi({
      example: 30,
      description: 'Filter by last visit days (-1 for 3+ months)',
    }),
    has_unpaid: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === '') return undefined;
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') {
          if (val === 'true') return true;
          if (val === 'false') return false;
          return undefined;
        }
        return undefined;
      },
      z.boolean().optional().openapi({
        example: true,
        description: 'Filter by unpaid status',
      }),
    ),
    sort_by: z
      .enum(['member_number', 'joined_at', 'last_visit_date', 'name'])
      .optional()
      .default('member_number')
      .openapi({
        example: 'member_number',
        description: 'Sort field',
      }),
    sort_order: z.enum(['asc', 'desc']).optional().default('asc').openapi({
      example: 'asc',
      description: 'Sort order',
    }),
  })
  .openapi({
    title: 'GetMembersQuery',
    description: 'Query parameters for getting members',
  });

/**
 * Get Members Response Schema
 */
export const GetMembersResponseSchema = z
  .object({
    members: z.array(MemberListItemSchema).openapi({
      description: 'List of members',
    }),
    pagination: PaginationSchema.openapi({
      description: 'Pagination information',
    }),
  })
  .openapi({
    title: 'GetMembersResponse',
    description: 'Response for getting members list',
  });

/**
 * Members list / dashboard summary (aggregated KPIs)
 */
export const GetMembersSummaryResponseSchema = z
  .object({
    active_count: z.number().int().nonnegative().openapi({
      example: 1250,
      description: 'Number of active members',
    }),
    active_change_percent: z.number().openapi({
      example: 2.4,
      description: 'Month-over-month change in active members (percent)',
    }),
    suspended_count: z.number().int().nonnegative().openapi({
      example: 42,
      description: 'Number of suspended members',
    }),
    suspended_percent: z.number().openapi({
      example: 3.2,
      description: 'Suspended members as percent of total',
    }),
    unpaid_count: z.number().int().nonnegative().openapi({
      example: 18,
      description: 'Members with unpaid balance',
    }),
    unpaid_total_yen: z.number().int().nonnegative().openapi({
      example: 245000,
      description: 'Total unpaid amount in yen',
    }),
    scheduled_withdrawal_count: z.number().int().nonnegative().openapi({
      example: 7,
      description: 'Members scheduled to withdraw this month',
    }),
    withdrawal_rate_percent: z.number().openapi({
      example: 1.1,
      description: 'Withdrawal rate (percent)',
    }),
  })
  .openapi({
    title: 'GetMembersSummaryResponse',
    description: 'Summary statistics for the members list page',
  });

/**
 * Get Member Detail Response Schema
 */
export const MemberEmergencyContactSchema = z
  .object({
    name: z.string().openapi({ example: '山田 太郎', description: 'Emergency contact name' }),
    relationship: z.string().openapi({ example: '配偶者', description: 'Relationship to member' }),
    phone: z.string().openapi({ example: '090-0000-0000', description: 'Emergency contact phone' }),
  })
  .openapi({
    title: 'MemberEmergencyContact',
    description: 'Emergency contact information',
  });

export const MemberBasicInfoSchema = z
  .object({
    id: z.string().openapi({ example: 'M-00001', description: 'Member ID' }),
    member_number: z.string().openapi({ example: 'M-00001', description: 'Member number' }),
    name_kanji: z.string().openapi({ example: '佐藤 花子', description: 'Name in kanji' }),
    name_kana: z.string().openapi({ example: 'サトウ ハナコ', description: 'Name in kana' }),
    birthday: z.string().openapi({ example: '1990-01-01', description: 'Birthday (ISO date)' }),
    age: z.number().int().openapi({ example: 35, description: 'Age' }),
    gender: GenderSchema.openapi({ example: 'female', description: 'Gender' }),
    postal_code: z.string().optional().openapi({ example: '1500002', description: 'Postal code' }),
    prefecture: z.string().optional().openapi({ example: '東京都', description: 'Prefecture' }),
    city: z.string().optional().openapi({ example: '渋谷区', description: 'City' }),
    address: z.string().optional().openapi({ example: '渋谷1-2-3', description: 'Address' }),
    building: z
      .string()
      .optional()
      .openapi({ example: 'サンプルマンション101', description: 'Building' }),
    phone: z.string().openapi({ example: '090-1234-5678', description: 'Phone number' }),
    email: z
      .string()
      .email()
      .openapi({ example: 'member00001@example.jp', description: 'Email address' }),
    emergency_contact: MemberEmergencyContactSchema.optional().openapi({
      description: 'Emergency contact information',
    }),
  })
  .openapi({
    title: 'MemberBasicInfo',
    description: 'Basic member information',
  });

export const MemberProfileSchema = z
  .object({
    member_type: MemberTypeSchema.openapi({ example: 'regular', description: 'Member type' }),
    status: MemberStatusSchema.openapi({ example: 'active', description: 'Member status' }),
    store_id: z.string().openapi({ example: 'store-001', description: 'Store ID' }),
    store_name: z.string().openapi({ example: 'Fit365八潮店', description: 'Store name' }),
    brand: BrandSchema.openapi({ example: 'fit365', description: 'Brand' }),
    joined_at: z.string().openapi({ example: '2024-01-15', description: 'Join date (ISO date)' }),
    withdrawn_at: z.string().optional().openapi({
      example: '2025-02-01',
      description: 'Withdrawal date (ISO date)',
    }),
    is_black_listed: z.boolean().openapi({ example: false, description: 'Blacklisted status' }),
  })
  .openapi({
    title: 'MemberProfile',
    description: 'Member profile',
  });

export const MemberEKYCSchema = z
  .object({
    verified: z.boolean().openapi({ example: true, description: 'Whether eKYC is verified' }),
    verified_at: z.string().optional().openapi({
      example: '2025-01-20T10:00:00.000Z',
      description: 'Verification datetime (ISO)',
    }),
    document_type: z
      .string()
      .optional()
      .openapi({ example: 'driver_license', description: 'Document type' }),
    photoUrl: z
      .string()
      .optional()
      .openapi({ example: 'https://example.com/photo.jpg', description: 'Photo URL' }),
  })
  .openapi({
    title: 'MemberEKYC',
    description: 'eKYC information',
  });

export const MemberConsentSchema = z
  .object({
    member_agreement: z
      .object({
        version: z.string().openapi({ example: '1.0', description: 'Agreement version' }),
        agreed_at: z.string().openapi({
          example: '2025-01-10T10:00:00.000Z',
          description: 'Agreed datetime (ISO)',
        }),
      })
      .openapi({ description: 'Member agreement consent' }),
    privacy_policy: z
      .object({
        version: z.string().openapi({ example: '1.0', description: 'Policy version' }),
        agreed_at: z.string().openapi({
          example: '2025-01-10T10:00:00.000Z',
          description: 'Agreed datetime (ISO)',
        }),
      })
      .openapi({ description: 'Privacy policy consent' }),
    optional_agreement: z
      .object({
        version: z.string().openapi({ example: '1.0', description: 'Optional agreement version' }),
        agreed_at: z.string().openapi({
          example: '2025-01-10T10:00:00.000Z',
          description: 'Agreed datetime (ISO)',
        }),
      })
      .optional()
      .openapi({ description: 'Optional agreement consent' }),
    marketing_consent: z
      .object({
        email: z.boolean().openapi({ example: true, description: 'Email marketing consent' }),
        sms: z.boolean().openapi({ example: false, description: 'SMS marketing consent' }),
        push: z.boolean().openapi({ example: true, description: 'Push marketing consent' }),
      })
      .openapi({ description: 'Marketing consent' }),
  })
  .openapi({
    title: 'MemberConsent',
    description: 'Consent information',
  });

export const MemberHealthInfoSchema = z
  .object({
    health_status: z.string().optional().openapi({ example: '良好', description: 'Health status' }),
    medical_history: z
      .string()
      .optional()
      .openapi({ example: 'なし', description: 'Medical history' }),
    allergies: z.string().optional().openapi({ example: '花粉症', description: 'Allergies' }),
    exercise_restrictions: z.string().optional().openapi({
      example: '膝に負担がかかる運動は避ける',
      description: 'Exercise restrictions',
    }),
    other_notes: z
      .string()
      .optional()
      .openapi({ example: '特記事項なし', description: 'Other notes' }),
  })
  .openapi({
    title: 'MemberHealthInfo',
    description: 'Health information',
  });

export const GetMemberDetailResponseSchema = z
  .object({
    basic_info: MemberBasicInfoSchema.openapi({ description: 'Basic member information' }),
    profile: MemberProfileSchema.openapi({ description: 'Member profile' }),
    ekyc: MemberEKYCSchema.optional().openapi({ description: 'eKYC information' }),
    consent: MemberConsentSchema.optional().openapi({ description: 'Consent information' }),
    health_info: MemberHealthInfoSchema.optional().openapi({
      description: 'Health information',
    }),
  })
  .openapi({
    title: 'GetMemberDetailResponse',
    description: 'Response for getting member detail',
  });

/**
 * Update Basic Info Request Schema
 */
export const UpdateBasicInfoRequestSchema = z
  .object({
    name_kanji: z.string().optional().openapi({
      example: '佐藤 花子',
      description: 'Name in kanji',
    }),
    name_kana: z.string().optional().openapi({
      example: 'サトウ ハナコ',
      description: 'Name in kana',
    }),
    postal_code: z.string().optional().openapi({
      example: '1500002',
      description: 'Postal code',
    }),
    prefecture: z.string().optional().openapi({
      example: '東京都',
      description: 'Prefecture',
    }),
    city: z.string().optional().openapi({
      example: '渋谷区',
      description: 'City',
    }),
    address: z.string().optional().openapi({
      example: '渋谷1-2-3',
      description: 'Address',
    }),
    building: z.string().optional().openapi({
      example: 'サンプルマンション 101',
      description: 'Building name',
    }),
    phone: z.string().optional().openapi({
      example: '09012345678',
      description: 'Phone number',
    }),
    email: z.string().email().optional().openapi({
      example: 'hanako.sato@example.com',
      description: 'Email address',
    }),
    emergency_contact: z
      .object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
      })
      .optional()
      .openapi({
        description: 'Emergency contact information',
      }),
  })
  .openapi({
    title: 'UpdateBasicInfoRequest',
    description: 'Request payload for updating basic info',
  });

/**
 * Update Basic Info Response Schema
 */
export const UpdateBasicInfoResponseSchema = MemberBasicInfoSchema.openapi({
  title: 'UpdateBasicInfoResponse',
  description: 'Response for updating basic info',
});

/**
 * Update Health Info Request Schema
 */
export const UpdateHealthInfoRequestSchema = z
  .object({
    health_status: z.string().optional().openapi({
      example: '良好',
      description: 'Health status',
    }),
    medical_history: z.string().optional().openapi({
      example: '特になし',
      description: 'Medical history',
    }),
    allergies: z.string().optional().openapi({
      example: 'なし',
      description: 'Allergies',
    }),
    exercise_restrictions: z.string().optional().openapi({
      example: '特になし',
      description: 'Exercise restrictions',
    }),
    other_notes: z.string().optional().openapi({
      example: '特記事項なし',
      description: 'Other notes',
    }),
  })
  .openapi({
    title: 'UpdateHealthInfoRequest',
    description: 'Request payload for updating health info',
  });

/**
 * Update Health Info Response Schema
 */
export const UpdateHealthInfoResponseSchema = MemberHealthInfoSchema.openapi({
  title: 'UpdateHealthInfoResponse',
  description: 'Response for updating health info',
});

/**
 * Update Marketing Consent Request Schema
 */
export const UpdateMarketingConsentRequestSchema = z
  .object({
    email: z.boolean().optional().openapi({
      example: true,
      description: 'Email marketing consent',
    }),
    sms: z.boolean().optional().openapi({
      example: false,
      description: 'SMS marketing consent',
    }),
    push: z.boolean().optional().openapi({
      example: true,
      description: 'Push notification consent',
    }),
  })
  .openapi({
    title: 'UpdateMarketingConsentRequest',
    description: 'Request payload for updating marketing consent',
  });

/**
 * Update Marketing Consent Response Schema
 */
export const UpdateMarketingConsentResponseSchema =
  MemberConsentSchema.shape.marketing_consent.openapi({
    title: 'UpdateMarketingConsentResponse',
    description: 'Response for updating marketing consent',
  });

/**
 * Point Adjustment Type Schema
 */
export const PointAdjustmentTypeSchema = z.enum(['add', 'subtract']).openapi({
  title: 'PointAdjustmentType',
  description: 'Adjustment type',
});

/**
 * Point Adjustment Request Schema
 */
export const PointAdjustmentRequestSchema = z
  .object({
    type: PointAdjustmentTypeSchema.openapi({
      example: 'add',
      description: 'Adjustment type',
    }),
    points: z.number().int().positive().openapi({
      example: 100,
      description: 'Number of points',
    }),
    reason: z
      .string()
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason must be at most 500 characters')
      .openapi({
        example: 'キャンペーン漏れ分の手動付与',
        description: 'Reason for adjustment (10-500 characters)',
      }),
  })
  .openapi({
    title: 'PointAdjustmentRequest',
    description: 'Request payload for adjusting points',
  });

/**
 * Point Adjustment Response Schema
 */
export const PointAdjustmentResponseSchema = z
  .object({
    id: z.string().openapi({
      example: 'M-00001',
      description: 'Member ID',
    }),
    adjustment: PointAdjustmentRequestSchema.openapi({
      description: 'Adjustment details',
    }),
  })
  .openapi({
    title: 'PointAdjustmentResponse',
    description: 'Response for adjusting points',
  });

/**
 * Get Points Response Schema (simplified)
 */
export const GetPointsResponseSchema = z
  .object({
    fit365: z.any().optional().openapi({
      description: 'FIT365 points information',
    }),
    joyfit: z.any().optional().openapi({
      description: 'JOYFIT points information',
    }),
    rank: z.any().optional().openapi({
      description: 'Rank information',
    }),
    earn_history: z.array(z.any()).openapi({
      description: 'Earn history',
    }),
    spend_history: z.array(z.any()).openapi({
      description: 'Spend history',
    }),
    adjustment_history: z.array(z.any()).openapi({
      description: 'Adjustment history',
    }),
  })
  .openapi({
    title: 'GetPointsResponse',
    description: 'Response for getting points',
  });

/**
 * Memo Type Schema
 */
export const MemoTypeSchema = z.enum(['caution', 'vip', 'other']).openapi({
  title: 'MemoType',
  description: 'Staff memo type',
});

/**
 * Staff Memo Schema
 */
export const StaffMemoSchema = z
  .object({
    id: z.string().openapi({ example: 'memo-001', description: 'Memo ID' }),
    date: z
      .string()
      .openapi({ example: '2024-11-15T10:00:00Z', description: 'Created date (ISO)' }),
    type: MemoTypeSchema.openapi({ example: 'caution', description: 'Memo type' }),
    content: z.string().openapi({ example: '注意事項があります', description: 'Memo content' }),
    created_by: z.string().openapi({ example: '山田 花子', description: 'Creator name' }),
  })
  .openapi({
    title: 'StaffMemo',
    description: 'Staff memo',
  });

/**
 * Create Memo Request Schema
 */
export const CreateMemoRequestSchema = z
  .object({
    type: MemoTypeSchema.openapi({
      example: 'caution',
      description: 'Memo type',
    }),
    content: z
      .string()
      .min(1, 'Content is required')
      .max(1000, 'Content must be at most 1000 characters')
      .openapi({
        example: '注意事項があります',
        description: 'Memo content (1-1000 characters)',
      }),
    created_by: z.string().optional().openapi({
      example: '山田 花子',
      description: 'Creator name',
    }),
  })
  .openapi({
    title: 'CreateMemoRequest',
    description: 'Request payload for creating a memo',
  });

/**
 * Create Memo Response Schema
 */
export const CreateMemoResponseSchema = StaffMemoSchema.openapi({
  title: 'CreateMemoResponse',
  description: 'Response for creating a memo',
});

/**
 * Update Memo Request Schema
 */
export const UpdateMemoRequestSchema = z
  .object({
    type: MemoTypeSchema.optional().openapi({
      example: 'caution',
      description: 'Memo type',
    }),
    content: z.string().max(1000, 'Content must be at most 1000 characters').optional().openapi({
      example: '更新された注意事項',
      description: 'Memo content (max 1000 characters)',
    }),
  })
  .openapi({
    title: 'UpdateMemoRequest',
    description: 'Request payload for updating a memo',
  });

/**
 * Update Memo Response Schema
 */
export const UpdateMemoResponseSchema = StaffMemoSchema.openapi({
  title: 'UpdateMemoResponse',
  description: 'Response for updating a memo',
});

/**
 * Get Memos Response Schema
 */
export const GetMemosResponseSchema = z
  .object({
    memos: z.array(StaffMemoSchema).openapi({
      description: 'List of memos',
    }),
  })
  .openapi({
    title: 'GetMemosResponse',
    description: 'Response for getting memos',
  });

/**
 * Export Members Request Schema
 */
export const ExportMembersRequestSchema = z
  .object({
    format: z.enum(['csv', 'excel']).openapi({
      example: 'csv',
      description: 'Export format',
    }),
    target: z.enum(['selected', 'filtered']).openapi({
      example: 'selected',
      description: 'Export target',
    }),
    member_ids: z
      .array(z.string())
      .optional()
      .openapi({
        example: ['M-00001', 'M-00002'],
        description: 'Member IDs (for selected target)',
      }),
    fields: z
      .array(z.string())
      .min(1, 'At least one field must be selected')
      .openapi({
        example: ['member_number', 'name_kanji', 'email'],
        description: 'Fields to export',
      }),
  })
  .refine(
    (data) => {
      if (data.target === 'filtered' && data.member_ids && data.member_ids.length > 10000) {
        return false;
      }
      return true;
    },
    {
      message: 'Export limit is 10,000 members',
    },
  )
  .openapi({
    title: 'ExportMembersRequest',
    description: 'Request payload for exporting members',
  });

export const ExportMembersStatusSchema = z
  .enum(['processing', 'completed', 'failed'])
  .openapi({ title: 'ExportMembersStatus', description: 'Export job status' });

/**
 * Export Members Response Schema
 */
export const ExportMembersResponseSchema = z
  .object({
    exportId: z.string().openapi({
      example: 'export-1234567890',
      description: 'Export ID',
    }),
    format: z.enum(['csv', 'excel']).openapi({
      example: 'csv',
      description: 'Export format',
    }),
    status: ExportMembersStatusSchema.openapi({
      example: 'processing',
      description: 'Export status',
    }),
  })
  .openapi({
    title: 'ExportMembersResponse',
    description: 'Response for exporting members',
  });

/**
 * Contract Change Schema
 */
export const ContractChangeSchema = z
  .object({
    changed_at: z.string().openapi({
      example: '2024-01-15T00:00:00+09:00',
      description: 'Change date and time',
    }),
    previous_plan: z.string().openapi({
      example: 'ベーシックプラン',
      description: 'Previous plan name',
    }),
    new_plan: z.string().openapi({
      example: 'スタンダードプラン',
      description: 'New plan name',
    }),
    reason: z.string().optional().openapi({
      example: 'プラン変更希望',
      description: 'Reason for change',
    }),
  })
  .openapi({
    title: 'ContractChange',
    description: 'Contract change history item',
  });

/**
 * Main Contract Schema
 */
export const MainContractSchema = z
  .object({
    plan_name: z.string().openapi({
      example: 'スタンダードプラン',
      description: 'Plan name',
    }),
    monthly_fee: z.number().openapi({
      example: 8580,
      description: 'Monthly fee (tax included)',
    }),
    start_date: z.string().openapi({
      example: '2024-01-15',
      description: 'Contract start date',
    }),
    penalty_period_end: z.string().optional().openapi({
      example: '2025-01-14',
      description: 'Penalty period end date',
    }),
    change_history: z.array(ContractChangeSchema).openapi({
      description: 'Contract change history',
    }),
  })
  .openapi({
    title: 'MainContract',
    description: 'Main contract information',
  });

/**
 * Option Contract Schema
 */
export const OptionContractSchema = z
  .object({
    id: z.string().openapi({
      example: 'opt-001',
      description: 'Option contract ID',
    }),
    name: z.string().openapi({
      example: 'パーソナルトレーニング',
      description: 'Option name',
    }),
    monthly_fee: z.number().openapi({
      example: 11000,
      description: 'Monthly fee',
    }),
    start_date: z.string().openapi({
      example: '2024-02-01',
      description: 'Start date',
    }),
    next_billing_date: z.string().openapi({
      example: '2025-03-01',
      description: 'Next billing date',
    }),
  })
  .openapi({
    title: 'OptionContract',
    description: 'Option contract information',
  });

/**
 * Option Change History Schema
 */
export const OptionChangeHistorySchema = z
  .object({
    changed_at: z.string().openapi({
      example: '2024-02-01T00:00:00+09:00',
      description: 'Change date and time',
    }),
    option_name: z.string().openapi({
      example: 'パーソナルトレーニング',
      description: 'Option name',
    }),
    action_type: z.enum(['add', 'remove']).openapi({
      example: 'add',
      description: 'Action type',
    }),
    notes: z.string().optional().openapi({
      example: 'オプション追加',
      description: 'Notes',
    }),
  })
  .openapi({
    title: 'OptionChangeHistory',
    description: 'Option change history item',
  });

/**
 * Special Contract Item Schema
 */
export const SpecialContractItemSchema = z
  .object({
    enrolled: z.boolean().openapi({
      example: true,
      description: 'Whether enrolled',
    }),
    start_date: z.string().optional().openapi({
      example: '2024-01-15',
      description: 'Start date',
    }),
    applied_month: z.string().optional().openapi({
      example: '2025-03',
      description: 'Applied month (YYYY-MM format)',
    }),
  })
  .openapi({
    title: 'SpecialContractItem',
    description: 'Special contract item',
  });

/**
 * Special Contracts Schema
 */
export const SpecialContractsSchema = z
  .object({
    anshin_support: SpecialContractItemSchema.optional().openapi({
      description: 'Anshin support contract',
    }),
    mutual_use: SpecialContractItemSchema.optional().openapi({
      description: 'Mutual use contract',
    }),
    security_fee: SpecialContractItemSchema.optional().openapi({
      description: 'Security fee contract',
    }),
    maintenance_fee: SpecialContractItemSchema.optional().openapi({
      description: 'Maintenance fee contract',
    }),
  })
  .openapi({
    title: 'SpecialContracts',
    description: 'Special contracts information',
  });

/**
 * Payment Record Schema
 */
export const PaymentRecordSchema = z
  .object({
    date: z.string().openapi({
      example: '2025-02-27',
      description: 'Payment date',
    }),
    amount: z.number().openapi({
      example: 9680,
      description: 'Payment amount',
    }),
    breakdown: z.string().openapi({
      example: '月会費 8,580円 + オプション 1,100円',
      description: 'Payment breakdown',
    }),
    status: z.enum(['success', 'failed']).openapi({
      example: 'success',
      description: 'Payment status',
    }),
    notes: z.string().optional().openapi({
      example: '',
      description: 'Additional notes',
    }),
  })
  .openapi({
    title: 'PaymentRecord',
    description: 'Payment history record',
  });

/**
 * Payment Info Schema
 */
export const PaymentInfoSchema = z
  .object({
    method: z.enum(['credit_card', 'bank_transfer']).openapi({
      example: 'credit_card',
      description: 'Payment method',
    }),
    card_number: z.string().optional().openapi({
      example: '**** **** **** 1234',
      description: 'Masked card number (last 4 digits only)',
    }),
    cardholder_name: z.string().optional().openapi({
      example: 'SATOU HANAKO',
      description: 'Cardholder name',
    }),
    expiry_date: z.string().optional().openapi({
      example: '12/28',
      description: 'Card expiry date',
    }),
    billing_day: z.number().int().min(1).max(31).openapi({
      example: 27,
      description: 'Billing day of month',
    }),
    last_payment_date: z.string().optional().openapi({
      example: '2025-02-27',
      description: 'Last payment date',
    }),
    last_payment_amount: z.number().optional().openapi({
      example: 9680,
      description: 'Last payment amount',
    }),
    status: z.enum(['normal', 'error']).openapi({
      example: 'normal',
      description: 'Payment status',
    }),
    payment_history: z.array(PaymentRecordSchema).openapi({
      description: 'Payment history',
    }),
  })
  .openapi({
    title: 'PaymentInfo',
    description: 'Payment information',
  });

/**
 * Unpaid Info Schema
 */
export const UnpaidInfoSchema = z
  .object({
    amount: z.number().openapi({
      example: 5000,
      description: 'Unpaid amount',
    }),
    due_date: z.string().openapi({
      example: '2025-03-15',
      description: 'Due date',
    }),
    reason: z.string().optional().openapi({
      example: 'Payment failed',
      description: 'Reason for unpaid',
    }),
  })
  .openapi({
    title: 'UnpaidInfo',
    description: 'Unpaid information',
  });

/**
 * Campaign Schema
 */
export const CampaignSchema = z
  .object({
    campaign_name: z.string().openapi({
      example: '春の入会キャンペーン',
      description: 'Campaign name',
    }),
    period_start: z.string().optional().openapi({
      example: '2025-03-01',
      description: 'Campaign period start date',
    }),
    period_end: z.string().optional().openapi({
      example: '2025-03-31',
      description: 'Campaign period end date',
    }),
    discount_content: z.string().optional().openapi({
      example: '入会金50%OFF',
      description: 'Discount content',
    }),
    remaining_days: z.number().optional().openapi({
      example: 15,
      description: 'Remaining days',
    }),
    applied_at: z.string().optional().openapi({
      example: '2024-01-15',
      description: 'Applied date',
    }),
    content: z.string().optional().openapi({
      example: '初月月会費無料',
      description: 'Campaign content',
    }),
    status: CampaignStatusSchema.optional().openapi({
      example: 'expired',
      description: 'Campaign status',
    }),
  })
  .openapi({
    title: 'Campaign',
    description: 'Campaign information',
  });

/**
 * Campaigns Schema
 */
export const CampaignsSchema = z
  .object({
    active: z.array(CampaignSchema).openapi({
      description: 'Active campaigns',
    }),
    history: z.array(CampaignSchema).openapi({
      description: 'Campaign history',
    }),
  })
  .openapi({
    title: 'Campaigns',
    description: 'Campaign information',
  });

/**
 * Get Contracts Response Schema
 */
export const GetContractsResponseSchema = z
  .object({
    main_contract: MainContractSchema.openapi({
      description: 'Main contract information',
    }),
    option_contracts: z.array(OptionContractSchema).openapi({
      description: 'Option contracts',
    }),
    option_change_history: z.array(OptionChangeHistorySchema).openapi({
      description: 'Option change history',
    }),
    special_contracts: SpecialContractsSchema.openapi({
      description: 'Special contracts',
    }),
    payment_info: PaymentInfoSchema.openapi({
      description: 'Payment information',
    }),
    unpaid_info: UnpaidInfoSchema.nullable().openapi({
      description: 'Unpaid information',
    }),
    campaigns: CampaignsSchema.openapi({
      description: 'Campaign information',
    }),
  })
  .openapi({
    title: 'GetContractsResponse',
    description: 'Response for getting contracts',
  });

/**
 * Error Response Schema
 */
export const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({
      example: 'Failed to process request',
      description: 'Error message',
    }),
  })
  .openapi({
    title: 'ErrorResponse',
    description: 'Error response',
  });

export const GetRelationshipsResponseSchema = z
  .object({
    family: z
      .object({
        role: z.enum(['primary', 'family_child']),
        children: z
          .array(
            z.object({
              id: z.string(),
              member_number: z.string(),
              name: z.string(),
              relationship: z.string(),
              status: MemberStatusSchema,
            }),
          )
          .optional(),
        current_count: z.number().optional(),
        max_count: z.number().optional(),
        parent: z
          .object({
            id: z.string(),
            member_number: z.string(),
            name: z.string(),
            relationship: z.string(),
            status: MemberStatusSchema,
          })
          .optional(),
      })
      .openapi({
        description: 'Family relationships',
      }),
    corporate: z
      .object({
        corporate_detail_member_id: z.string(),
        corporate_name: z.string(),
        corporate_number: z.string(),
        contract_type: z.string(),
        company_discount: z.object({
          applied: z.boolean(),
          rate_percent: z.number().nullable(),
        }),
        contact_department: z.string(),
        contact_name: z.string(),
      })
      .nullable()
      .openapi({
        description: 'Corporate relationships',
      }),
    referral: z
      .object({
        as_referrer: z.object({
          referrals: z.array(
            z.object({
              id: z.string(),
              member_number: z.string(),
              name: z.string(),
              referred_at: z.string(),
              membership_status: MemberStatusSchema,
              points_status: z.enum(['normal', 'blocked', 'none']).openapi({
                title: 'ReferralPointsStatus',
                description: 'Referral points status',
              }),
              points_earned: z.number().nullable(),
            }),
          ),
          summary: z.object({
            total_referrals: z.number(),
            total_points: z.number(),
          }),
        }),
        as_referee: z
          .object({
            referrer: z.object({
              id: z.string(),
              member_number: z.string(),
              name: z.string(),
              referred_at: z.string(),
              referral_benefit: z.string(),
            }),
          })
          .nullable(),
      })
      .openapi({
        description: 'Referral relationships',
      }),
  })
  .openapi({
    title: 'GetRelationshipsResponse',
    description: 'Response for getting relationships',
  });

// Type exports for use in route handlers
export type MemberType = z.infer<typeof MemberTypeSchema>;
export type ContractType = z.infer<typeof ContractTypeSchema>;
export type MemberStatus = z.infer<typeof MemberStatusSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type MemberListItem = z.infer<typeof MemberListItemSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type GetMembersQuery = z.infer<typeof GetMembersQuerySchema>;
export type GetMembersResponse = z.infer<typeof GetMembersResponseSchema>;
export type GetMembersSummaryResponse = z.infer<typeof GetMembersSummaryResponseSchema>;
export type GetMemberDetailResponse = z.infer<typeof GetMemberDetailResponseSchema>;
export type UpdateBasicInfoRequest = z.infer<typeof UpdateBasicInfoRequestSchema>;
export type UpdateBasicInfoResponse = z.infer<typeof UpdateBasicInfoResponseSchema>;
export type UpdateHealthInfoRequest = z.infer<typeof UpdateHealthInfoRequestSchema>;
export type UpdateHealthInfoResponse = z.infer<typeof UpdateHealthInfoResponseSchema>;
export type UpdateMarketingConsentRequest = z.infer<typeof UpdateMarketingConsentRequestSchema>;
export type UpdateMarketingConsentResponse = z.infer<typeof UpdateMarketingConsentResponseSchema>;
export type PointAdjustmentType = z.infer<typeof PointAdjustmentTypeSchema>;
export type PointAdjustmentRequest = z.infer<typeof PointAdjustmentRequestSchema>;
export type PointAdjustmentResponse = z.infer<typeof PointAdjustmentResponseSchema>;
export type GetPointsResponse = z.infer<typeof GetPointsResponseSchema>;
export type MemoType = z.infer<typeof MemoTypeSchema>;
export type StaffMemo = z.infer<typeof StaffMemoSchema>;
export type CreateMemoRequest = z.infer<typeof CreateMemoRequestSchema>;
export type CreateMemoResponse = z.infer<typeof CreateMemoResponseSchema>;
export type UpdateMemoRequest = z.infer<typeof UpdateMemoRequestSchema>;
export type UpdateMemoResponse = z.infer<typeof UpdateMemoResponseSchema>;
export type GetMemosResponse = z.infer<typeof GetMemosResponseSchema>;
export type ExportMembersRequest = z.infer<typeof ExportMembersRequestSchema>;
export type ExportMembersResponse = z.infer<typeof ExportMembersResponseSchema>;
export type ContractChange = z.infer<typeof ContractChangeSchema>;
export type MainContract = z.infer<typeof MainContractSchema>;
export type OptionContract = z.infer<typeof OptionContractSchema>;
export type OptionChangeHistory = z.infer<typeof OptionChangeHistorySchema>;
export type SpecialContractItem = z.infer<typeof SpecialContractItemSchema>;
export type SpecialContracts = z.infer<typeof SpecialContractsSchema>;
export type PaymentRecord = z.infer<typeof PaymentRecordSchema>;
export type PaymentInfo = z.infer<typeof PaymentInfoSchema>;
export type UnpaidInfo = z.infer<typeof UnpaidInfoSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type Campaigns = z.infer<typeof CampaignsSchema>;
export type GetContractsResponse = z.infer<typeof GetContractsResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
