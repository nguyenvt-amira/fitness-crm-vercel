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
import '@/app/api/crm/members/[id]/basic-info/route';
import '@/app/api/crm/members/[id]/change-history/route';
import '@/app/api/crm/members/[id]/communications/route';
import '@/app/api/crm/members/[id]/contracts/route';
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
import '@/app/api/crm/members/export/route';
// Import members routes
import '@/app/api/crm/members/route';
import '@/app/api/crm/membership-applications/[id]/approve/route';
import '@/app/api/crm/membership-applications/[id]/cancel/route';
import '@/app/api/crm/membership-applications/[id]/reject/route';
import '@/app/api/crm/membership-applications/[id]/route';
import '@/app/api/crm/membership-applications/bulk-approve/route';
// Import membership applications routes
import '@/app/api/crm/membership-applications/route';
import '@/app/api/crm/membership-applications/summary/route';

// Add more route imports here as you register them with OpenAPI
