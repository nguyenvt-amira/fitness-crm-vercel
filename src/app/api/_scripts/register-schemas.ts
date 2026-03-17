/**
 * Register all schemas with OpenAPI registry
 * This ensures schemas are extracted to components/schemas instead of being inline
 */
// Import all schemas
import * as authSchemas from '../_schemas/auth.schema';
import * as autoApprovalSchemas from '../_schemas/auto-approval.schema';
import * as memberSchemas from '../_schemas/member.schema';
import * as membershipApplicationSchemas from '../_schemas/membership-application.schema';
import { registry } from './register-route';

/**
 * Map to store registered schemas by their name
 * This allows routes to use the registered schemas which will generate $ref
 */
export const registeredSchemaMap = new Map<string, any>();

/**
 * Register all schemas with the registry
 * This must be called before registering routes
 */
export function registerAllSchemas() {
  // Register auth schemas
  registeredSchemaMap.set(
    'LoginRequest',
    registry.register('LoginRequest', authSchemas.LoginRequestSchema),
  );
  registeredSchemaMap.set(
    'LoginResponse',
    registry.register('LoginResponse', authSchemas.LoginResponseSchema),
  );
  registeredSchemaMap.set('Token', registry.register('Token', authSchemas.TokenSchema));
  registeredSchemaMap.set(
    'RefreshRequest',
    registry.register('RefreshRequest', authSchemas.RefreshRequestSchema),
  );
  registeredSchemaMap.set(
    'RefreshResponse',
    registry.register('RefreshResponse', authSchemas.RefreshResponseSchema),
  );
  registeredSchemaMap.set(
    'ErrorResponse',
    registry.register('ErrorResponse', authSchemas.ErrorResponseSchema),
  );

  // Register auto-approval schemas
  registeredSchemaMap.set(
    'AutoApprovalSettings',
    registry.register('AutoApprovalSettings', autoApprovalSchemas.AutoApprovalSettingsSchema),
  );
  registeredSchemaMap.set(
    'GetSettingsResponse',
    registry.register('GetSettingsResponse', autoApprovalSchemas.GetSettingsResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateSettingsRequest',
    registry.register('UpdateSettingsRequest', autoApprovalSchemas.UpdateSettingsRequestSchema),
  );
  registeredSchemaMap.set(
    'UpdateSettingsResponse',
    registry.register('UpdateSettingsResponse', autoApprovalSchemas.UpdateSettingsResponseSchema),
  );
  registeredSchemaMap.set(
    'GetDashboardQuery',
    registry.register('GetDashboardQuery', autoApprovalSchemas.GetDashboardQuerySchema),
  );
  registeredSchemaMap.set(
    'GetDashboardResponse',
    registry.register('GetDashboardResponse', autoApprovalSchemas.GetDashboardResponseSchema),
  );
  registeredSchemaMap.set(
    'Dashboard',
    registry.register('Dashboard', autoApprovalSchemas.DashboardSchema),
  );
  registeredSchemaMap.set(
    'NotificationSettings',
    registry.register('NotificationSettings', autoApprovalSchemas.NotificationSettingsSchema),
  );
  registeredSchemaMap.set(
    'DateRange',
    registry.register('DateRange', autoApprovalSchemas.DateRangeSchema),
  );
  registeredSchemaMap.set(
    'DashboardStatistics',
    registry.register('DashboardStatistics', autoApprovalSchemas.DashboardStatisticsSchema),
  );
  registeredSchemaMap.set(
    'RiskDistribution',
    registry.register('RiskDistribution', autoApprovalSchemas.RiskDistributionSchema),
  );
  registeredSchemaMap.set(
    'RejectionReasons',
    registry.register('RejectionReasons', autoApprovalSchemas.RejectionReasonsSchema),
  );
  registeredSchemaMap.set(
    'DailyTrend',
    registry.register('DailyTrend', autoApprovalSchemas.DailyTrendSchema),
  );
  registeredSchemaMap.set(
    'RecentActivity',
    registry.register('RecentActivity', autoApprovalSchemas.RecentActivitySchema),
  );

  // Register member schemas
  registeredSchemaMap.set(
    'MemberListItem',
    registry.register('MemberListItem', memberSchemas.MemberListItemSchema),
  );
  registeredSchemaMap.set(
    'Pagination',
    registry.register('Pagination', memberSchemas.PaginationSchema),
  );
  registeredSchemaMap.set(
    'GetMembersQuery',
    registry.register('GetMembersQuery', memberSchemas.GetMembersQuerySchema),
  );
  registeredSchemaMap.set(
    'GetMembersResponse',
    registry.register('GetMembersResponse', memberSchemas.GetMembersResponseSchema),
  );
  registeredSchemaMap.set(
    'GetMemberDetailResponse',
    registry.register('GetMemberDetailResponse', memberSchemas.GetMemberDetailResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateBasicInfoRequest',
    registry.register('UpdateBasicInfoRequest', memberSchemas.UpdateBasicInfoRequestSchema),
  );
  registeredSchemaMap.set(
    'UpdateBasicInfoResponse',
    registry.register('UpdateBasicInfoResponse', memberSchemas.UpdateBasicInfoResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateHealthInfoRequest',
    registry.register('UpdateHealthInfoRequest', memberSchemas.UpdateHealthInfoRequestSchema),
  );
  registeredSchemaMap.set(
    'UpdateHealthInfoResponse',
    registry.register('UpdateHealthInfoResponse', memberSchemas.UpdateHealthInfoResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateMarketingConsentRequest',
    registry.register(
      'UpdateMarketingConsentRequest',
      memberSchemas.UpdateMarketingConsentRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'UpdateMarketingConsentResponse',
    registry.register(
      'UpdateMarketingConsentResponse',
      memberSchemas.UpdateMarketingConsentResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'PointAdjustmentRequest',
    registry.register('PointAdjustmentRequest', memberSchemas.PointAdjustmentRequestSchema),
  );
  registeredSchemaMap.set(
    'PointAdjustmentResponse',
    registry.register('PointAdjustmentResponse', memberSchemas.PointAdjustmentResponseSchema),
  );
  registeredSchemaMap.set(
    'GetPointsResponse',
    registry.register('GetPointsResponse', memberSchemas.GetPointsResponseSchema),
  );
  registeredSchemaMap.set(
    'CreateMemoRequest',
    registry.register('CreateMemoRequest', memberSchemas.CreateMemoRequestSchema),
  );
  registeredSchemaMap.set(
    'CreateMemoResponse',
    registry.register('CreateMemoResponse', memberSchemas.CreateMemoResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateMemoRequest',
    registry.register('UpdateMemoRequest', memberSchemas.UpdateMemoRequestSchema),
  );
  registeredSchemaMap.set(
    'UpdateMemoResponse',
    registry.register('UpdateMemoResponse', memberSchemas.UpdateMemoResponseSchema),
  );
  registeredSchemaMap.set(
    'GetMemosResponse',
    registry.register('GetMemosResponse', memberSchemas.GetMemosResponseSchema),
  );
  registeredSchemaMap.set(
    'ExportMembersRequest',
    registry.register('ExportMembersRequest', memberSchemas.ExportMembersRequestSchema),
  );
  registeredSchemaMap.set(
    'ExportMembersResponse',
    registry.register('ExportMembersResponse', memberSchemas.ExportMembersResponseSchema),
  );
  registeredSchemaMap.set(
    'ContractChange',
    registry.register('ContractChange', memberSchemas.ContractChangeSchema),
  );
  registeredSchemaMap.set(
    'MainContract',
    registry.register('MainContract', memberSchemas.MainContractSchema),
  );
  registeredSchemaMap.set(
    'OptionContract',
    registry.register('OptionContract', memberSchemas.OptionContractSchema),
  );
  registeredSchemaMap.set(
    'OptionChangeHistory',
    registry.register('OptionChangeHistory', memberSchemas.OptionChangeHistorySchema),
  );
  registeredSchemaMap.set(
    'SpecialContractItem',
    registry.register('SpecialContractItem', memberSchemas.SpecialContractItemSchema),
  );
  registeredSchemaMap.set(
    'SpecialContracts',
    registry.register('SpecialContracts', memberSchemas.SpecialContractsSchema),
  );
  registeredSchemaMap.set(
    'PaymentRecord',
    registry.register('PaymentRecord', memberSchemas.PaymentRecordSchema),
  );
  registeredSchemaMap.set(
    'PaymentInfo',
    registry.register('PaymentInfo', memberSchemas.PaymentInfoSchema),
  );
  registeredSchemaMap.set(
    'UnpaidInfo',
    registry.register('UnpaidInfo', memberSchemas.UnpaidInfoSchema),
  );
  registeredSchemaMap.set('Campaign', registry.register('Campaign', memberSchemas.CampaignSchema));
  registeredSchemaMap.set(
    'Campaigns',
    registry.register('Campaigns', memberSchemas.CampaignsSchema),
  );
  registeredSchemaMap.set(
    'GetContractsResponse',
    registry.register('GetContractsResponse', memberSchemas.GetContractsResponseSchema),
  );

  // Register membership application schemas
  registeredSchemaMap.set(
    'MembershipApplication',
    registry.register(
      'MembershipApplication',
      membershipApplicationSchemas.MembershipApplicationSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetMembershipApplicationsQuery',
    registry.register(
      'GetMembershipApplicationsQuery',
      membershipApplicationSchemas.GetMembershipApplicationsQuerySchema,
    ),
  );
  registeredSchemaMap.set(
    'GetMembershipApplicationsResponse',
    registry.register(
      'GetMembershipApplicationsResponse',
      membershipApplicationSchemas.GetMembershipApplicationsResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'AutoJudgeRequest',
    registry.register('AutoJudgeRequest', membershipApplicationSchemas.AutoJudgeRequestSchema),
  );
  registeredSchemaMap.set(
    'AutoJudgeResponse',
    registry.register('AutoJudgeResponse', membershipApplicationSchemas.AutoJudgeResponseSchema),
  );
  registeredSchemaMap.set(
    'GetSummaryQuery',
    registry.register('GetSummaryQuery', membershipApplicationSchemas.GetSummaryQuerySchema),
  );
  registeredSchemaMap.set(
    'GetSummaryResponse',
    registry.register('GetSummaryResponse', membershipApplicationSchemas.GetSummaryResponseSchema),
  );
  registeredSchemaMap.set(
    'MembershipApplicationSummary',
    registry.register(
      'MembershipApplicationSummary',
      membershipApplicationSchemas.MembershipApplicationSummarySchema,
    ),
  );
  registeredSchemaMap.set(
    'MembershipApplicationAlert',
    registry.register(
      'MembershipApplicationAlert',
      membershipApplicationSchemas.MembershipApplicationAlertSchema,
    ),
  );
  registeredSchemaMap.set(
    'RiskReasonsBreakdown',
    registry.register(
      'RiskReasonsBreakdown',
      membershipApplicationSchemas.RiskReasonsBreakdownSchema,
    ),
  );
  registeredSchemaMap.set(
    'BulkApproveRequest',
    registry.register('BulkApproveRequest', membershipApplicationSchemas.BulkApproveRequestSchema),
  );
  registeredSchemaMap.set(
    'BulkApproveResponse',
    registry.register(
      'BulkApproveResponse',
      membershipApplicationSchemas.BulkApproveResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetApplicationDetailResponse',
    registry.register(
      'GetApplicationDetailResponse',
      membershipApplicationSchemas.GetApplicationDetailResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'ApproveRequest',
    registry.register('ApproveRequest', membershipApplicationSchemas.ApproveRequestSchema),
  );
  registeredSchemaMap.set(
    'ApproveResponse',
    registry.register('ApproveResponse', membershipApplicationSchemas.ApproveResponseSchema),
  );
  registeredSchemaMap.set(
    'RejectRequest',
    registry.register('RejectRequest', membershipApplicationSchemas.RejectRequestSchema),
  );
  registeredSchemaMap.set(
    'RejectResponse',
    registry.register('RejectResponse', membershipApplicationSchemas.RejectResponseSchema),
  );
  registeredSchemaMap.set(
    'CancelRequest',
    registry.register('CancelRequest', membershipApplicationSchemas.CancelRequestSchema),
  );
  registeredSchemaMap.set(
    'CancelResponse',
    registry.register('CancelResponse', membershipApplicationSchemas.CancelResponseSchema),
  );
}
