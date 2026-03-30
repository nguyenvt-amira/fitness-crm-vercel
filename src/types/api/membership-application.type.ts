// Types for Membership Applications API (snake_case)

export type MembershipApplicationStatus =
  | 'payment_failed'
  | 'pending'
  | 'auto_approved'
  | 'manual_approved'
  | 'rejected'
  | 'cancelled';

export type RiskReason =
  | 'blacklist_match'
  | 'duplicate_application'
  | 'payment_failure'
  | 'high_risk_score'
  | 'document_issue'
  | 'other';

// export interface MembershipApplicationSummary {
//   total_applications: number;
//   auto_approval_rate: number;
//   auto_approval_count: number;
//   avg_processing_time: string; // Format: "1h23m"
//   payment_failed_count: number;
//   payment_failed_deadline?: string;
//   pending_count: number;
//   pending_deadline?: string;
//   risk_reasons_breakdown?: Record<RiskReason, number>;
//   auto_approved_today_count: number;
//   auto_approved_today_rate: number;
//   manual_approved_count: number;
//   rejected_count: number;
//   rejected_auto_count: number;
//   rejected_manual_count: number;
//   date_range_start: string;
//   date_range_end: string;
// }

export interface MembershipApplication {
  id: string;
  applicant_name: string;
  applied_at: string;
  elapsed_time?: string; // Format: "3日9時間経過"
  risk_score: number;
  risk_reason: string;
  plan_name: string;
  scheduled_start_date: string;
  status: MembershipApplicationStatus;
  payment_failed_deadline?: string;
  pending_deadline?: string;
}
