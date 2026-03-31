import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { EkycResultSchema } from './family-registration.schema';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

/**
 * Membership Application Status Schema
 */
export const MembershipApplicationStatusSchema = z.enum([
  'payment_failed',
  'pending',
  'auto_approved',
  'manual_approved',
  'rejected',
  'cancelled',
]);

/**
 * Risk Reason Schema
 */
export const RiskReasonSchema = z.enum([
  'blacklist_match',
  'duplicate_application',
  'payment_failure',
  'high_risk_score',
  'document_issue',
  'other',
]);

export const MembershipApplicationPaymentMethodSchema = z
  .enum(['credit_card', 'bank_transfer'])
  .openapi({ title: 'MembershipApplicationPaymentMethod', description: 'Payment method' });

export const MembershipApplicationPaymentStatusSchema = z
  .enum(['pending', 'paid', 'failed'])
  .openapi({ title: 'MembershipApplicationPaymentStatus', description: 'Payment status' });

/**
 * Membership Application Schema
 */
export const MembershipApplicationSchema = z
  .object({
    id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    applicant_name: z.string().openapi({
      example: '山田太郎',
      description: 'Applicant name',
    }),
    applied_at: z.string().datetime().openapi({
      example: '2024-01-15T12:30:00Z',
      description: 'Application date and time',
    }),
    elapsed_time: z.string().optional().openapi({
      example: '3日9時間経過',
      description: 'Elapsed time since application',
    }),
    risk_score: z.number().min(0).max(100).openapi({
      example: 61,
      description: 'Risk score (0-100)',
    }),
    risk_reason: RiskReasonSchema.openapi({
      example: 'blacklist_match',
      description: 'Risk reason',
    }),
    plan_name: z.string().openapi({
      example: '通常会員',
      description: 'Plan name',
    }),
    scheduled_start_date: z.string().date().openapi({
      example: '2024-01-20',
      description: 'Scheduled start date',
    }),
    status: MembershipApplicationStatusSchema.openapi({
      example: 'pending',
      description: 'Application status',
    }),
    payment_failed_deadline: z.string().datetime().optional().openapi({
      example: '2024-01-22T12:30:00Z',
      description: 'Payment failed deadline',
    }),
    pending_deadline: z.string().datetime().optional().openapi({
      example: '2024-01-22T12:30:00Z',
      description: 'Pending deadline',
    }),
  })
  .openapi({
    title: 'MembershipApplication',
    description: 'Membership application information',
  });

/**
 * Pagination Schema
 */
export const PaginationSchema = z
  .object({
    total: z.number().openapi({
      example: 200,
      description: 'Total number of items',
    }),
    total_pages: z.number().openapi({
      example: 4,
      description: 'Total number of pages',
    }),
    current_page: z.number().openapi({
      example: 1,
      description: 'Current page number',
    }),
    limit: z.number().openapi({
      example: 50,
      description: 'Items per page',
    }),
  })
  .openapi({
    title: 'Pagination',
    description: 'Pagination information',
  });

/**
 * Get Membership Applications Query Params Schema
 */
export const GetMembershipApplicationsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1).openapi({
      example: 1,
      description: 'Page number',
    }),
    limit: z.coerce.number().int().positive().optional().default(50).openapi({
      example: 50,
      description: 'Items per page',
    }),
    status: MembershipApplicationStatusSchema.optional().openapi({
      example: 'pending',
      description: 'Filter by status',
    }),
    risk_reason: RiskReasonSchema.optional().openapi({
      example: 'blacklist_match',
      description: 'Filter by risk reason',
    }),
    sort_by: z
      .enum(['applied_at', 'risk_score', 'pending_deadline'])
      .optional()
      .default('applied_at')
      .openapi({
        example: 'applied_at',
        description: 'Sort field',
      }),
    sort_order: z.enum(['asc', 'desc']).optional().default('desc').openapi({
      example: 'desc',
      description: 'Sort order',
    }),
    search: z.string().optional().openapi({
      example: '山田',
      description: 'Search query',
    }),
  })
  .openapi({
    title: 'GetMembershipApplicationsQuery',
    description: 'Query parameters for getting membership applications',
  });

/**
 * Get Membership Applications Response Schema
 */
export const GetMembershipApplicationsResponseSchema = z
  .object({
    applications: z.array(MembershipApplicationSchema).openapi({
      description: 'List of membership applications',
    }),
    pagination: PaginationSchema.openapi({
      description: 'Pagination information',
    }),
  })
  .openapi({
    title: 'GetMembershipApplicationsResponse',
    description: 'Response for getting membership applications',
  });

/**
 * Auto Judge Request Schema
 */
export const AutoJudgeRequestSchema = z
  .object({
    application_ids: z
      .array(z.string())
      .min(1, 'At least one application ID is required')
      .openapi({
        example: ['APP-00001', 'APP-00002'],
        description: 'List of application IDs to auto-judge',
      }),
  })
  .openapi({
    title: 'AutoJudgeRequest',
    description: 'Request payload for auto-judge',
  });

/**
 * Auto Judge Result Schema
 */
export const AutoJudgeResultSchema = z
  .object({
    application_id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    approved: z.boolean().openapi({
      example: true,
      description: 'Whether the application was approved',
    }),
    risk_score: z.number().min(0).max(100).openapi({
      example: 45,
      description: 'Risk score',
    }),
    reason: z.string().openapi({
      example: '自動承認',
      description: 'Reason for the decision',
    }),
  })
  .openapi({
    title: 'AutoJudgeResult',
    description: 'Auto-judge result for a single application',
  });

/**
 * Auto Judge Response Schema
 */
export const AutoJudgeResponseSchema = z
  .object({
    results: z.array(AutoJudgeResultSchema).openapi({
      description: 'Auto-judge results',
    }),
    summary: z
      .object({
        total: z.number().openapi({
          example: 2,
          description: 'Total number of applications',
        }),
        approved: z.number().openapi({
          example: 1,
          description: 'Number of approved applications',
        }),
        rejected: z.number().openapi({
          example: 1,
          description: 'Number of rejected applications',
        }),
      })
      .openapi({
        description: 'Summary of auto-judge results',
      }),
  })
  .openapi({
    title: 'AutoJudgeResponse',
    description: 'Response for auto-judge operation',
  });

/**
 * Get Summary Query Params Schema
 */
export const GetSummaryQuerySchema = z
  .object({
    period: z.enum(['day', 'week', 'month']).optional().default('month').openapi({
      example: 'month',
      description: 'Time period',
    }),
    start_date: z.string().date().optional().openapi({
      example: '2024-01-01',
      description: 'Start date (overrides period)',
    }),
    end_date: z.string().date().optional().openapi({
      example: '2024-01-31',
      description: 'End date (overrides period)',
    }),
  })
  .openapi({
    title: 'GetSummaryQuery',
    description: 'Query parameters for getting summary',
  });

/**
 * Risk Reasons Breakdown Schema
 */
export const RiskReasonsBreakdownSchema = z
  .object({
    blacklist_match: z.number().openapi({
      example: 2,
      description: 'Blacklist match count',
    }),
    duplicate_application: z.number().openapi({
      example: 5,
      description: 'Duplicate application count',
    }),
    payment_failure: z.number().openapi({
      example: 3,
      description: 'Payment failure count',
    }),
    high_risk_score: z.number().openapi({
      example: 2,
      description: 'High risk score count',
    }),
    document_issue: z.number().openapi({
      example: 0,
      description: 'Document issue count',
    }),
    other: z.number().openapi({
      example: 0,
      description: 'Other risk reasons count',
    }),
  })
  .openapi({
    title: 'RiskReasonsBreakdown',
    description: 'Breakdown of risk reasons',
  });

/**
 * Membership Application Summary Schema
 */
export const MembershipApplicationSummarySchema = z
  .object({
    total_applications: z.number().openapi({
      example: 1234,
      description: 'Total number of applications',
    }),
    auto_approval_rate: z.number().openapi({
      example: 82.5,
      description: 'Auto approval rate (%)',
    }),
    auto_approval_count: z.number().openapi({
      example: 678,
      description: 'Number of auto-approved applications',
    }),
    avg_processing_time: z.string().openapi({
      example: '1h23m',
      description: 'Average processing time',
    }),
    payment_failed_count: z.number().openapi({
      example: 3,
      description: 'Number of payment failed applications',
    }),
    payment_failed_deadline: z.string().datetime().optional().openapi({
      example: '2024-01-31T23:59:59Z',
      description: 'Payment failed deadline',
    }),
    pending_count: z.number().openapi({
      example: 12,
      description: 'Number of pending applications',
    }),
    pending_deadline: z.string().datetime().optional().openapi({
      example: '2024-01-31T23:59:59Z',
      description: 'Pending deadline',
    }),
    risk_reasons_breakdown: RiskReasonsBreakdownSchema.openapi({
      description: 'Breakdown of risk reasons',
    }),
    auto_approved_today_count: z.number().openapi({
      example: 163,
      description: 'Number of auto-approved applications today',
    }),
    auto_approved_today_rate: z.number().openapi({
      example: 85.0,
      description: 'Auto approval rate today (%)',
    }),
    manual_approved_count: z.number().openapi({
      example: 21,
      description: 'Number of manually approved applications',
    }),
    rejected_count: z.number().openapi({
      example: 1,
      description: 'Total number of rejected applications',
    }),
    rejected_auto_count: z.number().openapi({
      example: 0,
      description: 'Number of auto-rejected applications',
    }),
    rejected_manual_count: z.number().openapi({
      example: 1,
      description: 'Number of manually rejected applications',
    }),
    date_range_start: z.string().datetime().openapi({
      example: '2024-01-01T00:00:00Z',
      description: 'Date range start',
    }),
    date_range_end: z.string().datetime().openapi({
      example: '2024-01-31T23:59:59Z',
      description: 'Date range end',
    }),
  })
  .openapi({
    title: 'MembershipApplicationSummary',
    description: 'Summary of membership applications',
  });

/**
 * Membership Application Alert Schema
 */
export const MembershipApplicationAlertSchema = z
  .object({
    title: z.string().openapi({
      example: '要確認の入会申し込みが12件あります。',
      description: 'Alert title',
    }),
    description: z.string().openapi({
      example: '承認もしくは却下の操作を行なってください。',
      description: 'Alert description',
    }),
    type: z.enum(['payment_failed', 'pending', 'high_risk', 'all']).openapi({
      example: 'pending',
      description: 'Alert type',
    }),
    count: z.number().openapi({
      example: 12,
      description: 'Number of items',
    }),
    deadline: z.string().datetime().optional().openapi({
      example: '2024-01-31T23:59:59Z',
      description: 'Deadline',
    }),
  })
  .openapi({
    title: 'MembershipApplicationAlert',
    description: 'Alert information',
  });

/**
 * Get Summary Response Schema
 */
export const GetSummaryResponseSchema = z
  .object({
    summary: MembershipApplicationSummarySchema.openapi({
      description: 'Summary information',
    }),
    alerts: z.array(MembershipApplicationAlertSchema).openapi({
      description: 'List of alerts',
    }),
  })
  .openapi({
    title: 'GetSummaryResponse',
    description: 'Response for getting summary',
  });

/**
 * Bulk Approve Request Schema
 */
export const BulkApproveRequestSchema = z
  .object({
    application_ids: z
      .array(z.string())
      .min(1, 'At least one application ID is required')
      .openapi({
        example: ['APP-00001', 'APP-00002'],
        description: 'List of application IDs to approve',
      }),
    approval_reason: z.string().optional().openapi({
      example: '一括承認',
      description: 'Approval reason',
    }),
  })
  .openapi({
    title: 'BulkApproveRequest',
    description: 'Request payload for bulk approval',
  });

/**
 * Bulk Approve Result Schema
 */
export const BulkApproveResultSchema = z
  .object({
    application_id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    approved: z.boolean().openapi({
      example: true,
      description: 'Whether the application was approved',
    }),
    approved_at: z.string().datetime().openapi({
      example: '2024-01-15T12:30:00Z',
      description: 'Approval date and time',
    }),
  })
  .openapi({
    title: 'BulkApproveResult',
    description: 'Bulk approve result for a single application',
  });

/**
 * Bulk Approve Response Schema
 */
export const BulkApproveResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: 'Whether the operation was successful',
    }),
    results: z.array(BulkApproveResultSchema).openapi({
      description: 'Bulk approve results',
    }),
    summary: z
      .object({
        total: z.number().openapi({
          example: 2,
          description: 'Total number of applications',
        }),
        approved: z.number().openapi({
          example: 2,
          description: 'Number of approved applications',
        }),
        failed: z.number().openapi({
          example: 0,
          description: 'Number of failed applications',
        }),
      })
      .openapi({
        description: 'Summary of bulk approve results',
      }),
    approval_reason: z.string().optional().openapi({
      example: '一括承認',
      description: 'Approval reason',
    }),
  })
  .openapi({
    title: 'BulkApproveResponse',
    description: 'Response for bulk approve operation',
  });

/**
 * Bulk Reject Request Schema
 */
export const BulkRejectRequestSchema = z
  .object({
    application_ids: z
      .array(z.string())
      .min(1, 'At least one application ID is required')
      .openapi({
        example: ['APP-00001', 'APP-00002'],
        description: 'List of application IDs to reject',
      }),
    rejection_reason: z.string().min(1, 'Rejection reason is required').openapi({
      example: 'リスクスコアが高すぎます',
      description: 'Rejection reason',
    }),
    staff_id: z.string().optional().openapi({
      example: 'staff-001',
      description: 'Staff ID who rejected',
    }),
  })
  .openapi({
    title: 'BulkRejectRequest',
    description: 'Request payload for bulk rejection',
  });

/**
 * Bulk Reject Result Schema
 */
export const BulkRejectResultSchema = z
  .object({
    application_id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    rejected: z.boolean().openapi({
      example: true,
      description: 'Whether the application was rejected',
    }),
    rejected_at: z.string().datetime().optional().openapi({
      example: '2024-01-15T12:30:00Z',
      description: 'Rejection date and time',
    }),
    error: z.string().optional().openapi({
      example: 'Application not found',
      description: 'Error message if rejection failed for this item',
    }),
  })
  .openapi({
    title: 'BulkRejectResult',
    description: 'Bulk reject result for a single application',
  });

/**
 * Bulk Reject Response Schema
 */
export const BulkRejectResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: 'Whether the operation was successful',
    }),
    results: z.array(BulkRejectResultSchema).openapi({
      description: 'Bulk reject results',
    }),
    summary: z
      .object({
        total: z.number().openapi({
          example: 2,
          description: 'Total number of applications',
        }),
        rejected: z.number().openapi({
          example: 2,
          description: 'Number of rejected applications',
        }),
        failed: z.number().openapi({
          example: 0,
          description: 'Number of failed applications',
        }),
      })
      .openapi({
        description: 'Summary of bulk reject results',
      }),
    rejection_reason: z.string().openapi({
      example: 'リスクスコアが高すぎます',
      description: 'Rejection reason',
    }),
    rejected_by: z.string().openapi({
      example: 'staff-001',
      description: 'Staff ID who rejected',
    }),
  })
  .openapi({
    title: 'BulkRejectResponse',
    description: 'Response for bulk reject operation',
  });

/**
 * Get Application Detail Response Schema
 */
export const GetApplicationDetailResponseSchema = z
  .object({
    application: MembershipApplicationSchema.extend({
      gender: z.enum(['male', 'female', 'other']).optional().openapi({
        example: 'male',
        description: 'Gender',
      }),
      blood_type: z.enum(['A', 'B', 'O', 'AB', 'unknown']).optional().openapi({
        example: 'A',
        description: 'Blood type',
      }),
      birthday: z.string().date().optional().openapi({
        example: '2000-01-01',
        description: 'Birthday (YYYY-MM-DD)',
      }),
      applicant_email: z.string().email().optional().openapi({
        example: 'yamada.taro@example.com',
        description: 'Applicant email',
      }),
      applicant_phone: z.string().optional().openapi({
        example: '090-1234-5678',
        description: 'Applicant phone number',
      }),
      applicant_address: z.string().optional().openapi({
        example: '東京都渋谷区1-2-3',
        description: 'Applicant address',
      }),
      emergency_contact_name: z.string().optional().openapi({
        example: '佐藤 太郎',
        description: 'Emergency contact name',
      }),
      emergency_contact_relationship: z.string().optional().openapi({
        example: '夫',
        description: 'Emergency contact relationship',
      }),
      emergency_contact_phone: z.string().optional().openapi({
        example: '090-8765-4321',
        description: 'Emergency contact phone',
      }),
      payment_method: MembershipApplicationPaymentMethodSchema.optional().openapi({
        example: 'credit_card',
        description: 'Payment method',
      }),
      payment_status: MembershipApplicationPaymentStatusSchema.optional().openapi({
        example: 'pending',
        description: 'Payment status',
      }),
      risk_details: z
        .array(
          z.object({
            reason: z.string(),
            score: z.number(),
            description: z.string(),
          }),
        )
        .optional()
        .openapi({
          description: 'Detailed risk information',
        }),
      documents: z
        .array(
          z.object({
            type: z.string(),
            url: z.string(),
            verified: z.boolean(),
          }),
        )
        .optional()
        .openapi({
          description: 'Application documents',
        }),
      contract_details: z
        .object({
          plan_id: z.string(),
          plan_name: z.string(),
          start_date: z.string().date(),
          monthly_fee: z.number(),
          contract_period: z.number(),
          option_ids: z.array(z.string()).optional(),
        })
        .optional()
        .openapi({
          description: 'Contract details',
        }),
      ekyc: EkycResultSchema.optional().openapi({
        description: 'eKYC verification result',
      }),
    }).openapi({
      description: 'Application detail information',
    }),
  })
  .openapi({
    title: 'GetApplicationDetailResponse',
    description: 'Response for getting application detail',
  });

/**
 * Update Membership Application Request Schema (Edit screen)
 */
export const UpdateMembershipApplicationRequestSchema = z
  .object({
    basic: z
      .object({
        applicant_name: z.string().min(1).optional().openapi({
          example: '山田太郎',
          description: 'Applicant name',
        }),
        gender: z.enum(['male', 'female', 'other', 'unknown']).optional().openapi({
          example: 'male',
          description: 'Gender',
        }),
        blood_type: z.enum(['A', 'B', 'O', 'AB', 'unknown']).optional().openapi({
          example: 'A',
          description: 'Blood type',
        }),
        birthday: z.string().date().optional().openapi({
          example: '2000-01-01',
          description: 'Birthday (YYYY-MM-DD)',
        }),
      })
      .optional()
      .openapi({ description: 'Basic info' }),
    contact: z
      .object({
        applicant_address: z.string().optional().openapi({
          example: '東京都渋谷区1-2-3',
          description: 'Address',
        }),
        applicant_phone: z.string().optional().openapi({
          example: '090-1234-5678',
          description: 'Phone',
        }),
        applicant_email: z.string().email().optional().openapi({
          example: 'yamada.taro@example.com',
          description: 'Email',
        }),
        emergency_contact_name: z.string().optional().openapi({
          example: '佐藤 太郎',
          description: 'Emergency contact name',
        }),
        emergency_contact_relationship: z.string().optional().openapi({
          example: '夫',
          description: 'Emergency contact relationship',
        }),
        emergency_contact_phone: z.string().optional().openapi({
          example: '090-8765-4321',
          description: 'Emergency contact phone',
        }),
      })
      .optional()
      .openapi({ description: 'Contact info' }),
    contract: z
      .object({
        start_date: z.string().date().optional().openapi({
          example: '2024-01-20',
          description: 'Scheduled start date (YYYY-MM-DD)',
        }),
        plan_id: z.string().optional().openapi({
          example: 'plan-001',
          description: 'Plan ID',
        }),
        plan_name: z.string().optional().openapi({
          example: '通常会員',
          description: 'Plan name',
        }),
        option_ids: z
          .array(z.string())
          .optional()
          .openapi({
            example: ['opt-001', 'opt-002'],
            description: 'Option IDs',
          }),
        recalculate_fee: z.boolean().optional().openapi({
          example: false,
          description: 'Whether to recalculate fee',
        }),
      })
      .optional()
      .openapi({ description: 'Contract info' }),
  })
  .openapi({
    title: 'UpdateMembershipApplicationRequest',
    description: 'Request payload for editing membership application',
  });

/**
 * Update Membership Application Response Schema
 */
export const UpdateMembershipApplicationResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: 'Whether the operation was successful',
    }),
    application: z.record(z.string(), z.any()).openapi({
      description: 'Updated application (shape follows detail response)',
    }),
  })
  .openapi({
    title: 'UpdateMembershipApplicationResponse',
    description: 'Response for editing membership application',
  });

/**
 * Approve Request Schema
 */
export const ApproveRequestSchema = z
  .object({
    approval_reason: z.string().optional().openapi({
      example: '手動承認',
      description: 'Approval reason',
    }),
    staff_id: z.string().optional().openapi({
      example: 'staff-001',
      description: 'Staff ID who approved',
    }),
  })
  .openapi({
    title: 'ApproveRequest',
    description: 'Request payload for approving an application',
  });

/**
 * Approve Response Schema
 */
export const ApproveResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: 'Whether the operation was successful',
    }),
    application_id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    status: z.enum(['manual_approved']).openapi({
      example: 'manual_approved',
      description: 'New application status',
    }),
    approved_at: z.string().datetime().openapi({
      example: '2024-01-15T12:30:00Z',
      description: 'Approval date and time',
    }),
    approved_by: z.string().openapi({
      example: 'staff-001',
      description: 'Staff ID who approved',
    }),
    approval_reason: z.string().openapi({
      example: '手動承認',
      description: 'Approval reason',
    }),
    member_id: z.string().openapi({
      example: 'MEMBER-00001',
      description: 'Member ID',
    }),
  })
  .openapi({
    title: 'ApproveResponse',
    description: 'Response for approving an application',
  });

/**
 * Reject Request Schema
 */
export const RejectRequestSchema = z
  .object({
    rejection_reason: z.string().min(1, 'Rejection reason is required').openapi({
      example: 'リスクスコアが高すぎます',
      description: 'Rejection reason',
    }),
    staff_id: z.string().optional().openapi({
      example: 'staff-001',
      description: 'Staff ID who rejected',
    }),
  })
  .openapi({
    title: 'RejectRequest',
    description: 'Request payload for rejecting an application',
  });

/**
 * Reject Response Schema
 */
export const RejectResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: 'Whether the operation was successful',
    }),
    application_id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    status: z.enum(['rejected']).openapi({
      example: 'rejected',
      description: 'New application status',
    }),
    rejected_at: z.string().datetime().openapi({
      example: '2024-01-15T12:30:00Z',
      description: 'Rejection date and time',
    }),
    rejected_by: z.string().openapi({
      example: 'staff-001',
      description: 'Staff ID who rejected',
    }),
    rejection_reason: z.string().openapi({
      example: 'リスクスコアが高すぎます',
      description: 'Rejection reason',
    }),
  })
  .openapi({
    title: 'RejectResponse',
    description: 'Response for rejecting an application',
  });

/**
 * Cancel Request Schema
 */
export const CancelRequestSchema = z
  .object({
    cancellation_reason: z.string().min(1, 'Cancellation reason is required').openapi({
      example: '顧客の要望によりキャンセル',
      description: 'Cancellation reason',
    }),
    staff_id: z.string().optional().openapi({
      example: 'staff-001',
      description: 'Staff ID who cancelled',
    }),
  })
  .openapi({
    title: 'CancelRequest',
    description: 'Request payload for cancelling an application',
  });

/**
 * Cancel Response Schema
 */
export const CancelResponseSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
      description: 'Whether the operation was successful',
    }),
    application_id: z.string().openapi({
      example: 'APP-00001',
      description: 'Application ID',
    }),
    status: z.enum(['cancelled']).openapi({
      example: 'cancelled',
      description: 'New application status',
    }),
    cancelled_at: z.string().datetime().openapi({
      example: '2024-01-15T12:30:00Z',
      description: 'Cancellation date and time',
    }),
    cancelled_by: z.string().openapi({
      example: 'staff-001',
      description: 'Staff ID who cancelled',
    }),
    cancellation_reason: z.string().openapi({
      example: '顧客の要望によりキャンセル',
      description: 'Cancellation reason',
    }),
    refund_processed: z.boolean().openapi({
      example: true,
      description: 'Whether refund was processed',
    }),
    refund_amount: z.number().openapi({
      example: 5000,
      description: 'Refund amount',
    }),
  })
  .openapi({
    title: 'CancelResponse',
    description: 'Response for cancelling an application',
  });

/**
 * Error Response Schema (re-exported from auth.schema.ts for consistency)
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

// Type exports for use in route handlers
export type MembershipApplicationStatus = z.infer<typeof MembershipApplicationStatusSchema>;
export type RiskReason = z.infer<typeof RiskReasonSchema>;
export type MembershipApplication = z.infer<typeof MembershipApplicationSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type GetMembershipApplicationsQuery = z.infer<typeof GetMembershipApplicationsQuerySchema>;
export type GetMembershipApplicationsResponse = z.infer<
  typeof GetMembershipApplicationsResponseSchema
>;
export type AutoJudgeRequest = z.infer<typeof AutoJudgeRequestSchema>;
export type AutoJudgeResponse = z.infer<typeof AutoJudgeResponseSchema>;
export type GetSummaryQuery = z.infer<typeof GetSummaryQuerySchema>;
export type GetSummaryResponse = z.infer<typeof GetSummaryResponseSchema>;
export type BulkApproveRequest = z.infer<typeof BulkApproveRequestSchema>;
export type BulkApproveResponse = z.infer<typeof BulkApproveResponseSchema>;
export type BulkRejectRequest = z.infer<typeof BulkRejectRequestSchema>;
export type BulkRejectResponse = z.infer<typeof BulkRejectResponseSchema>;
export type GetApplicationDetailResponse = z.infer<typeof GetApplicationDetailResponseSchema>;
export type UpdateMembershipApplicationRequest = z.infer<
  typeof UpdateMembershipApplicationRequestSchema
>;
export type UpdateMembershipApplicationResponse = z.infer<
  typeof UpdateMembershipApplicationResponseSchema
>;
export type ApproveRequest = z.infer<typeof ApproveRequestSchema>;
export type ApproveResponse = z.infer<typeof ApproveResponseSchema>;
export type RejectRequest = z.infer<typeof RejectRequestSchema>;
export type RejectResponse = z.infer<typeof RejectResponseSchema>;
export type CancelRequest = z.infer<typeof CancelRequestSchema>;
export type CancelResponse = z.infer<typeof CancelResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
