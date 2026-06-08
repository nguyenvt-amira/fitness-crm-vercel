/**
 * Register all schemas with OpenAPI registry
 * This ensures schemas are extracted to components/schemas instead of being inline
 */
// Import all schemas
import * as authSchemas from '../_schemas/auth.schema';
import * as autoApprovalSchemas from '../_schemas/auto-approval.schema';
import * as blacklistSchemas from '../_schemas/blacklist.schema';
import * as brandSchemas from '../_schemas/brand.schema';
import * as familyRegistrationSchemas from '../_schemas/family-registration.schema';
import * as leaveSchemas from '../_schemas/leave.schema';
import * as mainContractSchemas from '../_schemas/main-contract.schema';
import * as memberSchemas from '../_schemas/member.schema';
import * as membershipApplicationSchemas from '../_schemas/membership-application.schema';
import * as positionSchemas from '../_schemas/position.schema';
import * as staffSchemas from '../_schemas/staff.schema';
import * as storeAccessSettingsSchemas from '../_schemas/store-access-settings.schema';
import * as storeSchemas from '../_schemas/store.schema';
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
    'MemberType',
    registry.register('MemberType', memberSchemas.MemberTypeSchema),
  );
  registeredSchemaMap.set(
    'ContractType',
    registry.register('ContractType', memberSchemas.ContractTypeSchema),
  );
  registeredSchemaMap.set(
    'MemberStatus',
    registry.register('MemberStatus', memberSchemas.MemberStatusSchema),
  );
  registeredSchemaMap.set('Brand', registry.register('Brand', memberSchemas.BrandSchema));
  registeredSchemaMap.set(
    'MainBrand',
    registry.register('MainBrand', memberSchemas.MainBrandSchema),
  );
  registeredSchemaMap.set('Gender', registry.register('Gender', memberSchemas.GenderSchema));
  registeredSchemaMap.set('MemoType', registry.register('MemoType', memberSchemas.MemoTypeSchema));
  registeredSchemaMap.set(
    'PointAdjustmentType',
    registry.register('PointAdjustmentType', memberSchemas.PointAdjustmentTypeSchema),
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
    'GetMembersSummaryResponse',
    registry.register('GetMembersSummaryResponse', memberSchemas.GetMembersSummaryResponseSchema),
  );
  registeredSchemaMap.set(
    'GetMemberDetailResponse',
    registry.register('GetMemberDetailResponse', memberSchemas.GetMemberDetailResponseSchema),
  );
  registeredSchemaMap.set(
    'GetMemberMainContractLabelsResponse',
    registry.register(
      'GetMemberMainContractLabelsResponse',
      memberSchemas.GetMemberMainContractLabelsResponseSchema,
    ),
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
    'StaffMemo',
    registry.register('StaffMemo', memberSchemas.StaffMemoSchema),
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
    'ExportMembersStatus',
    registry.register('ExportMembersStatus', memberSchemas.ExportMembersStatusSchema),
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
    'CampaignStatus',
    registry.register('CampaignStatus', memberSchemas.CampaignStatusSchema),
  );
  registeredSchemaMap.set(
    'GetContractsResponse',
    registry.register('GetContractsResponse', memberSchemas.GetContractsResponseSchema),
  );
  registeredSchemaMap.set(
    'TrainingRecordsPeriod',
    registry.register('TrainingRecordsPeriod', memberSchemas.TrainingRecordsPeriodSchema),
  );
  registeredSchemaMap.set(
    'GetTrainingRecordsPathParams',
    registry.register(
      'GetTrainingRecordsPathParams',
      memberSchemas.GetTrainingRecordsPathParamsSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetTrainingRecordsQuery',
    registry.register('GetTrainingRecordsQuery', memberSchemas.GetTrainingRecordsQuerySchema),
  );
  registeredSchemaMap.set(
    'TrainingRecordItem',
    registry.register('TrainingRecordItem', memberSchemas.TrainingRecordItemSchema),
  );
  registeredSchemaMap.set(
    'TrainingRecordSummary',
    registry.register('TrainingRecordSummary', memberSchemas.TrainingRecordSummarySchema),
  );
  registeredSchemaMap.set(
    'GetTrainingRecordsResponse',
    registry.register('GetTrainingRecordsResponse', memberSchemas.GetTrainingRecordsResponseSchema),
  );
  registeredSchemaMap.set(
    'BodyDataSource',
    registry.register('BodyDataSource', memberSchemas.BodyDataSourceSchema),
  );
  registeredSchemaMap.set(
    'GetBodyDataPathParams',
    registry.register('GetBodyDataPathParams', memberSchemas.GetBodyDataPathParamsSchema),
  );
  registeredSchemaMap.set(
    'BodyDataLatestSummary',
    registry.register('BodyDataLatestSummary', memberSchemas.BodyDataLatestSummarySchema),
  );
  registeredSchemaMap.set(
    'BodyComposition',
    registry.register('BodyComposition', memberSchemas.BodyCompositionSchema),
  );
  registeredSchemaMap.set(
    'BodyMeasurement',
    registry.register('BodyMeasurement', memberSchemas.BodyMeasurementSchema),
  );
  registeredSchemaMap.set(
    'BodyDataHistoryItem',
    registry.register('BodyDataHistoryItem', memberSchemas.BodyDataHistoryItemSchema),
  );
  registeredSchemaMap.set(
    'BodyWeightChartItem',
    registry.register('BodyWeightChartItem', memberSchemas.BodyWeightChartItemSchema),
  );
  registeredSchemaMap.set(
    'GetBodyDataResponse',
    registry.register('GetBodyDataResponse', memberSchemas.GetBodyDataResponseSchema),
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
    'MembershipApplicationPaymentMethod',
    registry.register(
      'MembershipApplicationPaymentMethod',
      membershipApplicationSchemas.MembershipApplicationPaymentMethodSchema,
    ),
  );
  registeredSchemaMap.set(
    'MembershipApplicationPaymentStatus',
    registry.register(
      'MembershipApplicationPaymentStatus',
      membershipApplicationSchemas.MembershipApplicationPaymentStatusSchema,
    ),
  );
  registeredSchemaMap.set(
    'MembershipApplicationStatus',
    registry.register(
      'MembershipApplicationStatus',
      membershipApplicationSchemas.MembershipApplicationStatusSchema,
    ),
  );
  registeredSchemaMap.set(
    'RiskReason',
    registry.register('RiskReason', membershipApplicationSchemas.RiskReasonSchema),
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
    'GetApplicationDetailResponse',
    registry.register(
      'GetApplicationDetailResponse',
      membershipApplicationSchemas.GetApplicationDetailResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'UpdateMembershipApplicationRequest',
    registry.register(
      'UpdateMembershipApplicationRequest',
      membershipApplicationSchemas.UpdateMembershipApplicationRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'UpdateMembershipApplicationResponse',
    registry.register(
      'UpdateMembershipApplicationResponse',
      membershipApplicationSchemas.UpdateMembershipApplicationResponseSchema,
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

  // Register family registration schemas
  registeredSchemaMap.set(
    'FamilyMember',
    registry.register('FamilyMember', familyRegistrationSchemas.FamilyMemberSchema),
  );
  registeredSchemaMap.set(
    'PrimaryMemberStatus',
    registry.register('PrimaryMemberStatus', familyRegistrationSchemas.PrimaryMemberStatusSchema),
  );
  registeredSchemaMap.set(
    'PrimaryMemberType',
    registry.register('PrimaryMemberType', familyRegistrationSchemas.PrimaryMemberTypeSchema),
  );
  registeredSchemaMap.set(
    'FamilyRegistrationRiskReason',
    registry.register(
      'FamilyRegistrationRiskReason',
      familyRegistrationSchemas.FamilyRegistrationRiskReasonSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetFamilyMembersResponse',
    registry.register(
      'GetFamilyMembersResponse',
      familyRegistrationSchemas.GetFamilyMembersResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'CheckPrimaryMemberRequest',
    registry.register(
      'CheckPrimaryMemberRequest',
      familyRegistrationSchemas.CheckPrimaryMemberRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'CheckPrimaryMemberResponse',
    registry.register(
      'CheckPrimaryMemberResponse',
      familyRegistrationSchemas.CheckPrimaryMemberResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'RiskEvaluationRequest',
    registry.register(
      'RiskEvaluationRequest',
      familyRegistrationSchemas.RiskEvaluationRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'RiskEvaluationResponse',
    registry.register(
      'RiskEvaluationResponse',
      familyRegistrationSchemas.RiskEvaluationResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'FamilyRegistration',
    registry.register('FamilyRegistration', familyRegistrationSchemas.FamilyRegistrationSchema),
  );
  registeredSchemaMap.set(
    'GetFamilyRegistrationsQuery',
    registry.register(
      'GetFamilyRegistrationsQuery',
      familyRegistrationSchemas.GetFamilyRegistrationsQuerySchema,
    ),
  );
  registeredSchemaMap.set(
    'GetFamilyRegistrationsResponse',
    registry.register(
      'GetFamilyRegistrationsResponse',
      familyRegistrationSchemas.GetFamilyRegistrationsResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetFamilyRegistrationDetailResponse',
    registry.register(
      'GetFamilyRegistrationDetailResponse',
      familyRegistrationSchemas.GetFamilyRegistrationDetailResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'CreateFamilyRegistrationRequest',
    registry.register(
      'CreateFamilyRegistrationRequest',
      familyRegistrationSchemas.CreateFamilyRegistrationRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'CreateFamilyRegistrationResponse',
    registry.register(
      'CreateFamilyRegistrationResponse',
      familyRegistrationSchemas.CreateFamilyRegistrationResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'ApproveFamilyRegistrationRequest',
    registry.register(
      'ApproveFamilyRegistrationRequest',
      familyRegistrationSchemas.ApproveFamilyRegistrationRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'ApproveFamilyRegistrationResponse',
    registry.register(
      'ApproveFamilyRegistrationResponse',
      familyRegistrationSchemas.ApproveFamilyRegistrationResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'RejectFamilyRegistrationRequest',
    registry.register(
      'RejectFamilyRegistrationRequest',
      familyRegistrationSchemas.RejectFamilyRegistrationRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'RejectFamilyRegistrationResponse',
    registry.register(
      'RejectFamilyRegistrationResponse',
      familyRegistrationSchemas.RejectFamilyRegistrationResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'CompleteFamilyRegistrationRequest',
    registry.register(
      'CompleteFamilyRegistrationRequest',
      familyRegistrationSchemas.CompleteFamilyRegistrationRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'CompleteFamilyRegistrationResponse',
    registry.register(
      'CompleteFamilyRegistrationResponse',
      familyRegistrationSchemas.CompleteFamilyRegistrationResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetFamilyRegistrationsSummaryResponse',
    registry.register(
      'GetFamilyRegistrationsSummaryResponse',
      familyRegistrationSchemas.GetFamilyRegistrationsSummaryResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetFamilyRegistrationsDashboardResponse',
    registry.register(
      'GetFamilyRegistrationsDashboardResponse',
      familyRegistrationSchemas.GetFamilyRegistrationsDashboardResponseSchema,
    ),
  );

  // Register position / store masters
  registeredSchemaMap.set(
    'PositionRoleCategory',
    registry.register('PositionRoleCategory', positionSchemas.PositionRoleCategorySchema),
  );
  registeredSchemaMap.set(
    'PositionFeatures',
    registry.register('PositionFeatures', positionSchemas.PositionFeaturesSchema),
  );
  registeredSchemaMap.set(
    'Position',
    registry.register('Position', positionSchemas.PositionSchema),
  );
  registeredSchemaMap.set(
    'StaffPermissionRecord',
    registry.register('StaffPermissionRecord', positionSchemas.StaffPermissionRecordSchema),
  );
  registeredSchemaMap.set(
    'GetPositionsResponse',
    registry.register('GetPositionsResponse', positionSchemas.GetPositionsResponseSchema),
  );
  registeredSchemaMap.set(
    'MainContractType',
    registry.register('MainContractType', mainContractSchemas.MainContractTypeSchema),
  );
  registeredSchemaMap.set(
    'MainContractStatus',
    registry.register('MainContractStatus', mainContractSchemas.MainContractStatusSchema),
  );
  registeredSchemaMap.set(
    'MainContractOtherStoreUsage',
    registry.register(
      'MainContractOtherStoreUsage',
      mainContractSchemas.MainContractOtherStoreUsageSchema,
    ),
  );
  registeredSchemaMap.set(
    'MainContractListItem',
    registry.register('MainContractListItem', mainContractSchemas.MainContractListItemSchema),
  );
  registeredSchemaMap.set(
    'GetMainContractsQuery',
    registry.register('GetMainContractsQuery', mainContractSchemas.GetMainContractsQuerySchema),
  );
  registeredSchemaMap.set(
    'GetMainContractsResponse',
    registry.register(
      'GetMainContractsResponse',
      mainContractSchemas.GetMainContractsResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'StoreMainContractStatus',
    registry.register('StoreMainContractStatus', storeSchemas.StoreMainContractStatusSchema),
  );
  registeredSchemaMap.set(
    'MutualUseType',
    registry.register('MutualUseType', storeSchemas.MutualUseTypeSchema),
  );
  registeredSchemaMap.set(
    'StoreListBrand',
    registry.register('StoreListBrand', storeSchemas.StoreListBrandSchema),
  );
  registeredSchemaMap.set(
    'StoreArea',
    registry.register('StoreArea', storeSchemas.StoreAreaSchema),
  );
  registeredSchemaMap.set(
    'StoreListStatus',
    registry.register('StoreListStatus', storeSchemas.StoreListStatusSchema),
  );
  registeredSchemaMap.set('Store', registry.register('Store', storeSchemas.StoreSchema));
  registeredSchemaMap.set(
    'GetStoresQuery',
    registry.register('GetStoresQuery', storeSchemas.GetStoresQuerySchema),
  );
  registeredSchemaMap.set(
    'GetStoresResponse',
    registry.register('GetStoresResponse', storeSchemas.GetStoresResponseSchema),
  );
  registeredSchemaMap.set(
    'PermittedStore',
    registry.register('PermittedStore', storeAccessSettingsSchemas.PermittedStoreSchema),
  );
  registeredSchemaMap.set(
    'JoyUsageFee',
    registry.register('JoyUsageFee', storeAccessSettingsSchemas.JoyUsageFeeSchema),
  );
  registeredSchemaMap.set(
    'StoreAccessSettings',
    registry.register('StoreAccessSettings', storeAccessSettingsSchemas.StoreAccessSettingsSchema),
  );
  registeredSchemaMap.set(
    'GetStoreAccessSettingsResponse',
    registry.register(
      'GetStoreAccessSettingsResponse',
      storeAccessSettingsSchemas.GetStoreAccessSettingsResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'UpdateStoreAccessSettingsRequest',
    registry.register(
      'UpdateStoreAccessSettingsRequest',
      storeAccessSettingsSchemas.UpdateStoreAccessSettingsRequestSchema,
    ),
  );
  registeredSchemaMap.set(
    'UpdateStoreAccessSettingsResponse',
    registry.register(
      'UpdateStoreAccessSettingsResponse',
      storeAccessSettingsSchemas.UpdateStoreAccessSettingsResponseSchema,
    ),
  );

  // Register business hours schemas
  registeredSchemaMap.set(
    'DayOfWeek',
    registry.register('DayOfWeek', storeSchemas.DayOfWeekSchema),
  );
  registeredSchemaMap.set(
    'DefaultHoursEntry',
    registry.register('DefaultHoursEntry', storeSchemas.DefaultHoursEntrySchema),
  );
  registeredSchemaMap.set(
    'ExceptionHoursEntry',
    registry.register('ExceptionHoursEntry', storeSchemas.ExceptionHoursEntrySchema),
  );
  registeredSchemaMap.set(
    'TemporaryClosureEntry',
    registry.register('TemporaryClosureEntry', storeSchemas.TemporaryClosureEntrySchema),
  );
  registeredSchemaMap.set(
    'StoreBusinessHours',
    registry.register('StoreBusinessHours', storeSchemas.StoreBusinessHoursSchema),
  );
  registeredSchemaMap.set(
    'UpdateStoreBusinessHoursPayload',
    registry.register(
      'UpdateStoreBusinessHoursPayload',
      storeSchemas.UpdateStoreBusinessHoursPayloadSchema,
    ),
  );
  registeredSchemaMap.set(
    'GetStoreBusinessHoursResponse',
    registry.register(
      'GetStoreBusinessHoursResponse',
      storeSchemas.GetStoreBusinessHoursResponseSchema,
    ),
  );
  registeredSchemaMap.set(
    'UpdateStoreBusinessHoursResponse',
    registry.register(
      'UpdateStoreBusinessHoursResponse',
      storeSchemas.UpdateStoreBusinessHoursResponseSchema,
    ),
  );

  // Register staff enum schemas
  registeredSchemaMap.set(
    'StaffRole',
    registry.register('StaffRole', staffSchemas.StaffRoleSchema),
  );
  registeredSchemaMap.set(
    'StaffLinkageType',
    registry.register('StaffLinkageType', staffSchemas.StaffLinkageTypeSchema),
  );
  registeredSchemaMap.set(
    'StaffLinkage',
    registry.register('StaffLinkage', staffSchemas.StaffLinkageSchema),
  );
  registeredSchemaMap.set(
    'StaffStatus',
    registry.register('StaffStatus', staffSchemas.StaffStatusSchema),
  );
  registeredSchemaMap.set(
    'StaffBrand',
    registry.register('StaffBrand', staffSchemas.StaffBrandSchema),
  );
  registeredSchemaMap.set(
    'ManagedBrandCode',
    registry.register('ManagedBrandCode', brandSchemas.ManagedBrandCodeSchema),
  );
  registeredSchemaMap.set(
    'BrandItem',
    registry.register('BrandItem', brandSchemas.BrandItemSchema),
  );
  registeredSchemaMap.set(
    'GetBrandsResponse',
    registry.register('GetBrandsResponse', brandSchemas.GetBrandsResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateBrandRequest',
    registry.register('UpdateBrandRequest', brandSchemas.UpdateBrandRequestSchema),
  );
  registeredSchemaMap.set(
    'UpdateBrandResponse',
    registry.register('UpdateBrandResponse', brandSchemas.UpdateBrandResponseSchema),
  );

  // Register staff schemas
  registeredSchemaMap.set(
    'StaffListItem',
    registry.register('StaffListItem', staffSchemas.StaffListItemSchema),
  );
  registeredSchemaMap.set(
    'StaffPersonalInfo',
    registry.register('StaffPersonalInfo', staffSchemas.StaffPersonalInfoSchema),
  );
  registeredSchemaMap.set(
    'StaffLoginSettings',
    registry.register('StaffLoginSettings', staffSchemas.StaffLoginSettingsSchema),
  );
  registeredSchemaMap.set(
    'StaffAdditionalPermissions',
    registry.register('StaffAdditionalPermissions', staffSchemas.StaffAdditionalPermissionsSchema),
  );
  registeredSchemaMap.set(
    'StaffPermissionSettings',
    registry.register('StaffPermissionSettings', staffSchemas.StaffPermissionSettingsSchema),
  );
  registeredSchemaMap.set(
    'StaffEditableScope',
    registry.register('StaffEditableScope', staffSchemas.StaffEditableScopeSchema),
  );
  registeredSchemaMap.set(
    'StaffDetail',
    registry.register('StaffDetail', staffSchemas.StaffDetailSchema),
  );
  registeredSchemaMap.set(
    'GetStaffsQuery',
    registry.register('GetStaffsQuery', staffSchemas.GetStaffsQuerySchema),
  );
  registeredSchemaMap.set(
    'GetStaffsResponse',
    registry.register('GetStaffsResponse', staffSchemas.GetStaffsResponseSchema),
  );
  registeredSchemaMap.set(
    'GetStaffDetailResponse',
    registry.register('GetStaffDetailResponse', staffSchemas.GetStaffDetailResponseSchema),
  );
  registeredSchemaMap.set(
    'UpdateStaffRequest',
    registry.register('UpdateStaffRequest', staffSchemas.UpdateStaffRequestSchema),
  );
  registeredSchemaMap.set(
    'UpdateStaffResponse',
    registry.register('UpdateStaffResponse', staffSchemas.UpdateStaffResponseSchema),
  );
  registeredSchemaMap.set(
    'InviteStaffRequest',
    registry.register('InviteStaffRequest', staffSchemas.InviteStaffRequestSchema),
  );
  registeredSchemaMap.set(
    'InviteStaffResponse',
    registry.register('InviteStaffResponse', staffSchemas.InviteStaffResponseSchema),
  );
  registeredSchemaMap.set(
    'DeleteStaffResponse',
    registry.register('DeleteStaffResponse', staffSchemas.DeleteStaffResponseSchema),
  );

  // Register leave schemas
  registeredSchemaMap.set(
    'LeaveType',
    registry.register('LeaveType', leaveSchemas.LeaveTypeSchema),
  );
  registeredSchemaMap.set(
    'LeaveStatus',
    registry.register('LeaveStatus', leaveSchemas.LeaveStatusSchema),
  );
  registeredSchemaMap.set(
    'LeaveListItem',
    registry.register('LeaveListItem', leaveSchemas.LeaveListItemSchema),
  );
  registeredSchemaMap.set(
    'GetLeavesQuery',
    registry.register('GetLeavesQuery', leaveSchemas.GetLeavesQuerySchema),
  );
  registeredSchemaMap.set(
    'GetLeavesResponse',
    registry.register('GetLeavesResponse', leaveSchemas.GetLeavesResponseSchema),
  );
  registeredSchemaMap.set(
    'LeaveErrorResponse',
    registry.register('LeaveErrorResponse', leaveSchemas.ErrorResponseSchema),
  );

  // Register blacklist schemas
  registeredSchemaMap.set(
    'BlacklistRegistrationSource',
    registry.register(
      'BlacklistRegistrationSource',
      blacklistSchemas.BlacklistRegistrationSourceSchema,
    ),
  );
  registeredSchemaMap.set(
    'BlacklistManualReason',
    registry.register('BlacklistManualReason', blacklistSchemas.BlacklistManualReasonSchema),
  );
  registeredSchemaMap.set(
    'UnpaidFilter',
    registry.register('UnpaidFilter', blacklistSchemas.UnpaidFilterSchema),
  );

  // Register withdraw schemas
  registeredSchemaMap.set(
    'WithdrawReason',
    registry.register('WithdrawReason', memberSchemas.WithdrawReasonSchema),
  );

  // Register gate stop schemas
  registeredSchemaMap.set(
    'GateStopInfo',
    registry.register('GateStopInfo', memberSchemas.GateStopInfoSchema),
  );
  registeredSchemaMap.set(
    'GateStopReason',
    registry.register('GateStopReason', memberSchemas.GateStopReasonSchema),
  );
  registeredSchemaMap.set(
    'GateStopScope',
    registry.register('GateStopScope', memberSchemas.GateStopScopeSchema),
  );
  registeredSchemaMap.set(
    'GateStopRequest',
    registry.register('GateStopRequest', memberSchemas.GateStopRequestSchema),
  );
  registeredSchemaMap.set(
    'GateStopResponse',
    registry.register('GateStopResponse', memberSchemas.GateStopResponseSchema),
  );
  registeredSchemaMap.set(
    'GateStopReleaseReason',
    registry.register('GateStopReleaseReason', memberSchemas.GateStopReleaseReasonSchema),
  );
  registeredSchemaMap.set(
    'GateStopReleaseRequest',
    registry.register('GateStopReleaseRequest', memberSchemas.GateStopReleaseRequestSchema),
  );
  registeredSchemaMap.set(
    'GateStopReleaseResponse',
    registry.register('GateStopReleaseResponse', memberSchemas.GateStopReleaseResponseSchema),
  );
}
