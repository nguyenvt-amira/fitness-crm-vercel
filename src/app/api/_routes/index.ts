/**
 * Central file to register all OpenAPI routes
 * Import route files here to trigger OpenAPI registration
 */
// Import auth routes
import '@/app/api/auth/login/route';
import '@/app/api/auth/me/route';
import '@/app/api/auth/refresh/route';
import '@/app/api/auth/switch-user/route';
import '@/app/api/crm/auto-approval/dashboard/route';
// Import auto-approval routes
import '@/app/api/crm/auto-approval/settings/route';
import '@/app/api/crm/blacklist/[id]/route';
// Blacklist (A-01 FR-015)
import '@/app/api/crm/blacklist/route';
// Brand master (Y-07) — OpenAPI tag: Brands
import '@/app/api/crm/brands/route';
import '@/app/api/crm/family-registrations/[id]/approve/route';
import '@/app/api/crm/family-registrations/[id]/complete/route';
import '@/app/api/crm/family-registrations/[id]/reject/route';
import '@/app/api/crm/family-registrations/[id]/route';
import '@/app/api/crm/family-registrations/bulk-approve/route';
import '@/app/api/crm/family-registrations/bulk-reject/route';
import '@/app/api/crm/family-registrations/check-primary-member/route';
import '@/app/api/crm/family-registrations/dashboard/route';
import '@/app/api/crm/family-registrations/risk-evaluation/route';
// Import family registrations routes
import '@/app/api/crm/family-registrations/route';
import '@/app/api/crm/family-registrations/summary/route';
// Import leaves routes
import '@/app/api/crm/leaves/[id]/approve/route';
import '@/app/api/crm/leaves/[id]/cancel-withdrawal/route';
import '@/app/api/crm/leaves/[id]/execute-withdrawal/route';
import '@/app/api/crm/leaves/[id]/reject/route';
import '@/app/api/crm/leaves/[id]/route';
import '@/app/api/crm/leaves/route';
import '@/app/api/crm/main-contracts/route';
import '@/app/api/crm/members/[id]/basic-info/route';
import '@/app/api/crm/members/[id]/billing/route';
import '@/app/api/crm/members/[id]/body-data/route';
import '@/app/api/crm/members/[id]/change-history/route';
import '@/app/api/crm/members/[id]/contracts/campaigns/route';
import '@/app/api/crm/members/[id]/contracts/day-pass-history/route';
import '@/app/api/crm/members/[id]/contracts/main-contract/change/route';
import '@/app/api/crm/members/[id]/contracts/main-contract/route';
import '@/app/api/crm/members/[id]/contracts/option-contracts/cancel/route';
import '@/app/api/crm/members/[id]/contracts/option-contracts/change/route';
import '@/app/api/crm/members/[id]/contracts/option-contracts/route';
import '@/app/api/crm/members/[id]/contracts/payment-history/route';
import '@/app/api/crm/members/[id]/contracts/summary/route';
import '@/app/api/crm/members/[id]/family-members/route';
import '@/app/api/crm/members/[id]/gate-stop/route';
import '@/app/api/crm/members/[id]/health-info/route';
import '@/app/api/crm/members/[id]/marketing-consent/route';
import '@/app/api/crm/members/[id]/memos/[memoId]/route';
import '@/app/api/crm/members/[id]/memos/route';
import '@/app/api/crm/members/[id]/payment-history/route';
import '@/app/api/crm/members/[id]/payment-summary/route';
import '@/app/api/crm/members/[id]/personal-data/route';
import '@/app/api/crm/members/[id]/points/adjust/route';
import '@/app/api/crm/members/[id]/points/route';
import '@/app/api/crm/members/[id]/re-enroll/route';
import '@/app/api/crm/members/[id]/route';
import '@/app/api/crm/members/[id]/stores/route';
import '@/app/api/crm/members/[id]/suspend-release/route';
import '@/app/api/crm/members/[id]/suspend/route';
import '@/app/api/crm/members/[id]/suspension-leave/route';
import '@/app/api/crm/members/[id]/training-records/route';
import '@/app/api/crm/members/[id]/transfer/route';
import '@/app/api/crm/members/[id]/usage-history/access-settings/route';
import '@/app/api/crm/members/[id]/usage-history/entries/route';
import '@/app/api/crm/members/[id]/usage-history/lessons/route';
import '@/app/api/crm/members/[id]/usage-status/route';
import '@/app/api/crm/members/[id]/withdraw-cancel/route';
import '@/app/api/crm/members/[id]/withdraw/route';
import '@/app/api/crm/members/export/route';
import '@/app/api/crm/members/meta/main-contract-labels/route';
// Import members routes
import '@/app/api/crm/members/route';
import '@/app/api/crm/members/summary/route';
import '@/app/api/crm/membership-applications/[id]/approve/route';
import '@/app/api/crm/membership-applications/[id]/cancel/route';
import '@/app/api/crm/membership-applications/[id]/memos/[memoId]/route';
import '@/app/api/crm/membership-applications/[id]/memos/route';
import '@/app/api/crm/membership-applications/[id]/reject/route';
import '@/app/api/crm/membership-applications/[id]/route';
import '@/app/api/crm/membership-applications/blacklist-check/route';
import '@/app/api/crm/membership-applications/corporate-masters/route';
import '@/app/api/crm/membership-applications/direct/route';
import '@/app/api/crm/membership-applications/enrollment-fee-masters/route';
// Import membership applications routes
import '@/app/api/crm/membership-applications/route';
import '@/app/api/crm/options/route';
// Import staffs routes
import '@/app/api/crm/positions/route';
import '@/app/api/crm/staffs/[id]/route';
import '@/app/api/crm/staffs/invite/route';
import '@/app/api/crm/staffs/route';
// Import stores routes
import '@/app/api/crm/stores/[id]/access-settings/route';
import '@/app/api/crm/stores/[id]/business-hours/route';
import '@/app/api/crm/stores/[id]/main-contracts/[contractId]/route';
import '@/app/api/crm/stores/[id]/main-contracts/route';
import '@/app/api/crm/stores/[id]/options/[optionId]/route';
import '@/app/api/crm/stores/[id]/options/route';
import '@/app/api/crm/stores/[id]/route';
import '@/app/api/crm/stores/route';
import '@/app/api/crm/transfers/[id]/approve/route';
import '@/app/api/crm/transfers/[id]/reject/route';
import '@/app/api/crm/transfers/[id]/route';
// Import transfers routes
import '@/app/api/crm/transfers/route';
import '@/app/api/crm/uploads/presign/route';
import '@/app/api/crm/uploads/route';
import '@/app/api/crm/users/route';

// Add more route imports here as you register them with OpenAPI
