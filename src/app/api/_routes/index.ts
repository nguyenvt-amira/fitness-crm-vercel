/**
 * Central file to register all OpenAPI routes
 * Import route files here to trigger OpenAPI registration
 */
// Import auth routes
import '@/app/api/auth/login/route';
import '@/app/api/auth/refresh/route';
import '@/app/api/crm/auto-approval/dashboard/route';
// Import auto-approval routes
import '@/app/api/crm/auto-approval/settings/route';
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
import '@/app/api/crm/main-contracts/route';
import '@/app/api/crm/members/[id]/basic-info/route';
import '@/app/api/crm/members/[id]/change-history/route';
import '@/app/api/crm/members/[id]/communications/route';
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
import '@/app/api/crm/members/[id]/health-info/route';
import '@/app/api/crm/members/[id]/marketing-consent/route';
import '@/app/api/crm/members/[id]/memos/[memoId]/route';
import '@/app/api/crm/members/[id]/memos/route';
import '@/app/api/crm/members/[id]/points/adjust/route';
import '@/app/api/crm/members/[id]/points/route';
import '@/app/api/crm/members/[id]/relationships/route';
import '@/app/api/crm/members/[id]/route';
import '@/app/api/crm/members/[id]/service-usage/route';
import '@/app/api/crm/members/[id]/training-records/route';
import '@/app/api/crm/members/[id]/usage-history/route';
import '@/app/api/crm/members/[id]/usage-status/route';
import '@/app/api/crm/members/export/route';
import '@/app/api/crm/members/meta/main-contract-labels/route';
// Import members routes
import '@/app/api/crm/members/route';
import '@/app/api/crm/members/summary/route';
import '@/app/api/crm/membership-applications/[id]/approve/route';
import '@/app/api/crm/membership-applications/[id]/cancel/route';
import '@/app/api/crm/membership-applications/[id]/reject/route';
import '@/app/api/crm/membership-applications/[id]/route';
import '@/app/api/crm/membership-applications/bulk-approve/route';
import '@/app/api/crm/membership-applications/bulk-reject/route';
// Import membership applications routes
import '@/app/api/crm/membership-applications/route';
import '@/app/api/crm/membership-applications/summary/route';
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

// Add more route imports here as you register them with OpenAPI
