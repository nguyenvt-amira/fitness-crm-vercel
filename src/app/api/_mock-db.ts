/**
 * Shared in-memory mock database for all CRM API routes.
 * All APIs should read/update data through this module so list and detail stay in sync.
 */
import type { BrandItem } from '@/app/api/_schemas/brand.schema';
import type {
  EkycResult,
  FamilyRegistrationStatus,
  FamilyRelationship,
} from '@/app/api/_schemas/family-registration.schema';
import type { MainContractListItem } from '@/app/api/_schemas/main-contract.schema';
import type {
  ContractType,
  CreateMemberRequest,
  GetMemberDetailResponse,
  PaymentSummary,
  UpdateBasicInfoRequest,
  UpdateHealthInfoRequest,
  UpdateMarketingConsentRequest,
  UpdateMemberRequest,
} from '@/app/api/_schemas/member.schema';
import type { OptionMasterListItem } from '@/app/api/_schemas/option-master.schema';
import type { Position, StaffPermissionRecord } from '@/app/api/_schemas/position.schema';
import type { StaffDetail, StaffListItem } from '@/app/api/_schemas/staff.schema';
import type { StoreAccessSettings } from '@/app/api/_schemas/store-access-settings.schema';
import type {
  StoreLinkedMainContract,
  StoreLinkedOption,
} from '@/app/api/_schemas/store-sales-settings.schema';
import type { Store, StoreBusinessHours } from '@/app/api/_schemas/store.schema';
import type { ApprovalHistoryItem, TransferDetail } from '@/app/api/_schemas/transfer.schema';

import type { GetContractsResponse } from '@/lib/api/types.gen';
import { Brand, MainBrand, MemberStatus, MemberType } from '@/lib/api/types.gen';

import type {
  MembershipApplication,
  MembershipApplicationStatus,
  RiskReason,
} from '@/types/api/membership-application.type';
import { TransferStatus } from '@/types/transfer.type';

export type TransferRow = TransferDetail;

export const DEFAULT_MEMBER_MAIN_CONTRACT: string = 'レギュラー会員';
const DEFAULT_MEMBER_MAIN_CONTRACT_ID = 'MC001';

export type MembershipApplicationContractDetails = {
  plan_id: string;
  plan_name: string;
  start_date: string; // YYYY-MM-DD
  option_ids?: string[];
};

export type MembershipApplicationDetails = Partial<{
  // Basic info
  applicant_name: string;
  gender: 'male' | 'female' | 'other';
  blood_type: 'A' | 'B' | 'O' | 'AB' | 'unknown';
  birthday: string; // YYYY-MM-DD
  // Contact
  applicant_email: string;
  applicant_phone: string;
  applicant_address: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  // Contract
  contract_details: MembershipApplicationContractDetails;
  // eKYC
  ekyc: EkycResult;
}>;

function familyRelationshipToJa(rel: FamilyRelationship): string {
  const labels: Record<FamilyRelationship, string> = {
    spouse: '配偶者',
    child: '子',
    parent: '親',
    sibling: '兄弟',
    grandparent: '祖父母',
    grandchild: '孫',
  };
  return labels[rel] ?? rel;
}

interface GetMembersResponseMember {
  id: string;
  old_member_number: string;
  member_number: string;
  name_kanji: string;
  name_kana: string;
  member_type: NonNullable<GetMemberDetailResponse['profile']>['member_type'];
  contract_type: ContractType;
  status: NonNullable<GetMemberDetailResponse['profile']>['status'];
  store_name: string;
  store_id: string;
  brand: NonNullable<GetMemberDetailResponse['profile']>['brand'];
  contract_name: string;
  contract_id: string;
  joined_at: string;
  last_visit_date?: string;
  has_unpaid: boolean;
  phone: string;
  email: string;
}

// List-only fields stored with Member for list view
interface MemberListMeta {
  contract_id: string;
  contract_name: string;
  contract_type: ContractType;
  last_visit_date?: string;
  has_unpaid: boolean;
}
type Member = GetMemberDetailResponse;
type MemberRow = Member & { _listMeta?: MemberListMeta };

/** Position master seed (positions table) — mirrors 職位マスター */
const SEED_POSITION_ROWS: Position[] = [
  {
    id: 1,
    role: 'headquarter',
    position_name: '本部管理者',
    features: { summary_ja: '全機能・全データ', scope: 'all' },
  },
  {
    id: 2,
    role: 'manager',
    position_name: 'ブロック長',
    features: { summary_ja: '複数エリア横断', scope: 'multi_area' },
  },
  {
    id: 3,
    role: 'manager',
    position_name: 'テリトリーマネージャー',
    features: { summary_ja: '複数店舗横断', scope: 'multi_store' },
  },
  {
    id: 4,
    role: 'manager',
    position_name: 'テリトリーMGR',
    features: { summary_ja: 'G-04運用型アンケート作成 (v2.3)', survey: 'G-04' },
  },
  {
    id: 5,
    role: 'staff',
    position_name: '店舗責任者',
    features: { summary_ja: '店舗運用・一部マネージャ権限', scope: 'store_admin' },
  },
  {
    id: 6,
    role: 'staff',
    position_name: '正社員スタッフ',
    features: { summary_ja: '日常店舗運用', scope: 'store_daily' },
  },
  {
    id: 7,
    role: 'staff',
    position_name: '契約社員スタッフ',
    features: { summary_ja: '日常店舗運用', scope: 'store_daily' },
  },
  {
    id: 8,
    role: 'staff',
    position_name: 'アルバイト（スーパー）',
    features: { summary_ja: '店舗業務広範囲', scope: 'store_wide' },
  },
  {
    id: 9,
    role: 'staff',
    position_name: 'アルバイト（一般）',
    features: { summary_ja: '店舗業務限定', scope: 'store_limited' },
  },
  {
    id: 10,
    role: 'staff',
    position_name: 'FC企業管理者',
    features: { summary_ja: '管轄FC店舗参照・Y-03', scope: 'fc_admin' },
  },
  {
    id: 11,
    role: 'trainer',
    position_name: '社員トレーナー',
    features: { summary_ja: 'レッスン運用特化', scope: 'lesson' },
  },
  {
    id: 12,
    role: 'trainer',
    position_name: '社外トレーナー',
    features: { summary_ja: 'レッスン運用（外部認証）', scope: 'lesson_external' },
  },
  {
    id: 13,
    role: 'observer',
    position_name: '閲覧専任',
    features: { summary_ja: '参照のみ', scope: 'read_only' },
  },
];

function positionNameById(id: number): string {
  return SEED_POSITION_ROWS.find((p) => p.id === id)?.position_name ?? '';
}

function defaultPositionIdByRole(role: StaffListItem['role']): number {
  return SEED_POSITION_ROWS.find((position) => position.role === role)?.id ?? 6;
}

/** ブランドマスタ */
const SEED_BRAND_ROWS: BrandItem[] = [
  {
    brand_id: 'brand-all',
    code: 'all',
    display_name: '全ブランド',
    enrollment_fee_yen: 0,
    handling_fee_yen: 0,
    currency: 'JPY',
    sort_order: 0,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T10:30:00.000Z',
    updated_by: 'STF-001',
  },
  {
    brand_id: 'brand-joyfit',
    code: 'joyfit',
    display_name: 'JOYFIT',
    enrollment_fee_yen: 3300,
    handling_fee_yen: 1100,
    currency: 'JPY',
    sort_order: 1,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T10:30:00.000Z',
    updated_by: 'STF-001',
  },
  {
    brand_id: 'brand-fit365',
    code: 'fit365',
    display_name: 'FIT365',
    enrollment_fee_yen: 3000,
    handling_fee_yen: 880,
    currency: 'JPY',
    sort_order: 2,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T10:30:00.000Z',
    updated_by: 'STF-001',
  },
  {
    brand_id: 'brand-joyfit24',
    code: 'joyfit24',
    display_name: 'JOYFIT24',
    enrollment_fee_yen: 3300,
    handling_fee_yen: 1100,
    currency: 'JPY',
    sort_order: 3,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T10:30:00.000Z',
    updated_by: 'STF-001',
  },
  {
    brand_id: 'brand-joyfit-yoga',
    code: 'joyfit_yoga',
    display_name: 'JOYFIT YOGA',
    enrollment_fee_yen: 3300,
    handling_fee_yen: 1100,
    currency: 'JPY',
    sort_order: 4,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T10:30:00.000Z',
    updated_by: 'STF-001',
  },
  {
    brand_id: 'brand-joyfit-plus',
    code: 'joyfit_plus',
    display_name: 'JOYFIT+',
    enrollment_fee_yen: 3300,
    handling_fee_yen: 1100,
    currency: 'JPY',
    sort_order: 5,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2026-03-15T10:30:00.000Z',
    updated_by: 'STF-001',
  },
];

/** Resolve brand label from brand master with fallback */
function staffBrandDisplayName(code: string): string {
  const y07 = SEED_BRAND_ROWS.find((b) => b.code === code);
  if (y07) return y07.display_name;
  const fallbacks: Record<string, string> = {
    all: '全ブランド',
    joyfit24: 'JOYFIT24',
    joyfit_yoga: 'JOYFIT YOGA',
    joyfit_plus: 'JOYFIT+',
  };
  return fallbacks[code] ?? code;
}

type ContractRow = {
  contract_id: string;
  member_id?: string;
  /**
   * For traceability in mocks: which membership application created this contract (if any).
   */
  application_id?: string;
  created_at: string;
  data: GetContractsResponse;
};

type MemberProfile = NonNullable<GetMemberDetailResponse['profile']>;

function resolveContractTypeFromMemberType(memberType: MemberProfile['member_type']): ContractType {
  if (memberType === 'family') return 'family';
  if (memberType === 'one_day_member') return 'one_day_member';
  return 'regular';
}

function resolveBrand(input: string | undefined, fallback: Brand): Brand {
  if (!input) return fallback;
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  const brandValues = Object.values(Brand) as string[];
  const matched = brandValues.find((value) => value.toLowerCase() === normalized);
  if (matched) return matched as Brand;
  return fallback;
}

function resolveMainBrand(input: string | undefined, fallback: MainBrand = 'fit365'): MainBrand {
  if (!input) return fallback;
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  if (normalized === 'fit365') return 'fit365';
  if (normalized.startsWith('joyfit')) return 'joyfit';
  return fallback;
}

function createMember(
  id: string,
  listMeta: {
    name_kanji: string;
    name_kana: string;
    phone: string;
    email: string;
    birthday: string;
    gender: 'male' | 'female' | 'other';
    member_type: MemberProfile['member_type'];
    contract_type: ContractType;
    status: MemberProfile['status'];
    store_id: string;
    store_name: string;
    brand: MemberProfile['brand'];
    joined_at: string;
    contract_id: string;
    contract_name: string;
    last_visit_date?: string;
    has_unpaid: boolean;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_phone: string;
    in_cancellation_period: boolean;
    is_option_restricted: boolean;
  },
): MemberRow {
  return {
    basic_info: {
      id,
      old_member_number: 'O-' + id,
      member_number: id,
      name_kanji: listMeta.name_kanji,
      name_kana: listMeta.name_kana,
      birthday: listMeta.birthday,
      age: calculateAgeFromBirthday(listMeta.birthday),
      gender: listMeta.gender,
      postal_code: '',
      prefecture: '',
      city: '',
      address: '',
      building: '',
      phone: listMeta.phone,
      email: listMeta.email,
      emergency_contact: {
        name: listMeta.emergency_contact_name,
        relationship: listMeta.emergency_contact_relationship,
        phone: listMeta.emergency_contact_phone,
      },
      notes: '',
    },
    constraints: {
      hasUnpaidFee: listMeta.has_unpaid ?? false,
      inCancellationPeriod: listMeta.in_cancellation_period ?? false,
      isOptionRestricted: listMeta.is_option_restricted ?? false,
    },
    profile: {
      member_type: listMeta.member_type,
      status: listMeta.status,
      contract_id: listMeta.contract_id,
      store_id: listMeta.store_id,
      store_name: listMeta.store_name,
      brand: listMeta.brand,
      main_brand: resolveMainBrand(listMeta.brand),
      joined_at: listMeta.joined_at,
      contract_name: listMeta.contract_name,
      is_black_listed: false,
    },
    ekyc: {
      verified: true,
      verified_at: '2024-01-15T10:30:00+09:00',
      document_type: '運転免許証',
    },
    consent: {
      member_agreement: {
        version: '2.1',
        agreed_at: '2024-01-15T10:00:00+09:00',
      },
      privacy_policy: {
        version: '1.5',
        agreed_at: '2024-01-15T10:00:00+09:00',
      },
      optional_agreement: {
        version: '1.0',
        agreed_at: '2024-01-20T14:00:00+09:00',
      },
      marketing_consent: {
        email: true,
        sms: false,
        push: true,
      },
    },
    health_info: {
      health_status: '良好',
      medical_history: '特になし',
      allergies: 'なし',
      exercise_restrictions: '特になし',
    },
    _listMeta: {
      contract_id: listMeta.contract_id,
      contract_name: listMeta.contract_name,
      contract_type: listMeta.contract_type,
      last_visit_date: listMeta.last_visit_date,
      has_unpaid: listMeta.has_unpaid,
    },
  };
}

function calculateAgeFromBirthday(birthday: string): number {
  const [yearText, monthText, dayText] = birthday.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function memberToListItem(m: MemberRow): GetMembersResponseMember {
  const meta = m._listMeta;
  const contractName =
    meta?.contract_name ??
    (m.profile as { contract_name?: string | null } | undefined)?.contract_name ??
    DEFAULT_MEMBER_MAIN_CONTRACT;
  return {
    id: m.basic_info.id,
    old_member_number: m.basic_info.old_member_number,
    member_number: m.basic_info.member_number,
    name_kanji: m.basic_info.name_kanji,
    name_kana: m.basic_info.name_kana,
    member_type: m.profile.member_type,
    contract_type: meta?.contract_type ?? 'regular',
    status: m.profile.status,
    store_id: m.profile.store_id,
    store_name: m.profile.store_name,
    brand: m.profile.brand,
    joined_at: m.profile.joined_at,
    phone: m.basic_info.phone,
    email: m.basic_info.email,
    contract_id: meta?.contract_id ?? meta?.contract_id ?? 'MC001',
    contract_name: contractName,
    last_visit_date: meta?.last_visit_date,
    has_unpaid: meta?.has_unpaid ?? false,
  };
}

function toIsoDate(d: Date): string {
  return d.toISOString().split('T')[0]!;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function buildPaymentHistory(
  startDate: string,
  monthlyFee: number,
): GetContractsResponse['payment_info']['payment_history'] {
  const records = [];
  const start = new Date(startDate);
  const now = new Date();
  let cursor = new Date(start);
  cursor.setDate(27);
  if (cursor < start) cursor = addMonths(cursor, 1);
  let month = 0;
  while (cursor <= now && month < 12) {
    const failed = month === 2; // simulate one failed payment
    records.push({
      date: toIsoDate(cursor),
      amount: monthlyFee,
      breakdown: `月会費 ${monthlyFee.toLocaleString()}円`,
      status: (failed ? 'failed' : 'success') as 'success' | 'failed',
      notes: failed ? '残高不足' : undefined,
    });
    cursor = addMonths(cursor, 1);
    month++;
  }
  return records.reverse(); // newest first
}

function buildMemberContractData(input: {
  plan_name: string;
  start_date: string;
  monthly_fee: number;
  created_at: string;
}): GetContractsResponse {
  const start = new Date(input.start_date);
  const penaltyEnd = addMonths(start, 12);
  penaltyEnd.setDate(penaltyEnd.getDate() - 1);

  const campaignStart = toIsoDate(addMonths(start, -1));
  const campaignEnd = toIsoDate(addMonths(start, 5));
  const now = new Date();
  const remainingMs = new Date(campaignEnd).getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

  const historyStart = toIsoDate(addMonths(start, -4));
  const historyEnd = toIsoDate(addMonths(start, -1));

  return {
    main_contract: {
      plan_name: input.plan_name,
      monthly_fee: input.monthly_fee,
      start_date: input.start_date,
      penalty_period_end: toIsoDate(penaltyEnd),
      change_history: [
        {
          changed_at: input.created_at,
          previous_plan: '—',
          new_plan: input.plan_name,
          reason: '入会',
        },
      ],
    },
    option_contracts: [],
    option_change_history: [],
    special_contracts: {
      anshin_support: { enrolled: false },
      mutual_use: { enrolled: false },
      security_fee: { enrolled: false },
      maintenance_fee: { enrolled: false },
    },
    payment_info: {
      method: 'credit_card',
      card_number: '**** **** **** 1234',
      cardholder_name: 'TARO YAMADA',
      expiry_date: '12/28',
      billing_day: 27,
      last_payment_date: undefined,
      last_payment_amount: undefined,
      status: 'normal',
      payment_history: buildPaymentHistory(input.start_date, input.monthly_fee),
    },
    unpaid_info: null,
    campaigns: {
      active: [
        {
          campaign_name: '春の入会キャンペーン',
          period_start: campaignStart,
          period_end: campaignEnd,
          discount_content: '入会金無料',
          remaining_days: remainingDays,
          applied_at: input.start_date,
          status: 'active' as const,
        },
      ],
      history: [
        {
          campaign_name: '年末特別キャンペーン',
          period_start: historyStart,
          period_end: historyEnd,
          discount_content: '月会費1ヶ月無料',
          applied_at: historyStart,
          status: 'expired' as const,
        },
      ],
    },
  };
}

type DbType = {
  members: {
    _members: MemberRow[];
    _seeded: boolean;
    _seed(): void;
    get(id: string): Member | undefined;
    getList(): GetMembersResponseMember[];
    getSummary(): {
      active_count: number;
      active_change_percent: number;
      suspended_count: number;
      suspended_percent: number;
      unpaid_count: number;
      unpaid_total_yen: number;
      scheduled_withdrawal_count: number;
      withdrawal_rate_percent: number;
    };
    createFromApplication(application: MembershipApplicationDetails): Member;
    createFromFamilyRegistration(registration: {
      applicant_name: string;
      relationship: FamilyRelationship;
      applicant?: { birthday?: string; phone?: string; email?: string };
      primary_member_id: string;
    }): MemberRow;
    create(body: CreateMemberRequest): Member;
    update(id: string, body: UpdateMemberRequest): Member | undefined;
    updateBasicInfo(id: string, body: UpdateBasicInfoRequest): Member | undefined;
    updateProfileInfo(
      id: string,
      body: NonNullable<UpdateMemberRequest['profile_info']>,
    ): Member | undefined;
    updateHealthInfo(id: string, body: UpdateHealthInfoRequest): Member | undefined;
    updateMarketingConsent(id: string, body: UpdateMarketingConsentRequest): Member | undefined;
  };
  contracts: {
    _seeded: boolean;
    _seed(): void;
    getById(contractId: string): ContractRow | undefined;
    getByPlanName(planName: string): ContractRow | undefined;
    getByMemberId(memberId: string): GetContractsResponse | undefined;
    getByApplicationId(applicationId: string): ContractRow | undefined;
    create(input: {
      contract_id: string;
      member_id?: string;
      application_id?: string;
      data: GetContractsResponse;
    }): unknown;
    createFromApprovedApplication(input: {
      application: MembershipApplication;
      member_id: string;
    }): { member_id: string; contract_id: string };
  };
  membershipApplications: {
    _seeded: boolean;
    _seed(): void;
    getAll(): MembershipApplication[];
    getById(id: string): MembershipApplication | undefined;
    getDetails(id: string): MembershipApplicationDetails;
    updateDetails(id: string, patch: Record<string, unknown>): unknown;
    updateStatus(
      id: string,
      status: MembershipApplicationStatus,
    ): MembershipApplication | undefined;
  };
  family: {
    _seeded: boolean;
    _seed(): void;
    _brandSettings: Record<
      string,
      { family_member_limit: number; family_member_fee: number; payment_cycle: string }
    >;
    _relationships: Map<
      string,
      Array<{ child_member_id: string; relationship: FamilyRelationship; joined_at: string }>
    >;
    _registrations: Array<{
      id: string;
      created_at: string;
      status: FamilyRegistrationStatus;
      primary_member_id: string;
      applicant_name: string;
      relationship: FamilyRelationship;
      invite_expires_at?: string;
      risk_score?: number;
      risk_reason?: string;
      ekyc?: EkycResult;
      applicant?: { birthday?: string; phone?: string; email?: string };
      rejection_reason?: string;
      staff_id?: string;
      child_member_id?: string;
    }>;
    getBrandSettingsByPrimaryMemberId(primary_member_id: string): {
      brand: string;
      settings: { family_member_limit: number; family_member_fee: number; payment_cycle: string };
    };
    getFamilyMembers(primary_member_id: string): {
      brand: string;
      settings: { family_member_limit: number; family_member_fee: number; payment_cycle: string };
      members: Array<{
        id: string;
        member_number: string;
        name_kanji: string;
        relationship: FamilyRelationship;
        joined_at: string;
        status: string;
        monthly_fee: number;
        store_id: string;
        store_name: string;
      }>;
    };
    getPrimaryMemberIdForChild(child_member_id: string): string | undefined;
    getRelationshipToPrimary(
      child_member_id: string,
      primary_member_id: string,
    ): FamilyRelationship | undefined;
    listChildRelationships(
      primary_member_id: string,
    ): Array<{ child_member_id: string; relationship: FamilyRelationship; joined_at: string }>;
    listRegistrations(): Array<{
      id: string;
      created_at: string;
      status: FamilyRegistrationStatus;
      primary_member_id: string;
      applicant_name: string;
      relationship: FamilyRelationship;
      invite_expires_at?: string;
      risk_score?: number;
      risk_reason?: string;
      ekyc?: EkycResult;
      applicant?: { birthday?: string; phone?: string; email?: string };
      rejection_reason?: string;
      staff_id?: string;
      child_member_id?: string;
    }>;
    getRegistrationById(id: string):
      | {
          id: string;
          created_at: string;
          status: FamilyRegistrationStatus;
          primary_member_id: string;
          applicant_name: string;
          relationship: FamilyRelationship;
          invite_expires_at?: string;
          risk_score?: number;
          risk_reason?: string;
          ekyc?: EkycResult;
          applicant?: { birthday?: string; phone?: string; email?: string };
          rejection_reason?: string;
          staff_id?: string;
          child_member_id?: string;
        }
      | undefined;
    createRegistration(input: {
      primary_member_id: string;
      applicant: {
        name: string;
        birthday: string;
        relationship: FamilyRelationship;
        phone?: string;
        email?: string;
      };
    }): {
      id: string;
      created_at: string;
      status: FamilyRegistrationStatus;
      primary_member_id: string;
      applicant_name: string;
      relationship: FamilyRelationship;
      invite_expires_at?: string;
      risk_score?: number;
      risk_reason?: string;
      ekyc?: EkycResult;
      applicant?: { birthday?: string; phone?: string; email?: string };
      rejection_reason?: string;
      staff_id?: string;
      child_member_id?: string;
    };
    linkChildRelationship(
      primary_member_id: string,
      child_member_id: string,
      relationship: FamilyRelationship,
    ): void;
    updateRegistrationStatus(
      id: string,
      status: FamilyRegistrationStatus,
      patch?: Record<string, unknown>,
    ):
      | {
          id: string;
          created_at: string;
          status: FamilyRegistrationStatus;
          primary_member_id: string;
          applicant_name: string;
          relationship: FamilyRelationship;
          invite_expires_at?: string;
          risk_score?: number;
          risk_reason?: string;
          ekyc?: EkycResult;
          applicant?: { birthday?: string; phone?: string; email?: string };
          rejection_reason?: string;
          staff_id?: string;
          child_member_id?: string;
        }
      | undefined;
  };
  referrals: {
    _seeded: boolean;
    _seed(): void;
    getForMember(memberId: string): unknown;
  };
  getMemberRelationships(memberId: string): unknown;
  mainContracts: {
    _rows: MainContractListItem[];
    _seeded: boolean;
    _seed(): void;
    getList(): MainContractListItem[];
  };
  optionMasters: {
    _rows: OptionMasterListItem[];
    _seeded: boolean;
    _seed(): void;
    getList(): OptionMasterListItem[];
  };
  storeMainContracts: {
    _rows: Array<{ store_id: string; main_contract_id: string; linked_at: string }>;
    _seeded: boolean;
    _seed(): void;
    listByStoreId(storeId: string): StoreLinkedMainContract[];
    addByStoreId(storeId: string, mainContractIds: string[]): StoreLinkedMainContract[];
    removeByStoreId(storeId: string, mainContractId: string): boolean;
  };
  storeOptions: {
    _rows: Array<{ store_id: string; option_id: string; linked_at: string }>;
    _seeded: boolean;
    _seed(): void;
    listByStoreId(storeId: string): StoreLinkedOption[];
    addByStoreId(storeId: string, optionIds: string[]): StoreLinkedOption[];
    removeByStoreId(storeId: string, optionId: string): boolean;
  };
  positions: {
    _rows: Position[];
    _seeded: boolean;
    _seed(): void;
    getList(): Position[];
    getById(id: number): Position | undefined;
  };
  stores: {
    _rows: Store[];
    _seeded: boolean;
    _seed(): void;
    getList(): Store[];
    getById(id: string): Store | undefined;
    create(input: Omit<Store, 'id' | 'store_id' | 'created_at' | 'updated_at'>): Store;
    updateById(id: string, patch: Partial<Store>): Store | undefined;
    setManagerStaff(storeId: string, manager_staff_id: string | null): void;
  };
  businessHours: {
    _rows: StoreBusinessHours[];
    _seeded: boolean;
    _seed(): void;
    getByStoreId(storeId: string): StoreBusinessHours | undefined;
    upsert(
      storeId: string,
      patch: Partial<Omit<StoreBusinessHours, 'store_id'>>,
    ): StoreBusinessHours;
  };
  store_access_settings: {
    _byStoreId: Record<string, StoreAccessSettings>;
    _seeded: boolean;
    _seed(): void;
    getByStoreId(storeId: string): StoreAccessSettings | undefined;
    replaceForStore(storeId: string, data: StoreAccessSettings): StoreAccessSettings | undefined;
  };
  staff_permissions: {
    getByStaffId(staff_id: string): StaffPermissionRecord[];
    removeForStaff(staff_id: string): void;
    replaceForStaff(staff_id: string, rows: Array<{ permission_code: string }>): void;
  };
  brands: {
    _rows: BrandItem[];
    _seeded: boolean;
    _seed(): void;
    getList(): BrandItem[];
    getByCode(code: string): BrandItem | undefined;
    update(
      code: string,
      patch: Partial<Pick<BrandItem, 'enrollment_fee_yen' | 'handling_fee_yen' | 'updated_by'>>,
    ): BrandItem | undefined;
  };
  staffs: {
    _staffs: StaffListItem[];
    _details: Record<string, StaffDetail>;
    _seeded: boolean;
    _seed(): void;
    getList(): StaffListItem[];
    getById(id: string): StaffListItem | undefined;
    getDetailById(id: string): StaffDetail | undefined;
    updateDetail(id: string, patch: Partial<StaffDetail>): StaffDetail | undefined;
    create(input: { email: string; role: StaffListItem['role']; brand?: string }): StaffListItem;
    delete(id: string): boolean;
  };
  transfers: {
    _rows: TransferRow[];
    getAll(): TransferRow[];
    getById(id: string): TransferRow | undefined;
    approve(id: string, comment?: string): TransferRow | undefined;
    reject(id: string, comment?: string): TransferRow | undefined;
  };
};

declare global {
  var __fitnessDb_v9: DbType | undefined;
}

// ─── Mock Payment History Data (A-01 FR-009-a) ──────────────────────────────

export const MOCK_PAYMENT_HISTORY: Array<{
  date: string;
  type: 'sale' | 'refund';
  content: string;
  amount: number;
  method: string;
}> = [
  {
    date: '2026/04/01',
    type: 'sale',
    content: '月会費（4月分）',
    amount: 9900,
    method: 'SBPS',
  },
  {
    date: '2026/03/28',
    type: 'refund',
    content: '返金処理',
    amount: -2200,
    method: 'SBPS',
  },
  {
    date: '2026/03/15',
    type: 'sale',
    content: '月会費（3月分）',
    amount: 9900,
    method: 'SBPS',
  },
  {
    date: '2026/03/10',
    type: 'sale',
    content: 'オプション追加（パーソナルトレーニング）',
    amount: 5500,
    method: 'JACCS',
  },
  {
    date: '2026/02/28',
    type: 'refund',
    content: 'オプション解約返金',
    amount: -1100,
    method: 'SBPS',
  },
  {
    date: '2026/02/15',
    type: 'sale',
    content: '月会費（2月分）',
    amount: 9900,
    method: 'SBPS',
  },
  {
    date: '2026/02/01',
    type: 'sale',
    content: 'ロッカー利用料',
    amount: 550,
    method: '現金',
  },
  {
    date: '2026/01/20',
    type: 'refund',
    content: 'オプション返金',
    amount: -3300,
    method: 'SBPS',
  },
  {
    date: '2026/01/15',
    type: 'sale',
    content: '月会費（1月分）',
    amount: 9900,
    method: 'SBPS',
  },
  {
    date: '2025/12/28',
    type: 'sale',
    content: 'プロテイン販売',
    amount: 2500,
    method: '現金',
  },
];

// ─── Mock Billing List Data (A-01 FR-009-b) ──────────────────────────────

export const MOCK_BILLING_LIST: Array<{
  month: string;
  type: 'monthly' | 'oneTime';
  amount: number;
  status: 'pending' | 'paid' | 'uncollected' | 'written-off';
  billingDate: string;
}> = [
  {
    month: '2026年4月',
    type: 'monthly',
    amount: 9900,
    status: 'paid',
    billingDate: '2026/04/01',
  },
  {
    month: '2026年3月',
    type: 'monthly',
    amount: 9900,
    status: 'paid',
    billingDate: '2026/03/01',
  },
  {
    month: '2026年3月',
    type: 'oneTime',
    amount: 5500,
    status: 'pending',
    billingDate: '2026/03/10',
  },
  {
    month: '2026年2月',
    type: 'monthly',
    amount: 9900,
    status: 'paid',
    billingDate: '2026/02/01',
  },
  {
    month: '2026年1月',
    type: 'monthly',
    amount: 9900,
    status: 'uncollected',
    billingDate: '2026/01/01',
  },
  {
    month: '2025年12月',
    type: 'monthly',
    amount: 9900,
    status: 'paid',
    billingDate: '2025/12/01',
  },
  {
    month: '2025年11月',
    type: 'monthly',
    amount: 9900,
    status: 'written-off',
    billingDate: '2025/11/01',
  },
  {
    month: '2025年10月',
    type: 'monthly',
    amount: 9900,
    status: 'paid',
    billingDate: '2025/10/01',
  },
];

// ─── Mock Payment Summary Helper ──────────────────────────────

export function getPaymentSummary(): PaymentSummary {
  // Current month is 2026年4月
  const currentMonthAmount = MOCK_BILLING_LIST.filter((item) => item.month === '2026年4月').reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  // Unpaid total: uncollected + written-off
  const unpaidTotal = MOCK_BILLING_LIST.filter((item) =>
    ['uncollected', 'written-off'].includes(item.status),
  ).reduce((sum, item) => sum + item.amount, 0);

  // Last payment date: most recent date with status 'paid'
  const paidRecords = MOCK_BILLING_LIST.filter((item) => item.status === 'paid');
  const lastPaymentDate = paidRecords.length > 0 ? paidRecords[0]!.billingDate : null;

  return {
    currentMonthAmount,
    unpaidTotal,
    lastPaymentDate,
    paymentMethod: 'SBPS',
  };
}

// ─── Usage History Mock Data ────────────────────────────────────────────────────

export const MOCK_VISIT_RECORDS = [
  {
    id: 'vr-001',
    entry_time: '2026-04-23T18:00:00Z',
    exit_time: '2026-04-23T19:30:00Z',
    stay_time: 90,
    store_id: 'store-001',
    store_name: 'JOYFIT渋谷店',
    entry_method: 'qr_code',
  },
  {
    id: 'vr-002',
    entry_time: '2026-04-22T06:00:00Z',
    exit_time: '2026-04-22T07:15:00Z',
    stay_time: 75,
    store_id: 'store-002',
    store_name: 'JOYFIT新宿店',
    entry_method: 'ic_card',
  },
  {
    id: 'vr-003',
    entry_time: '2026-04-21T19:30:00Z',
    exit_time: null,
    stay_time: undefined,
    store_id: 'store-001',
    store_name: 'JOYFIT渋谷店',
    entry_method: 'qr_code',
  },
  {
    id: 'vr-004',
    entry_time: '2026-04-20T18:00:00Z',
    exit_time: '2026-04-20T20:00:00Z',
    stay_time: 120,
    store_id: 'store-001',
    store_name: 'JOYFIT渋谷店',
    entry_method: 'face_recognition',
  },
  {
    id: 'vr-005',
    entry_time: '2026-04-19T06:30:00Z',
    exit_time: '2026-04-19T08:00:00Z',
    stay_time: 90,
    store_id: 'store-003',
    store_name: 'FIT365六本木',
    entry_method: 'member_card',
  },
  {
    id: 'vr-006',
    entry_time: '2026-04-18T18:45:00Z',
    exit_time: '2026-04-18T19:45:00Z',
    stay_time: 60,
    store_id: 'store-002',
    store_name: 'JOYFIT新宿店',
    entry_method: 'qr_code',
  },
  {
    id: 'vr-007',
    entry_time: '2026-04-17T19:00:00Z',
    exit_time: null,
    stay_time: undefined,
    store_id: 'store-002',
    store_name: 'JOYFIT新宿店',
    entry_method: 'ic_card',
  },
  {
    id: 'vr-008',
    entry_time: '2026-04-16T07:00:00Z',
    exit_time: '2026-04-16T08:30:00Z',
    stay_time: 90,
    store_id: 'store-001',
    store_name: 'JOYFIT渋谷店',
    entry_method: 'face_recognition',
  },
] as const;

export const MOCK_LESSON_RESERVATIONS = [
  {
    id: 'lr-001',
    lesson_date: '2026-04-23',
    lesson_name: 'ボクシング基礎',
    instructor_name: '田中太郎',
    status: 'attended' as const,
  },
  {
    id: 'lr-002',
    lesson_date: '2026-04-22',
    lesson_name: 'ヨガ基礎',
    instructor_name: '鈴木花子',
    status: 'attended' as const,
  },
  {
    id: 'lr-003',
    lesson_date: '2026-04-21',
    lesson_name: 'パーソナルトレーニング',
    instructor_name: '佐藤次郎',
    status: 'absent' as const,
  },
  {
    id: 'lr-004',
    lesson_date: '2026-04-20',
    lesson_name: 'グループレッスン',
    instructor_name: '山田美咲',
    status: 'attended' as const,
  },
  {
    id: 'lr-005',
    lesson_date: '2026-04-19',
    lesson_name: 'ボクシング基礎',
    instructor_name: '田中太郎',
    status: 'cancelled' as const,
  },
  {
    id: 'lr-006',
    lesson_date: '2026-04-25',
    lesson_name: 'ピラティス',
    instructor_name: '中村優子',
    status: 'reserved' as const,
  },
  {
    id: 'lr-007',
    lesson_date: '2026-05-01',
    lesson_name: 'ダンスエクササイズ',
    instructor_name: '高橋健太',
    status: 'reserved' as const,
  },
  {
    id: 'lr-008',
    lesson_date: '2026-05-05',
    lesson_name: 'スイミング',
    instructor_name: '伊藤由美',
    status: 'reserved' as const,
  },
  {
    id: 'lr-009',
    lesson_date: '2026-04-18',
    lesson_name: 'ヨガ基礎',
    instructor_name: '鈴木花子',
    status: 'attended' as const,
  },
  {
    id: 'lr-010',
    lesson_date: '2026-04-17',
    lesson_name: 'パーソナルトレーニング',
    instructor_name: '佐藤次郎',
    status: 'cancelled' as const,
  },
] as const;

export const MOCK_MEMBER_ACCESS_SETTINGS: Record<
  string,
  { auth_method: string; ic_card_number: string | null; qr_code: string | null; gate_stop: boolean }
> = {
  'member-001': {
    auth_method: 'QRコード',
    ic_card_number: null,
    qr_code: 'QR123456789',
    gate_stop: false,
  },
  'member-002': {
    auth_method: 'ICカード',
    ic_card_number: 'IC-0002',
    qr_code: null,
    gate_stop: true,
  },
  'member-003': {
    auth_method: 'QRコード',
    ic_card_number: null,
    qr_code: 'QR987654321',
    gate_stop: false,
  },
  'member-004': {
    auth_method: '顔認証',
    ic_card_number: 'IC-0004',
    qr_code: 'QR111222333',
    gate_stop: false,
  },
};

// ─── Transfer Seed Data (A-02 FR-001) ────────────────────────────────────────

const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = now.getMonth(); // 0-indexed

function isoDate(year: number, month: number, day: number): string {
  return new Date(year, month, day).toISOString();
}

// this_month: 4 rows; last_month: 2 rows; this_year (not this month): 2 rows; prior year: 2 rows
const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
const prevYearMonth = thisMonth === 0 ? 11 : thisMonth;
const prevYear = thisYear - 1;

// ─── Transfer approval history builder ──────────────────────────────────────

function buildApprovalHistory(
  brand: 'joyfit' | 'fit365',
  status: TransferStatus,
  appliedAt: string,
): ApprovalHistoryItem[] {
  const stepOneCompleted = true; // 申請ステップは常に完了
  const fromApproved =
    status === TransferStatus.FromStoreApproved ||
    status === TransferStatus.Approved ||
    status === TransferStatus.Completed;
  const toApproved = status === TransferStatus.Approved || status === TransferStatus.Completed;
  const completed = status === TransferStatus.Completed;

  const appliedDate = new Date(appliedAt);
  const fromApprovedAt = fromApproved
    ? new Date(appliedDate.getTime() + 2 * 24 * 3600 * 1000).toISOString()
    : null;
  const toApprovedAt =
    toApproved && fromApprovedAt
      ? new Date(new Date(fromApprovedAt).getTime() + 1 * 24 * 3600 * 1000).toISOString()
      : null;
  const completedAt =
    completed && toApprovedAt
      ? new Date(new Date(toApprovedAt).getTime() + 1 * 24 * 3600 * 1000).toISOString()
      : completed && fromApprovedAt
        ? new Date(new Date(fromApprovedAt).getTime() + 1 * 24 * 3600 * 1000).toISOString()
        : null;

  if (brand === 'joyfit') {
    return [
      {
        step: 1,
        label: '申請',
        store_type: null,
        completed: stepOneCompleted,
        completed_at: appliedAt,
        completed_by: null,
        is_automatic: false,
      },
      {
        step: 2,
        label: '移籍元承認',
        store_type: 'from',
        completed: fromApproved,
        completed_at: fromApprovedAt,
        completed_by: fromApproved ? '移籍元スタッフ' : null,
        is_automatic: false,
      },
      {
        step: 3,
        label: 'システム自動移籍実行',
        store_type: null,
        completed: completed,
        completed_at: completedAt,
        completed_by: null,
        is_automatic: true,
      },
    ];
  }

  // FIT365: 4ステップ
  return [
    {
      step: 1,
      label: '申請',
      store_type: null,
      completed: stepOneCompleted,
      completed_at: appliedAt,
      completed_by: null,
      is_automatic: false,
    },
    {
      step: 2,
      label: '移籍元承認',
      store_type: 'from',
      completed: fromApproved,
      completed_at: fromApprovedAt,
      completed_by: fromApproved ? '移籍元スタッフ' : null,
      is_automatic: false,
    },
    {
      step: 3,
      label: '移籍先承認',
      store_type: 'to',
      completed: toApproved,
      completed_at: toApprovedAt,
      completed_by: toApproved ? '移籍先スタッフ' : null,
      is_automatic: false,
    },
    {
      step: 4,
      label: '移籍実行',
      store_type: null,
      completed: completed,
      completed_at: completedAt,
      completed_by: null,
      is_automatic: false,
    },
  ];
}

const TRANSFER_REASONS = [
  '転居のため',
  '通勤経路が変わったため',
  '職場の近くに利用したいため',
  '自宅の近くに引っ越したため',
  '家族と一緒に通いたいため',
  '営業時間の都合のため',
  '設備が充実している店舗に移りたいため',
];

const TRANSFER_APPLICANT_NAMES = [
  '田中 一郎',
  '鈴木 次郎',
  '佐藤 三郎',
  '山田 四郎',
  '中村 五郎',
  '小林 六郎',
  '伊藤 七郎',
];

export const TRANSFER_SEED_DATA: TransferRow[] = [
  // pending ×2 (this_month)
  {
    id: 'TR-001',
    member_id: 'M-10001',
    member_name: '山田 太郎',
    from_store_id: 'store-joyfit-001',
    from_store_name: 'JOYFIT池袋店',
    to_store_id: 'store-joyfit-002',
    to_store_name: 'JOYFIT新宿店',
    brand: 'joyfit',
    applied_at: isoDate(thisYear, thisMonth, 5),
    scheduled_date: isoDate(thisYear, thisMonth + 1, 1),
    status: TransferStatus.Pending,
    reason: TRANSFER_REASONS[0]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[0]!,
    applicant_role: 'staff',
    updated_at: isoDate(thisYear, thisMonth, 5),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.Pending,
      isoDate(thisYear, thisMonth, 5),
    ),
  },
  {
    id: 'TR-002',
    member_id: 'M-10002',
    member_name: '鈴木 花子',
    from_store_id: 'store-fit365-001',
    from_store_name: 'FIT365八潮店',
    to_store_id: 'store-fit365-002',
    to_store_name: 'FIT365川口店',
    brand: 'fit365',
    applied_at: isoDate(thisYear, thisMonth, 10),
    scheduled_date: isoDate(thisYear, thisMonth + 1, 1),
    status: TransferStatus.Pending,
    reason: TRANSFER_REASONS[1]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[1]!,
    applicant_role: 'manager',
    updated_at: isoDate(thisYear, thisMonth, 10),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.Pending,
      isoDate(thisYear, thisMonth, 10),
    ),
  },
  // from_store_approved ×2 (this_month)
  {
    id: 'TR-003',
    member_id: 'M-10003',
    member_name: '佐藤 一郎',
    from_store_id: 'store-joyfit-003',
    from_store_name: 'JOYFIT渋谷店',
    to_store_id: 'store-joyfit-001',
    to_store_name: 'JOYFIT池袋店',
    brand: 'joyfit',
    applied_at: isoDate(thisYear, thisMonth, 8),
    scheduled_date: isoDate(thisYear, thisMonth + 1, 1),
    status: TransferStatus.FromStoreApproved,
    reason: TRANSFER_REASONS[2]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[2]!,
    applicant_role: 'staff',
    updated_at: isoDate(thisYear, thisMonth, 10),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.FromStoreApproved,
      isoDate(thisYear, thisMonth, 8),
    ),
  },
  {
    id: 'TR-004',
    member_id: 'M-10004',
    member_name: '田中 美咲',
    from_store_id: 'store-fit365-002',
    from_store_name: 'FIT365川口店',
    to_store_id: 'store-fit365-003',
    to_store_name: 'FIT365大宮店',
    brand: 'fit365',
    applied_at: isoDate(thisYear, thisMonth, 12),
    scheduled_date: isoDate(thisYear, thisMonth + 1, 15),
    status: TransferStatus.FromStoreApproved,
    reason: TRANSFER_REASONS[3]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[3]!,
    applicant_role: 'manager',
    updated_at: isoDate(thisYear, thisMonth, 14),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.FromStoreApproved,
      isoDate(thisYear, thisMonth, 12),
    ),
  },
  // approved ×2 (last_month)
  {
    id: 'TR-005',
    member_id: 'M-10005',
    member_name: '高橋 健司',
    from_store_id: 'store-joyfit-002',
    from_store_name: 'JOYFIT新宿店',
    to_store_id: 'store-joyfit-004',
    to_store_name: 'JOYFIT横浜店',
    brand: 'joyfit',
    applied_at: isoDate(lastMonthYear, lastMonth, 15),
    scheduled_date: isoDate(thisYear, thisMonth, 1),
    status: TransferStatus.Approved,
    reason: TRANSFER_REASONS[4]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[4]!,
    applicant_role: 'staff',
    updated_at: isoDate(lastMonthYear, lastMonth, 17),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.Approved,
      isoDate(lastMonthYear, lastMonth, 15),
    ),
  },
  {
    id: 'TR-006',
    member_id: 'M-10006',
    member_name: '伊藤 恵子',
    from_store_id: 'store-fit365-003',
    from_store_name: 'FIT365大宮店',
    to_store_id: 'store-fit365-001',
    to_store_name: 'FIT365八潮店',
    brand: 'fit365',
    applied_at: isoDate(lastMonthYear, lastMonth, 20),
    scheduled_date: isoDate(thisYear, thisMonth, 1),
    status: TransferStatus.Approved,
    reason: TRANSFER_REASONS[5]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[5]!,
    applicant_role: 'manager',
    updated_at: isoDate(lastMonthYear, lastMonth, 23),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.Approved,
      isoDate(lastMonthYear, lastMonth, 20),
    ),
  },
  // rejected ×2 (this_year, not this month)
  {
    id: 'TR-007',
    member_id: 'M-10007',
    member_name: '渡辺 直樹',
    from_store_id: 'store-joyfit-004',
    from_store_name: 'JOYFIT横浜店',
    to_store_id: 'store-joyfit-003',
    to_store_name: 'JOYFIT渋谷店',
    brand: 'joyfit',
    applied_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 10),
    scheduled_date: isoDate(thisYear, Math.max(thisMonth - 1, 0), 1),
    status: TransferStatus.Rejected,
    reason: TRANSFER_REASONS[6]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[6]!,
    applicant_role: 'staff',
    updated_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 12),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.Rejected,
      isoDate(thisYear, Math.max(thisMonth - 2, 0), 10),
    ),
  },
  {
    id: 'TR-008',
    member_id: 'M-10008',
    member_name: '中村 さくら',
    from_store_id: 'store-fit365-001',
    from_store_name: 'FIT365八潮店',
    to_store_id: 'store-fit365-004',
    to_store_name: 'FIT365越谷店',
    brand: 'fit365',
    applied_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 18),
    scheduled_date: isoDate(thisYear, Math.max(thisMonth - 1, 0), 1),
    status: TransferStatus.Rejected,
    reason: TRANSFER_REASONS[0]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[0]!,
    applicant_role: 'manager',
    updated_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 20),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.Rejected,
      isoDate(thisYear, Math.max(thisMonth - 2, 0), 18),
    ),
  },
  // completed ×2 (prior year)
  {
    id: 'TR-009',
    member_id: 'M-10009',
    member_name: '小林 隆',
    from_store_id: 'store-joyfit-001',
    from_store_name: 'JOYFIT池袋店',
    to_store_id: 'store-joyfit-002',
    to_store_name: 'JOYFIT新宿店',
    brand: 'joyfit',
    applied_at: isoDate(prevYear, prevYearMonth, 5),
    scheduled_date: isoDate(prevYear, prevYearMonth + 1, 1),
    status: TransferStatus.Completed,
    reason: TRANSFER_REASONS[1]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[1]!,
    applicant_role: 'staff',
    updated_at: isoDate(prevYear, prevYearMonth, 10),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.Completed,
      isoDate(prevYear, prevYearMonth, 5),
    ),
  },
  {
    id: 'TR-010',
    member_id: 'M-10010',
    member_name: '加藤 幸子',
    from_store_id: 'store-fit365-004',
    from_store_name: 'FIT365越谷店',
    to_store_id: 'store-fit365-002',
    to_store_name: 'FIT365川口店',
    brand: 'fit365',
    applied_at: isoDate(prevYear, prevYearMonth, 12),
    scheduled_date: isoDate(prevYear, prevYearMonth + 1, 1),
    status: TransferStatus.Completed,
    reason: TRANSFER_REASONS[2]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[2]!,
    applicant_role: 'manager',
    updated_at: isoDate(prevYear, prevYearMonth, 17),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.Completed,
      isoDate(prevYear, prevYearMonth, 12),
    ),
  },
  // rejected ×2 (this_year, not this month)
  {
    id: 'TR-011',
    member_id: 'M-10011',
    member_name: '小林 隆',
    from_store_id: 'store-joyfit-001',
    from_store_name: 'JOYFIT池袋店',
    to_store_id: 'store-joyfit-002',
    to_store_name: 'JOYFIT新宿店',
    brand: 'joyfit',
    applied_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 10),
    scheduled_date: isoDate(thisYear, Math.max(thisMonth - 1, 0), 1),
    status: TransferStatus.Rejected,
    reason: TRANSFER_REASONS[3]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[3]!,
    applicant_role: 'staff',
    updated_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 12),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.Rejected,
      isoDate(thisYear, Math.max(thisMonth - 2, 0), 10),
    ),
  },
  {
    id: 'TR-012',
    member_id: 'M-10012',
    member_name: '中村 さくら',
    from_store_id: 'store-fit365-001',
    from_store_name: 'FIT365八潮店',
    to_store_id: 'store-fit365-004',
    to_store_name: 'FIT365越谷店',
    brand: 'fit365',
    applied_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 18),
    scheduled_date: isoDate(thisYear, Math.max(thisMonth - 1, 0), 1),
    status: TransferStatus.Rejected,
    reason: TRANSFER_REASONS[4]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[4]!,
    applicant_role: 'manager',
    updated_at: isoDate(thisYear, Math.max(thisMonth - 2, 0), 20),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.Rejected,
      isoDate(thisYear, Math.max(thisMonth - 2, 0), 18),
    ),
  },
  // completed ×2 (prior year)
  {
    id: 'TR-013',
    member_id: 'M-10013',
    member_name: '小林 隆',
    from_store_id: 'store-joyfit-001',
    from_store_name: 'JOYFIT池袋店',
    to_store_id: 'store-joyfit-002',
    to_store_name: 'JOYFIT新宿店',
    brand: 'joyfit',
    applied_at: isoDate(prevYear, prevYearMonth, 5),
    scheduled_date: isoDate(prevYear, prevYearMonth + 1, 1),
    status: TransferStatus.Completed,
    reason: TRANSFER_REASONS[5]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[5]!,
    applicant_role: 'staff',
    updated_at: isoDate(prevYear, prevYearMonth, 8),
    approval_history: buildApprovalHistory(
      'joyfit',
      TransferStatus.Completed,
      isoDate(prevYear, prevYearMonth, 5),
    ),
  },
  {
    id: 'TR-014',
    member_id: 'M-10014',
    member_name: '加藤 幸子',
    from_store_id: 'store-fit365-004',
    from_store_name: 'FIT365越谷店',
    to_store_id: 'store-fit365-002',
    to_store_name: 'FIT365川口店',
    brand: 'fit365',
    applied_at: isoDate(prevYear, prevYearMonth, 12),
    scheduled_date: isoDate(prevYear, prevYearMonth + 1, 1),
    status: TransferStatus.Completed,
    reason: TRANSFER_REASONS[6]!,
    applicant_name: TRANSFER_APPLICANT_NAMES[6]!,
    applicant_role: 'manager',
    updated_at: isoDate(prevYear, prevYearMonth, 15),
    approval_history: buildApprovalHistory(
      'fit365',
      TransferStatus.Completed,
      isoDate(prevYear, prevYearMonth, 12),
    ),
  },
];

function createDb() {
  const permissionRows: StaffPermissionRecord[] = [];
  let nextStaffPermissionId = 1;

  function pushStaffPermissions(staffId: string, codes: string[]): void {
    for (const permission_code of codes) {
      permissionRows.push({
        id: nextStaffPermissionId++,
        staff_id: staffId,
        permission_code,
      });
    }
  }

  const db = {
    members: {
      _members: [] as MemberRow[],
      _seeded: false,

      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.stores._seed();
        const storeRows = db.stores._rows;
        const names = [
          { kanji: '佐藤 花子', kana: 'サトウ ハナコ' },
          { kanji: '鈴木 太郎', kana: 'スズキ タロウ' },
          { kanji: '田中 美咲', kana: 'タナカ ミサキ' },
          { kanji: '山田 健太', kana: 'ヤマダ ケンタ' },
          { kanji: '中村 由美', kana: 'ナカムラ ユミ' },
        ];
        const now = new Date();
        const dayMs = 24 * 60 * 60 * 1000;
        db.mainContracts._seed();
        const mainContracts = db.mainContracts.getList();
        const defaultContract =
          mainContracts.find((contract) => contract.id === DEFAULT_MEMBER_MAIN_CONTRACT_ID) ??
          mainContracts[0];
        const byId = new Map(mainContracts.map((contract) => [contract.id, contract]));
        for (let i = 1; i <= 200; i++) {
          const id = `M-${String(i).padStart(5, '0')}`;
          const name = names[i % names.length];
          const store = storeRows[i % storeRows.length]!;
          const memberType = (
            ['regular', 'family', 'corporate', 'one_day_member'] as MemberProfile['member_type'][]
          )[i % 4]!;
          const preferredContractId =
            memberType === 'one_day_member'
              ? 'MC007'
              : memberType === 'family'
                ? 'MC011'
                : memberType === 'corporate'
                  ? 'MC003'
                  : DEFAULT_MEMBER_MAIN_CONTRACT_ID;
          const mainContract = byId.get(preferredContractId) ?? defaultContract;
          const displayName = mainContract?.name ?? DEFAULT_MEMBER_MAIN_CONTRACT;
          const mainContractId = mainContract?.id ?? DEFAULT_MEMBER_MAIN_CONTRACT_ID;
          const phone = `090${String(1000 + (i % 9000)).slice(-4)}${String(1000 + (i % 9000)).slice(-4)}`;
          const email = `member${String(i).padStart(5, '0')}@example.jp`;
          this._members.push(
            createMember(id, {
              name_kanji: name.kanji,
              name_kana: name.kana,
              phone,
              email,
              birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
              gender: i % 2 === 0 ? 'male' : 'female',
              member_type: memberType,
              status: (
                [
                  'active',
                  'suspended',
                  'withdrawn',
                  'gate_stop',
                  'pending_withdrawal',
                  'active',
                ] as MemberProfile['status'][]
              )[i % 6],
              contract_type: resolveContractTypeFromMemberType(memberType),
              store_name: store.name,
              store_id: store.id,
              brand: store.brand as Brand,
              contract_name: displayName,
              contract_id: mainContractId,
              joined_at: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
              last_visit_date:
                i % 5 === 0
                  ? undefined
                  : toIsoDate(new Date(now.getTime() - ((i * 3) % 420) * dayMs)),
              has_unpaid: i % 7 === 0,
              in_cancellation_period: i % 6 === 4,
              is_option_restricted: i % 7 === 0,
              emergency_contact_name: name.kanji,
              emergency_contact_relationship: '配偶者',
              emergency_contact_phone: '09087654321',
            }),
          );
        }
      },

      get(id: string): Member | undefined {
        this._seed();
        return this._members.find((m) => m.basic_info.id === id);
      },

      getList(): GetMembersResponseMember[] {
        this._seed();
        return this._members.map(memberToListItem);
      },

      getSummary(): {
        active_count: number;
        active_change_percent: number;
        suspended_count: number;
        suspended_percent: number;
        unpaid_count: number;
        unpaid_total_yen: number;
        scheduled_withdrawal_count: number;
        withdrawal_rate_percent: number;
      } {
        this._seed();
        const all = this._members;
        const total = all.length;
        const active = all.filter((m) => m.profile.status === 'active').length;
        const suspended = all.filter((m) => m.profile.status === 'suspended').length;
        const unpaidMembers = all.filter((m) => m._listMeta?.has_unpaid === true);
        const pending_withdrawal = all.filter(
          (m) => m.profile.status === 'pending_withdrawal',
        ).length;
        return {
          active_count: active,
          active_change_percent: 5.8,
          suspended_count: suspended,
          suspended_percent: total > 0 ? Math.round((suspended / total) * 1000) / 10 : 0,
          unpaid_count: unpaidMembers.length,
          unpaid_total_yen: unpaidMembers.length * 15700,
          scheduled_withdrawal_count: pending_withdrawal,
          withdrawal_rate_percent:
            total > 0 ? Math.round((pending_withdrawal / total) * 1000) / 10 : 0,
        };
      },

      createFromApplication(application: MembershipApplicationDetails): Member {
        this._seed();
        const nextNumber = this._members.length + 1;
        const id = `M-${String(nextNumber).padStart(5, '0')}`;
        db.stores._seed();
        const storeRows = db.stores._rows;
        const store = storeRows[nextNumber % storeRows.length]!;
        const now = new Date();
        const memberType = (['regular', 'family', 'corporate'] as MemberProfile['member_type'][])[
          nextNumber % 3
        ]!;
        const rawPlan =
          application.contract_details?.plan_name || application.contract_details?.plan_id || '';
        db.mainContracts._seed();
        const mainContracts = db.mainContracts.getList();
        const defaultContract =
          mainContracts.find((contract) => contract.id === DEFAULT_MEMBER_MAIN_CONTRACT_ID) ??
          mainContracts[0];
        const selectedContract =
          mainContracts.find((contract) => contract.id === rawPlan) ??
          mainContracts.find((contract) => contract.name === rawPlan) ??
          defaultContract;
        const displayName = selectedContract?.name ?? DEFAULT_MEMBER_MAIN_CONTRACT;
        const mainContractId = selectedContract?.id ?? DEFAULT_MEMBER_MAIN_CONTRACT_ID;
        const row = createMember(id, {
          name_kanji: application.applicant_name || '',
          name_kana: application.applicant_name || '',
          phone: application.applicant_phone || '',
          email: application.applicant_email || '',
          birthday: application.birthday || '',
          gender: application.gender || 'other',
          member_type: memberType,
          status: 'active',
          contract_type: resolveContractTypeFromMemberType(memberType),
          store_name: store.name,
          store_id: store.id,
          brand: nextNumber % 2 === 0 ? 'fit365' : 'joyfit',
          joined_at: toIsoDate(now),
          contract_name: displayName,
          contract_id: mainContractId,
          last_visit_date: toIsoDate(new Date(application.contract_details?.start_date ?? now)),
          has_unpaid: false,
          in_cancellation_period: false,
          is_option_restricted: false,
          emergency_contact_name: application.emergency_contact_name || '',
          emergency_contact_relationship: application.emergency_contact_relationship || '',
          emergency_contact_phone: application.emergency_contact_phone || '',
        });
        this._members.push(row);
        return row;
      },

      createFromFamilyRegistration(registration: {
        applicant_name: string;
        relationship: FamilyRelationship;
        applicant?: { birthday?: string; phone?: string; email?: string };
        primary_member_id: string;
      }): MemberRow {
        this._seed();
        const nextNumber = this._members.length + 1;
        const id = `M-${String(nextNumber).padStart(5, '0')}`;
        const primary = this.get(registration.primary_member_id);
        db.stores._seed();
        const storeRows = db.stores._rows;
        const fallbackStore = storeRows[nextNumber % storeRows.length]!;
        const store = primary?.profile.store_id
          ? { id: primary.profile.store_id, name: primary.profile.store_name }
          : { id: fallbackStore.id, name: fallbackStore.name };
        db.mainContracts._seed();
        const contracts = db.mainContracts.getList();
        const displayName =
          contracts[nextNumber % contracts.length]?.name ?? DEFAULT_MEMBER_MAIN_CONTRACT;
        const mainContractId =
          contracts.find((contract) => contract.name === displayName)?.id ??
          DEFAULT_MEMBER_MAIN_CONTRACT_ID;
        const now = new Date();
        const row = createMember(id, {
          name_kanji: registration.applicant_name,
          name_kana: registration.applicant_name,
          phone:
            registration.applicant?.phone ??
            `090${String(1000 + (nextNumber % 9000)).slice(-4)}${String(2000 + (nextNumber % 8000)).slice(-4)}`,
          email:
            registration.applicant?.email ??
            `family${String(nextNumber).padStart(5, '0')}@example.jp`,
          birthday: registration.applicant?.birthday ?? '',
          gender: 'male',
          member_type: 'family' as MemberProfile['member_type'],
          status: 'active' as MemberProfile['status'],
          contract_type: 'family',
          store_name: store.name,
          store_id: store.id,
          brand: primary?.profile.brand ?? (nextNumber % 2 === 0 ? 'fit365' : 'joyfit'),
          joined_at: toIsoDate(now),
          contract_name: displayName,
          contract_id: mainContractId,
          last_visit_date: undefined,
          has_unpaid: false,
          in_cancellation_period: false,
          is_option_restricted: false,
          emergency_contact_name: registration.applicant_name,
          emergency_contact_relationship: registration.relationship,
          emergency_contact_phone: registration.applicant?.phone ?? '',
        });
        this._members.push(row);
        return row;
      },

      create(body: CreateMemberRequest): Member {
        this._seed();
        db.contracts._seed();
        db.stores._seed();
        db.mainContracts._seed();
        const nextNumber = this._members.length + 1;
        const id = `M-${String(nextNumber).padStart(5, '0')}`;
        const storeRows = db.stores._rows;
        const profileInfo = body.profile_info;
        const joinedAt = profileInfo?.join_date ?? toIsoDate(new Date());
        const memberType: MemberProfile['member_type'] = profileInfo?.member_type ?? 'regular';
        const mainContracts = db.mainContracts.getList();
        const defaultContract =
          mainContracts.find((contract) => contract.id === DEFAULT_MEMBER_MAIN_CONTRACT_ID) ??
          mainContracts[0];
        const selectedContract =
          mainContracts.find((contract) => contract.id === profileInfo?.contract_name) ??
          mainContracts.find((contract) => contract.name === profileInfo?.contract_name) ??
          defaultContract;
        const contractName = selectedContract?.name ?? DEFAULT_MEMBER_MAIN_CONTRACT;
        const existingContract = db.contracts.getByPlanName(contractName);
        const contractId =
          existingContract?.contract_id ?? `contract-member-${String(nextNumber).padStart(5, '0')}`;
        if (!existingContract) {
          db.contracts.create({
            contract_id: contractId,
            data: buildMemberContractData({
              plan_name: contractName,
              start_date: joinedAt,
              monthly_fee: selectedContract?.price_including_tax ?? 0,
              created_at: new Date().toISOString(),
            }),
          });
        }
        const joinStoreId = profileInfo?.join_store?.trim();
        const selectedStore =
          joinStoreId != null && joinStoreId !== ''
            ? storeRows.find((row) => row.id === joinStoreId || row.store_id === joinStoreId)
            : undefined;
        const resolvedStore = selectedStore;
        const normalizedBrand = profileInfo?.brand?.trim();
        const brand =
          normalizedBrand && resolvedStore
            ? resolveBrand(normalizedBrand, resolvedStore.brand as Brand)
            : ('' as MemberProfile['brand']);
        const row = createMember(id, {
          name_kanji: body.name_kanji,
          name_kana: body.name_kana,
          phone: body.phone,
          email: body.email,
          birthday: body.birthday ?? '1990-01-01',
          gender: body.gender ?? 'other',
          member_type: memberType,
          status: 'active',
          contract_type: resolveContractTypeFromMemberType(memberType),
          store_name: resolvedStore?.name ?? '',
          store_id: resolvedStore?.id ?? '',
          brand,
          joined_at: joinedAt,
          contract_name: contractName,
          contract_id: contractId,
          last_visit_date: undefined,
          has_unpaid: false,
          in_cancellation_period: false,
          is_option_restricted: false,
          emergency_contact_name: body.emergency_contact?.name ?? '',
          emergency_contact_relationship: body.emergency_contact?.relationship ?? '',
          emergency_contact_phone: body.emergency_contact?.phone ?? '',
        });

        row.basic_info.birthday = body.birthday ?? row.basic_info.birthday;
        row.basic_info.postal_code = body.postal_code ?? row.basic_info.postal_code;
        row.basic_info.prefecture = body.prefecture ?? row.basic_info.prefecture;
        row.basic_info.city = body.city ?? row.basic_info.city;
        row.basic_info.address = body.address ?? row.basic_info.address;
        row.basic_info.building = body.building ?? row.basic_info.building;
        row.basic_info.notes = body.notes ?? row.basic_info.notes;
        row.profile.contract_id = contractId;
        row.profile.contract_name = profileInfo?.contract_name ?? row.profile.contract_name;
        row.profile.join_route = profileInfo?.join_route ?? row.profile.join_route;
        row.profile.referrer_member_id =
          profileInfo?.referrer_member_id ?? row.profile.referrer_member_id;
        row.ekyc = {
          ...(row.ekyc ?? { verified: false }),
          photoUrl: profileInfo?.photo_url ?? row.ekyc?.photoUrl,
        };
        this._members.push(row);
        return row;
      },

      update(id: string, body: UpdateMemberRequest): Member | undefined {
        this._seed();
        if (body.basic_info) {
          this.updateBasicInfo(id, body.basic_info);
        }
        if (body.profile_info) {
          this.updateProfileInfo(id, body.profile_info);
        }
        return this.get(id);
      },

      updateBasicInfo(id: string, body: UpdateBasicInfoRequest): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === id);
        if (idx === -1) return undefined;
        const current = this._members[idx];
        const updated: MemberRow = {
          ...current,
          basic_info: {
            ...current.basic_info,
            ...body,
            emergency_contact: body.emergency_contact ?? current.basic_info.emergency_contact,
          },
        };
        this._members[idx] = updated;
        return updated;
      },

      updateProfileInfo(
        id: string,
        body: NonNullable<UpdateMemberRequest['profile_info']>,
      ): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === id);
        if (idx === -1) return undefined;
        const current = this._members[idx];
        const nextContractType = body.member_type
          ? resolveContractTypeFromMemberType(body.member_type)
          : current._listMeta?.contract_type;
        db.mainContracts._seed();
        const mainContracts = db.mainContracts.getList();
        const defaultContract =
          mainContracts.find((contract) => contract.id === DEFAULT_MEMBER_MAIN_CONTRACT_ID) ??
          mainContracts[0];
        const selectedInitialContract =
          mainContracts.find((contract) => contract.id === body.contract_name) ??
          mainContracts.find((contract) => contract.name === body.contract_name) ??
          mainContracts.find((contract) => contract.name === current._listMeta?.contract_name) ??
          mainContracts.find((contract) => contract.name === current.profile.contract_name) ??
          defaultContract;
        let nextContractDisplayName = selectedInitialContract?.name ?? DEFAULT_MEMBER_MAIN_CONTRACT;
        let nextContractId = current._listMeta?.contract_id;

        if (body.contract_name) {
          db.contracts._seed();
          let contract = db.contracts.getByPlanName(body.contract_name);
          if (!contract) {
            const newContractId = `contract-member-${id}-${Date.now()}`;
            contract = db.contracts.create({
              contract_id: newContractId,
              data: buildMemberContractData({
                plan_name: body.contract_name,
                start_date: body.join_date ?? current.profile.joined_at,
                monthly_fee:
                  mainContracts.find((item) => item.name === body.contract_name)
                    ?.price_including_tax ??
                  mainContracts.find((item) => item.id === body.contract_name)
                    ?.price_including_tax ??
                  defaultContract?.price_including_tax ??
                  0,
                created_at: new Date().toISOString(),
              }),
            });
          }
          nextContractId = contract.contract_id;
          nextContractDisplayName =
            mainContracts.find((item) => item.name === contract.data.main_contract.plan_name)
              ?.name ??
            mainContracts.find((item) => item.id === contract.data.main_contract.plan_name)?.name ??
            defaultContract?.name ??
            DEFAULT_MEMBER_MAIN_CONTRACT;
        }

        const updated: MemberRow = {
          ...current,
          profile: {
            ...current.profile,
            member_type: body.member_type ?? current.profile.member_type,
            joined_at: body.join_date ?? current.profile.joined_at,
            store_id: body.join_store ?? current.profile.store_id,
            store_name:
              body.join_store != null
                ? (db.stores.getById(body.join_store)?.name ?? current.profile.store_name)
                : current.profile.store_name,
            brand: resolveBrand(body.brand, current.profile.brand),
            main_brand: resolveMainBrand(resolveBrand(body.brand, current.profile.brand)),
            contract_id: nextContractId ?? current.profile.contract_id,
            contract_name: nextContractDisplayName,
            join_route: body.join_route ?? current.profile.join_route,
            referrer_member_id: body.referrer_member_id ?? current.profile.referrer_member_id,
          },
          ekyc: {
            ...(current.ekyc ?? { verified: false }),
            photoUrl: body.photo_url ?? current.ekyc?.photoUrl,
          },
          _listMeta: current._listMeta
            ? {
                ...current._listMeta,
                contract_id: nextContractId ?? current._listMeta.contract_id,
                contract_type: nextContractType ?? current._listMeta.contract_type,
                contract_name: nextContractDisplayName,
              }
            : {
                contract_id:
                  nextContractId ?? current.profile.contract_id ?? DEFAULT_MEMBER_MAIN_CONTRACT_ID,
                contract_name: nextContractDisplayName,
                contract_type:
                  nextContractType ??
                  resolveContractTypeFromMemberType(current.profile.member_type),
                last_visit_date: undefined,
                has_unpaid: false,
              },
        };
        this._members[idx] = updated;
        return updated;
      },

      updateHealthInfo(id: string, body: UpdateHealthInfoRequest): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === id);
        if (idx === -1) return undefined;
        const current = this._members[idx];
        const updated: MemberRow = {
          ...current,
          health_info: {
            ...current.health_info,
            ...body,
          },
        };
        this._members[idx] = updated;
        return updated;
      },

      updateMarketingConsent(id: string, body: UpdateMarketingConsentRequest): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === id);
        if (idx === -1) return undefined;
        const current = this._members[idx];
        const updated: MemberRow = {
          ...current,
          consent: {
            ...(current.consent ?? {
              member_agreement: { version: '1.0', agreed_at: new Date().toISOString() },
              privacy_policy: { version: '1.0', agreed_at: new Date().toISOString() },
              marketing_consent: { email: false, sms: false, push: false },
            }),
            marketing_consent: {
              ...(current.consent?.marketing_consent ?? { email: false, sms: false, push: false }),
              ...body,
            },
          },
        };
        this._members[idx] = updated;
        return updated;
      },
    },

    contracts: {
      _contracts: [] as ContractRow[],
      _seeded: false,

      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        const now = new Date().toISOString();
        db.mainContracts._seed();
        for (const masterContract of db.mainContracts.getList()) {
          const name = masterContract.name;
          const monthlyFee = masterContract.price_including_tax;
          this._contracts.push({
            contract_id: masterContract.id,
            created_at: now,
            data: buildMemberContractData({
              plan_name: name,
              start_date: '2024-01-01',
              monthly_fee: monthlyFee,
              created_at: now,
            }),
          });
        }
      },

      getById(contractId: string): ContractRow | undefined {
        this._seed();
        return this._contracts.find((c) => c.contract_id === contractId);
      },

      getByPlanName(planName: string): ContractRow | undefined {
        this._seed();
        return this._contracts.find((c) => c.data.main_contract.plan_name === planName);
      },

      getByMemberId(memberId: string): GetContractsResponse | undefined {
        this._seed();
        const member = db.members._members.find((m) => m.basic_info.id === memberId);
        const contractId = member?._listMeta?.contract_id;
        if (contractId) {
          return this.getById(contractId)?.data;
        }
        // backward compatibility for any row that still stores member_id link only
        return this._contracts.find((c) => c.member_id === memberId)?.data;
      },

      getByApplicationId(applicationId: string): ContractRow | undefined {
        this._seed();
        return this._contracts.find((c) => c.application_id === applicationId);
      },

      create(input: {
        contract_id: string;
        member_id?: string;
        application_id?: string;
        data: GetContractsResponse;
      }): ContractRow {
        this._seed();
        const now = new Date().toISOString();
        const row: ContractRow = {
          contract_id: input.contract_id,
          member_id: input.member_id,
          application_id: input.application_id,
          created_at: now,
          data: input.data,
        };
        const existingIndex = this._contracts.findIndex((c) => c.contract_id === input.contract_id);
        if (existingIndex >= 0) {
          this._contracts[existingIndex] = row;
        } else {
          this._contracts.unshift(row);
        }

        if (input.member_id) {
          const member = db.members._members.find((m) => m.basic_info.id === input.member_id);
          if (member?._listMeta) {
            db.mainContracts._seed();
            const mainContracts = db.mainContracts.getList();
            const normalizedPlan =
              mainContracts.find((item) => item.name === row.data.main_contract.plan_name)?.name ??
              mainContracts.find((item) => item.id === row.data.main_contract.plan_name)?.name ??
              DEFAULT_MEMBER_MAIN_CONTRACT;
            const nextContractType =
              normalizedPlan.includes('1Day') || row.data.main_contract.plan_name.includes('1Day')
                ? 'one_day_member'
                : member._listMeta.contract_type;
            member._listMeta.contract_id = row.contract_id;
            member._listMeta.contract_name = normalizedPlan;
            member._listMeta.contract_type = nextContractType;
            member.profile.contract_id = row.contract_id;
            member.profile.contract_name = normalizedPlan;
          }
        }
        return row;
      },

      /**
       * Create initial main contract for an approved application.
       * Member creation must be done by the caller (e.g. approve API).
       */
      createFromApprovedApplication(input: {
        application: MembershipApplication;
        member_id: string;
      }): { member_id: string; contract_id: string } {
        this._seed();
        const { application, member_id } = input;
        const contractId = `CONTRACT-${application.id}`;
        const createdAt = new Date().toISOString();
        db.mainContracts._seed();
        const mainContracts = db.mainContracts.getList();
        const selectedContract =
          mainContracts.find((item) => item.id === application.plan_name) ??
          mainContracts.find((item) => item.name === application.plan_name) ??
          mainContracts.find((item) => item.id === DEFAULT_MEMBER_MAIN_CONTRACT_ID) ??
          mainContracts[0];
        const displayName = selectedContract?.name ?? DEFAULT_MEMBER_MAIN_CONTRACT;
        const monthlyFee = selectedContract?.price_including_tax ?? 0;

        const data = buildMemberContractData({
          plan_name: displayName,
          start_date: application.scheduled_start_date,
          monthly_fee: monthlyFee,
          created_at: createdAt,
        });

        this.create({
          contract_id: contractId,
          application_id: application.id,
          data,
          member_id,
        });

        return { member_id, contract_id: contractId };
      },
    },

    membershipApplications: {
      _applications: [] as MembershipApplication[],
      _details: {} as Record<string, MembershipApplicationDetails>,
      _seeded: false,

      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.mainContracts._seed();
        const plans = db.mainContracts.getList().map((contract) => contract.name);
        const riskReasons: RiskReason[] = [
          'blacklist_match',
          'duplicate_application',
          'payment_failure',
          'high_risk_score',
          'document_issue',
        ];
        const statuses: MembershipApplicationStatus[] = [
          'pending',
          'payment_failed',
          'auto_approved',
          'manual_approved',
          'rejected',
        ];
        const now = new Date();
        for (let i = 1; i <= 200; i++) {
          const appliedDate = new Date(now);
          appliedDate.setDate(appliedDate.getDate() - (i % 10));
          appliedDate.setHours(12 - (i % 12), i % 60, 0, 0);
          // Same calendar day + setHours can land *after* `now` (e.g. today 02:00 when now is 01:00).
          // Membership applications must not have applied_at in the future.
          if (appliedDate.getTime() > now.getTime()) {
            appliedDate.setTime(now.getTime() - (i % 1440) * 60 * 1000 - 1000);
          }
          const scheduledStart = new Date(appliedDate);
          scheduledStart.setDate(scheduledStart.getDate() + 5);
          const elapsedHours = Math.floor(
            (now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60),
          );
          const elapsedDays = Math.floor(elapsedHours / 24);
          const remainingHours = elapsedHours % 24;
          const elapsedTime =
            elapsedDays > 0
              ? `${elapsedDays}日${remainingHours}時間経過`
              : `${elapsedHours}時間経過`;
          const status = statuses[i % statuses.length];
          const deadline = new Date(appliedDate);
          deadline.setDate(deadline.getDate() + 7);
          this._applications.push({
            id: `APP-${String(i).padStart(5, '0')}`,
            applicant_name: `会員登録${String(i).padStart(3, '0')}`,
            applied_at: appliedDate.toISOString(),
            elapsed_time: elapsedTime,
            risk_score: 30 + (i % 70),
            risk_reason: riskReasons[i % riskReasons.length],
            plan_name: plans[i % plans.length],
            scheduled_start_date: scheduledStart.toISOString().split('T')[0],
            status,
            ...(status === 'payment_failed' && { payment_failed_deadline: deadline.toISOString() }),
            ...(status === 'pending' && { pending_deadline: deadline.toISOString() }),
          });

          const id = `APP-${String(i).padStart(5, '0')}`;
          const ekycVerified =
            status === 'auto_approved' || status === 'manual_approved' || i % 3 !== 0;
          const faceSimilarity = ekycVerified ? 88 + (i % 12) : 40 + (i % 30);
          // Seed editable detail fields (used by detail/edit screen)
          this._details[id] = {
            applicant_name: `会員登録${String(i).padStart(3, '0')}`,
            gender: i % 2 === 0 ? 'male' : 'female',
            blood_type: (['A', 'B', 'O', 'AB'] as const)[i % 4],
            birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
            applicant_email: `applicant${String(i).padStart(5, '0')}@example.jp`,
            applicant_phone: '090-1234-5678',
            applicant_address: '東京都渋谷区1-2-3',
            emergency_contact_name: '佐藤 太郎',
            emergency_contact_relationship: '配偶者',
            emergency_contact_phone: '090-8765-4321',
            contract_details: {
              plan_id: `plan-00${(i % 3) + 1}`,
              plan_name: plans[i % plans.length],
              start_date: scheduledStart.toISOString().split('T')[0],
              option_ids: [],
            },
            ekyc: {
              verified: ekycVerified,
              verified_at: appliedDate.toISOString(),
              face_photo_url: `https://example.com/ekyc/face/APP-${String(i).padStart(5, '0')}.jpg`,
              id_document_url: `https://example.com/ekyc/id/APP-${String(i).padStart(5, '0')}.jpg`,
              document_type: (
                ['運転免許証', 'マイナンバーカード', 'パスポート', '健康保険証'] as const
              )[i % 4],
              face_match: {
                similarity: faceSimilarity,
                passed: faceSimilarity >= 80,
              },
              blacklist_check: {
                matched: !ekycVerified && i % 5 === 0,
                reason: !ekycVerified && i % 5 === 0 ? '過去に不正利用の記録あり' : undefined,
              },
            } satisfies EkycResult,
          };
        }
      },

      getAll(): MembershipApplication[] {
        this._seed();
        return [...this._applications];
      },

      getById(id: string): MembershipApplication | undefined {
        this._seed();
        return this._applications.find((a) => a.id === id);
      },

      getDetails(id: string) {
        this._seed();
        return this._details[id] ?? {};
      },

      updateDetails(id: string, patch: Record<string, any>) {
        this._seed();
        const exists = this._applications.some((a) => a.id === id);
        if (!exists) return undefined;
        this._details[id] = { ...(this._details[id] ?? {}), ...patch };
        return this._details[id];
      },

      updateStatus(
        id: string,
        status: MembershipApplicationStatus,
      ): MembershipApplication | undefined {
        this._seed();
        const idx = this._applications.findIndex((a) => a.id === id);
        if (idx === -1) return undefined;
        this._applications[idx] = { ...this._applications[idx], status };
        return this._applications[idx];
      },
    },

    family: {
      _seeded: false,

      /**
       * Brand settings mock (normally from brand_settings table)
       */
      _brandSettings: {
        [Brand.JOYFIT]: {
          family_member_limit: 3,
          family_member_fee: 0,
          payment_cycle: 'monthly' as const,
        },
        [Brand.FIT365]: {
          family_member_limit: 5,
          family_member_fee: 0,
          payment_cycle: 'monthly' as const,
        },
      },

      /**
       * family_relationships table (primary -> children)
       */
      _relationships: new Map<
        string,
        Array<{
          child_member_id: string;
          relationship: FamilyRelationship;
          joined_at: string;
        }>
      >(),

      /**
       * family_registrations table
       */
      _registrations: [] as Array<{
        id: string;
        created_at: string;
        status: FamilyRegistrationStatus;
        primary_member_id: string;
        applicant_name: string;
        relationship: FamilyRelationship;
        invite_expires_at?: string;
        risk_score?: number;
        risk_reason?: string;
        ekyc?: EkycResult;
        applicant?: {
          birthday?: string;
          phone?: string;
          email?: string;
        };
        rejection_reason?: string;
        staff_id?: string;
        child_member_id?: string;
      }>,

      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;

        db.members._seed();

        const members = db.members._members;
        // Include regular, corporate and one_day_member active members as primaries
        // so by_member_type has data across all member types.
        const primaries = members.filter(
          (m) =>
            (m.profile.member_type === MemberType.REGULAR ||
              m.profile.member_type === MemberType.CORPORATE ||
              m.profile.member_type === MemberType.ONE_DAY_MEMBER) &&
            m.profile.status === MemberStatus.ACTIVE,
        );
        const familyCandidates = members.filter((m) => m.profile.member_type === MemberType.FAMILY);

        // Seed relationships deterministically: each primary gets 0-3 children from familyCandidates
        for (let i = 0; i < primaries.length; i++) {
          const p = primaries[i]!;
          const childCount = i % 4; // 0..3
          const rels: Array<{
            child_member_id: string;
            relationship: FamilyRelationship;
            joined_at: string;
          }> = [];
          for (let j = 0; j < childCount; j++) {
            const child = familyCandidates[(i * 3 + j) % familyCandidates.length]!;
            rels.push({
              child_member_id: child.basic_info.id,
              relationship: (
                ['spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild'] as const
              )[(i + j) % 6]!,
              joined_at: child.profile.joined_at,
            });
          }
          if (rels.length) this._relationships.set(p.basic_info.id, rels);
        }

        // Ensure every member_type that can have family members has enough seeded
        // relationships. Pick dedicated primaries per type and force-assign children
        // so by_member_type always returns meaningful data for all types.
        const typeGroups: Array<{ type: MemberType; count: number }> = [
          { type: MemberType.REGULAR, count: 15 },
          { type: MemberType.CORPORATE, count: 10 },
          { type: MemberType.ONE_DAY_MEMBER, count: 8 },
        ];
        const relationships: FamilyRelationship[] = [
          'spouse',
          'child',
          'parent',
          'sibling',
          'grandparent',
          'grandchild',
        ];
        let childIdx = 0;
        for (const { type, count } of typeGroups) {
          const typePrimaries = members.filter(
            (m) => m.profile.member_type === type && m.profile.status === MemberStatus.ACTIVE,
          );
          for (let k = 0; k < Math.min(count, typePrimaries.length); k++) {
            const p = typePrimaries[k]!;
            if (this._relationships.has(p.basic_info.id)) continue; // skip already seeded
            const numChildren = (k % 3) + 1; // 1..3 children
            const rels: Array<{
              child_member_id: string;
              relationship: FamilyRelationship;
              joined_at: string;
            }> = [];
            for (let j = 0; j < numChildren; j++) {
              const child = familyCandidates[childIdx % familyCandidates.length]!;
              childIdx++;
              rels.push({
                child_member_id: child.basic_info.id,
                relationship: relationships[(k + j) % relationships.length]!,
                joined_at: child.profile.joined_at,
              });
            }
            this._relationships.set(p.basic_info.id, rels);
          }
        }

        // Seed family registrations
        const statuses: FamilyRegistrationStatus[] = [
          'awaiting_acceptance',
          'awaiting_profile',
          'pending_review',
          'approved',
          'rejected',
          'completed',
          'declined',
          'expired',
          'invited',
        ];

        const riskReasons = [
          'ブラックリスト一致',
          '重複申込',
          '顔認証失敗',
          '本人確認書類不備',
          '過去に不正利用の記録あり',
        ];
        const documentTypes = ['運転免許証', 'マイナンバーカード', 'パスポート', '健康保険証'];

        const now = new Date();
        for (let i = 1; i <= 200; i++) {
          // Spread registrations across the last 12 months so period-based
          // dashboard computations have meaningful data in every bucket.
          const created = new Date(now.getFullYear(), now.getMonth() - (i % 12), (i % 28) + 1);
          created.setHours(10 + (i % 8), (i * 7) % 60, 0, 0);

          const primary = primaries[i % primaries.length]!;
          const status = statuses[i % statuses.length]!;
          const inviteExpires = new Date(created);
          inviteExpires.setDate(inviteExpires.getDate() + 7);

          const hasRisk = status === 'pending_review' || status === 'rejected';
          const riskScore = hasRisk
            ? 70 + (i % 30)
            : status === 'approved' || status === 'completed'
              ? 10 + (i % 40)
              : undefined;
          const riskReason = hasRisk ? riskReasons[i % riskReasons.length] : undefined;

          // eKYC: present for pending_review, approved, rejected, completed
          const hasEkyc = ['pending_review', 'approved', 'rejected', 'completed'].includes(status);
          const ekycVerified = status === 'approved' || status === 'completed';
          const verifiedAt = new Date(created);
          verifiedAt.setMinutes(verifiedAt.getMinutes() + 30);
          const faceSimilarity = ekycVerified ? 88 + (i % 12) : 40 + (i % 30);
          const ekyc: EkycResult | undefined = hasEkyc
            ? {
                verified: ekycVerified,
                verified_at: verifiedAt.toISOString(),
                face_photo_url: `https://example.com/ekyc/face/FR-${String(i).padStart(5, '0')}.jpg`,
                id_document_url: `https://example.com/ekyc/id/FR-${String(i).padStart(5, '0')}.jpg`,
                document_type: documentTypes[i % documentTypes.length],
                face_match: {
                  similarity: faceSimilarity,
                  passed: faceSimilarity >= 80,
                },
                blacklist_check: {
                  matched: hasRisk && riskReason === 'ブラックリスト一致',
                  reason:
                    hasRisk && riskReason === 'ブラックリスト一致'
                      ? '過去に不正利用の記録あり'
                      : undefined,
                },
              }
            : undefined;

          this._registrations.push({
            id: `FR-${String(i).padStart(5, '0')}`,
            created_at: created.toISOString(),
            status,
            primary_member_id: primary.basic_info.id,
            applicant_name: `家族申請者${String(i).padStart(3, '0')}`,
            relationship: (
              ['spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild'] as const
            )[i % 6]!,
            invite_expires_at:
              status === 'expired'
                ? new Date(created.getTime() + 2 * 24 * 3600 * 1000).toISOString()
                : inviteExpires.toISOString(),
            risk_score: riskScore,
            risk_reason: riskReason,
            ekyc,
            applicant: {
              birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
              phone: `090${String(1000 + (i % 9000)).slice(-4)}${String(2000 + (i % 8000)).slice(-4)}`,
              email: `family${String(i).padStart(5, '0')}@example.jp`,
            },
            ...(status === 'rejected'
              ? { rejection_reason: 'リスクスコアが高すぎます', staff_id: 'staff-001' }
              : {}),
          });
        }
      },

      getBrandSettingsByPrimaryMemberId(primary_member_id: string) {
        this._seed();
        const primary = db.members.get(primary_member_id);
        const mainBrand = primary?.profile.main_brand ?? 'fit365';
        const settings = this._brandSettings[mainBrand] ?? this._brandSettings[Brand.FIT365];
        const brand = primary?.profile.brand ?? Brand.FIT365;
        return { brand, settings };
      },

      getFamilyMembers(primary_member_id: string) {
        this._seed();
        const { brand, settings } = this.getBrandSettingsByPrimaryMemberId(primary_member_id);
        const rels = this._relationships.get(primary_member_id) ?? [];
        const members = rels
          .map((r) => {
            const child = db.members.get(r.child_member_id);
            if (!child) return undefined;
            return {
              id: child.basic_info.id,
              member_number: child.basic_info.member_number,
              name_kanji: child.basic_info.name_kanji,
              relationship: r.relationship,
              joined_at: r.joined_at,
              status: child.profile.status,
              monthly_fee: settings.family_member_fee,
              store_id: child.profile.store_id,
              store_name: child.profile.store_name,
            };
          })
          .filter(Boolean);
        return { brand, settings, members };
      },

      /** Primary member id when this member is registered as a family child, if any. */
      getPrimaryMemberIdForChild(child_member_id: string): string | undefined {
        this._seed();
        for (const [primaryId, rels] of this._relationships) {
          if (rels.some((r) => r.child_member_id === child_member_id)) return primaryId;
        }
        return undefined;
      },

      getRelationshipToPrimary(child_member_id: string, primary_member_id: string) {
        this._seed();
        const rels = this._relationships.get(primary_member_id) ?? [];
        return rels.find((r) => r.child_member_id === child_member_id)?.relationship;
      },

      listChildRelationships(primary_member_id: string) {
        this._seed();
        return [...(this._relationships.get(primary_member_id) ?? [])];
      },

      listRegistrations() {
        this._seed();
        return [...this._registrations];
      },

      getRegistrationById(id: string) {
        this._seed();
        return this._registrations.find((r) => r.id === id);
      },

      createRegistration(input: {
        primary_member_id: string;
        applicant: {
          name: string;
          birthday: string;
          relationship: FamilyRelationship;
          phone?: string;
          email?: string;
        };
      }) {
        this._seed();
        const now = new Date().toISOString();
        const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
        const next = this._registrations.length + 1;
        const row = {
          id: `FR-${String(next).padStart(5, '0')}`,
          created_at: now,
          status: 'awaiting_profile' as FamilyRegistrationStatus,
          primary_member_id: input.primary_member_id,
          applicant_name: input.applicant.name,
          relationship: input.applicant.relationship,
          invite_expires_at: inviteExpiresAt,
          risk_score: undefined as number | undefined,
          risk_reason: undefined as string | undefined,
          ekyc: undefined as EkycResult | undefined,
          applicant: {
            birthday: input.applicant.birthday,
            phone: input.applicant.phone,
            email: input.applicant.email,
          },
        };
        this._registrations.unshift(row);
        return row;
      },

      linkChildRelationship(
        primary_member_id: string,
        child_member_id: string,
        relationship: FamilyRelationship,
      ) {
        this._seed();
        const existing = this._relationships.get(primary_member_id) ?? [];
        // Avoid duplicates
        if (existing.some((r) => r.child_member_id === child_member_id)) return;
        existing.push({
          child_member_id,
          relationship,
          joined_at: toIsoDate(new Date()),
        });
        this._relationships.set(primary_member_id, existing);
      },

      updateRegistrationStatus(
        id: string,
        status: FamilyRegistrationStatus,
        patch?: Record<string, any>,
      ) {
        this._seed();
        const idx = this._registrations.findIndex((r) => r.id === id);
        if (idx === -1) return undefined;
        this._registrations[idx] = { ...this._registrations[idx], status, ...(patch ?? {}) };
        return this._registrations[idx];
      },
    },

    referrals: {
      _seeded: false,

      _byReferrer: new Map<
        string,
        Array<{
          referee_member_id: string;
          referred_at: string;
          points_earned: number | null;
          points_status_ja: string;
        }>
      >(),

      _refereeToReferrer: new Map<
        string,
        {
          referrer_member_id: string;
          referred_at: string;
          benefit_description: string;
        }
      >(),

      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.members._seed();
        const members = db.members._members;
        for (let i = 0; i < members.length - 2; i++) {
          if (i % 11 !== 0) continue;
          const referrer = members[i]!;
          const batch: Array<{
            referee_member_id: string;
            referred_at: string;
            points_earned: number | null;
            points_status_ja: string;
          }> = [];
          const referredAt = `2024-06-${String((i % 27) + 1).padStart(2, '0')}`;
          for (let k = 1; k <= 2; k++) {
            const referee = members[i + k];
            if (!referee) break;
            const joined =
              referee.profile.status === MemberStatus.ACTIVE ||
              referee.profile.status === MemberStatus.SUSPENDED;
            const withdrew =
              referee.profile.status === MemberStatus.WITHDRAWN ||
              referee.profile.status === MemberStatus.FORCE_WITHDRAWN;
            const points = joined ? 300 * k : null;
            const points_status_ja = joined
              ? `付与済み（${points}P）`
              : withdrew
                ? '退会により対象外'
                : '未付与';
            batch.push({
              referee_member_id: referee.basic_info.id,
              referred_at: referredAt,
              points_earned: points,
              points_status_ja,
            });
            if (!this._refereeToReferrer.has(referee.basic_info.id)) {
              this._refereeToReferrer.set(referee.basic_info.id, {
                referrer_member_id: referrer.basic_info.id,
                referred_at: referredAt,
                benefit_description: '初月会費50%オフ（紹介特典）',
              });
            }
          }
          if (batch.length) this._byReferrer.set(referrer.basic_info.id, batch);
        }
      },

      getForMember(memberId: string) {
        this._seed();
        return {
          asReferrerRows: this._byReferrer.get(memberId) ?? [],
          asRefereeRow: this._refereeToReferrer.get(memberId),
        };
      },
    },

    getMemberRelationships(memberId: string) {
      db.members._seed();
      db.family._seed();
      db.referrals._seed();

      const member = db.members.get(memberId);
      if (!member) return null;

      const memberType = member.profile.member_type;

      let family:
        | {
            role: 'primary';
            children: Array<{
              id: string;
              member_number: string;
              name: string;
              relationship: string;
              status: MemberProfile['status'];
            }>;
            current_count: number;
            max_count: number;
          }
        | {
            role: 'family_child';
            parent: {
              id: string;
              member_number: string;
              name: string;
              relationship: string;
              status: MemberProfile['status'];
            };
          }
        | null = null;

      const childRows = db.family.listChildRelationships(memberId);
      // member is primary member
      if (childRows.length > 0) {
        const { settings } = db.family.getBrandSettingsByPrimaryMemberId(memberId);
        family = {
          role: 'primary',
          current_count: childRows.length,
          max_count: settings.family_member_limit,
          children: childRows
            .map((r) => {
              const child = db.members.get(r.child_member_id);
              if (!child) return undefined;
              return {
                id: child.basic_info.id,
                member_number: child.basic_info.member_number,
                name: child.basic_info.name_kanji,
                relationship: familyRelationshipToJa(r.relationship),
                status: child.profile.status,
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x)),
        };
      }
      // member is child member
      else if (memberType === MemberType.FAMILY) {
        const primaryId = db.family.getPrimaryMemberIdForChild(memberId);
        if (primaryId) {
          const parent = db.members.get(primaryId);
          const relEnum = db.family.getRelationshipToPrimary(memberId, primaryId);
          if (parent) {
            family = {
              role: 'family_child',
              parent: {
                id: parent.basic_info.id,
                member_number: parent.basic_info.member_number,
                name: parent.basic_info.name_kanji,
                relationship: relEnum ? familyRelationshipToJa(relEnum) : '—',
                status: parent.profile.status,
              },
            };
          }
        }
      }

      let corporate: {
        corporate_detail_member_id: string;
        corporate_name: string;
        corporate_number: string;
        contract_type: string;
        company_discount: { applied: boolean; rate_percent: number | null };
        contact_department: string;
        contact_name: string;
      } | null = null;

      if (memberType === MemberType.CORPORATE) {
        corporate = {
          corporate_detail_member_id: member.basic_info.id,
          corporate_name: `${member.basic_info.name_kanji}（法人契約）`,
          corporate_number: `7${String(member.basic_info.id.replace(/\D/g, '') || '0')
            .padStart(12, '0')
            .slice(0, 12)}`,
          contract_type: '法人団体契約（標準）',
          company_discount: { applied: true, rate_percent: 20 },
          contact_department: '総務・人事部',
          contact_name: '営業 一郎',
        };
      } else if (memberType === MemberType.ONE_DAY_MEMBER) {
        const corpMember = db.members._members.find(
          (m) => m.profile.member_type === MemberType.CORPORATE,
        );
        if (corpMember) {
          corporate = {
            corporate_detail_member_id: corpMember.basic_info.id,
            corporate_name: 'サンプル株式会社（社割提携法人）',
            corporate_number: '7010001056789',
            contract_type: '社員優待（法人付帯）',
            company_discount: { applied: true, rate_percent: 15 },
            contact_department: '人事部',
            contact_name: corpMember.basic_info.name_kanji,
          };
        }
      }

      const { asReferrerRows, asRefereeRow } = db.referrals.getForMember(memberId);
      const referralsMapped = asReferrerRows
        .map((r) => {
          const refMember = db.members.get(r.referee_member_id);
          if (!refMember) return undefined;
          const st = refMember.profile.status;
          let membership_status_ja = '未入会';
          if (st === MemberStatus.ACTIVE) membership_status_ja = '入会済み（利用中）';
          else if (st === MemberStatus.SUSPENDED) membership_status_ja = '入会済み（休会中）';
          else if (st === MemberStatus.WITHDRAWN || st === MemberStatus.FORCE_WITHDRAWN) {
            membership_status_ja = '退会済み';
          }
          return {
            id: refMember.basic_info.id,
            member_number: refMember.basic_info.member_number,
            name: refMember.basic_info.name_kanji,
            referred_at: r.referred_at,
            membership_status: membership_status_ja,
            points_status: r.points_status_ja,
            points_earned: r.points_earned,
          };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x));

      const totalPoints = referralsMapped.reduce((acc, r) => acc + (r.points_earned ?? 0), 0);

      let as_referee: {
        referrer: {
          id: string;
          member_number: string;
          name: string;
          referred_at: string;
          referral_benefit: string;
        };
      } | null = null;
      if (asRefereeRow) {
        const ref = db.members.get(asRefereeRow.referrer_member_id);
        if (ref) {
          as_referee = {
            referrer: {
              id: ref.basic_info.id,
              member_number: ref.basic_info.member_number,
              name: ref.basic_info.name_kanji,
              referred_at: asRefereeRow.referred_at,
              referral_benefit: asRefereeRow.benefit_description,
            },
          };
        }
      }
      return {
        family,
        corporate,
        referral: {
          as_referrer: {
            referrals: referralsMapped,
            summary: {
              total_referrals: referralsMapped.length,
              total_points: totalPoints,
            },
          },
          as_referee,
        },
      };
    },
    positions: {
      _rows: [] as Position[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows.push(...SEED_POSITION_ROWS);
      },
      getList(): Position[] {
        this._seed();
        return [...this._rows];
      },
      getById(id: number): Position | undefined {
        this._seed();
        return this._rows.find((p) => p.id === id);
      },
    },
    mainContracts: {
      _rows: [] as MainContractListItem[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows.push(
          {
            id: 'MC001',
            name: 'レギュラー会員',
            contract_type: 'general',
            brand: 'joyfit24',
            target_store_name: null,
            price_including_tax: 7700,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC001-A',
            name: 'レギュラー会員（学生）',
            contract_type: 'student',
            brand: 'joyfit24',
            target_store_name: null,
            price_including_tax: 5500,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC002',
            name: 'ナイト会員',
            contract_type: 'general',
            brand: 'fit365',
            target_store_name: null,
            price_including_tax: 5500,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC003',
            name: 'デイタイム会員',
            contract_type: 'general',
            brand: 'joyfit',
            target_store_name: null,
            price_including_tax: 6600,
            companion_benefit_enabled: true,
            status: 'active',
          },
          {
            id: 'MC005',
            name: 'シニア会員（当店限定）',
            contract_type: 'special',
            brand: 'joyfit',
            target_store_name: 'JOYFIT池袋店',
            price_including_tax: 4400,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC007',
            name: '1Day利用',
            contract_type: 'oneDay',
            brand: 'joyfit24',
            target_store_name: null,
            price_including_tax: 1650,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC010',
            name: 'スタッフ会員（当店限定）',
            contract_type: 'special',
            brand: 'joyfit24',
            target_store_name: 'JOYFIT24新宿店',
            price_including_tax: 0,
            companion_benefit_enabled: true,
            status: 'inactive',
          },
          {
            id: 'MC011',
            name: 'ファミリー会員',
            contract_type: 'family',
            brand: 'joyfit',
            target_store_name: null,
            price_including_tax: 8800,
            companion_benefit_enabled: true,
            status: 'active',
          },
          {
            id: 'MC012',
            name: 'キッズ会員',
            contract_type: 'kids',
            brand: 'fit365',
            target_store_name: null,
            price_including_tax: 4400,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC013',
            name: '法人スタンダード',
            contract_type: 'corporate',
            brand: 'joyfit24',
            target_store_name: null,
            price_including_tax: 9900,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC014',
            name: '福利厚生プラン',
            contract_type: 'welfare',
            brand: 'fit365',
            target_store_name: null,
            price_including_tax: 7150,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC015',
            name: 'プリペイド30',
            contract_type: 'prepaid',
            brand: 'joyfit',
            target_store_name: null,
            price_including_tax: 3300,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC016',
            name: '朝活会員',
            contract_type: 'general',
            brand: 'joyfit_yoga',
            target_store_name: null,
            price_including_tax: 6050,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC017',
            name: '平日デイ会員',
            contract_type: 'general',
            brand: 'joyfit_plus',
            target_store_name: null,
            price_including_tax: 6600,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC018',
            name: 'シニア午前会員',
            contract_type: 'special',
            brand: 'joyfit24',
            target_store_name: 'JOYFIT24 新宿店',
            price_including_tax: 3850,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC019',
            name: '学生ナイト会員',
            contract_type: 'student',
            brand: 'joyfit',
            target_store_name: null,
            price_including_tax: 4950,
            companion_benefit_enabled: false,
            status: 'active',
          },
          {
            id: 'MC020',
            name: 'Weekend会員',
            contract_type: 'general',
            brand: 'fit365',
            target_store_name: null,
            price_including_tax: 5720,
            companion_benefit_enabled: true,
            status: 'active',
          },
        );
      },
      getList(): MainContractListItem[] {
        this._seed();
        return [...this._rows];
      },
    },
    optionMasters: {
      _rows: [] as OptionMasterListItem[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows.push(
          {
            id: 'OP001',
            name: 'ドリンクバー（月額）',
            brand: 'fit365',
            option_type: 'standard',
            price_including_tax: 550,
            prorated_enabled: true,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP002',
            name: '水素水',
            brand: 'joyfit24',
            option_type: 'standard',
            price_including_tax: 1100,
            prorated_enabled: true,
            usage_rule: 'add_remove',
            status: 'active',
          },
          {
            id: 'OP003',
            name: 'タオルセット',
            brand: 'joyfit24',
            option_type: 'standard',
            price_including_tax: 330,
            prorated_enabled: true,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP006',
            name: '契約ロッカー',
            brand: 'joyfit24',
            option_type: 'standard',
            price_including_tax: 1100,
            prorated_enabled: false,
            usage_rule: 'change_remove',
            status: 'active',
          },
          {
            id: 'OP007',
            name: 'パーソナルトレーニング（月2回）',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 13200,
            prorated_enabled: false,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP011',
            name: 'パーソナルトレーニング（月4回）',
            brand: 'joyfit24',
            option_type: 'metered',
            price_including_tax: 22000,
            prorated_enabled: false,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP021',
            name: '安心サポート（当店版）',
            brand: 'joyfit24',
            option_type: 'auto_attached',
            price_including_tax: 660,
            prorated_enabled: false,
            usage_rule: 'disabled',
            status: 'active',
          },
          {
            id: 'OP022',
            name: '有料駐車場チケット（当店限定）',
            brand: 'fit365',
            option_type: 'standard',
            price_including_tax: 1100,
            prorated_enabled: true,
            usage_rule: 'add_remove',
            status: 'inactive',
          },
          {
            id: 'OP023',
            name: 'プロテインサーバー',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 1650,
            prorated_enabled: false,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP024',
            name: 'コラーゲンマシン',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 2200,
            prorated_enabled: false,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP025',
            name: '契約ロッカーL',
            brand: 'joyfit',
            option_type: 'standard',
            price_including_tax: 1650,
            prorated_enabled: true,
            usage_rule: 'change_remove',
            status: 'active',
          },
          {
            id: 'OP026',
            name: 'タンニング',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 3300,
            prorated_enabled: false,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP027',
            name: 'ボディプランナー',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 1980,
            prorated_enabled: false,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP028',
            name: 'シャワー利用',
            brand: 'joyfit24',
            option_type: 'metered',
            price_including_tax: 550,
            prorated_enabled: false,
            usage_rule: 'add_remove',
            status: 'active',
          },
          {
            id: 'OP029',
            name: 'レンタルウェア',
            brand: 'joyfit',
            option_type: 'standard',
            price_including_tax: 880,
            prorated_enabled: true,
            usage_rule: 'add_remove_change',
            status: 'active',
          },
          {
            id: 'OP030',
            name: '安心サポートPLUS',
            brand: 'joyfit_plus',
            option_type: 'auto_attached',
            price_including_tax: 880,
            prorated_enabled: false,
            usage_rule: 'disabled',
            status: 'active',
          },
          {
            id: 'OP031',
            name: 'メンテナンス会費',
            brand: 'fit365',
            option_type: 'auto_attached',
            price_including_tax: 770,
            prorated_enabled: false,
            usage_rule: 'disabled',
            status: 'active',
          },
          {
            id: 'OP032',
            name: '水素水プレミアム',
            brand: 'joyfit_yoga',
            option_type: 'standard',
            price_including_tax: 1430,
            prorated_enabled: true,
            usage_rule: 'add_remove',
            status: 'active',
          },
        );
      },
      getList(): OptionMasterListItem[] {
        this._seed();
        return [...this._rows];
      },
    },
    storeMainContracts: {
      _rows: [] as Array<{ store_id: string; main_contract_id: string; linked_at: string }>,
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.stores._seed();
        db.mainContracts._seed();
        const seeds = [
          { store_id: 'store-001', ids: ['MC001', 'MC002', 'MC003'] },
          { store_id: 'store-002', ids: ['MC001', 'MC001-A'] },
          { store_id: 'store-006', ids: ['MC001', 'MC005'] },
        ];
        for (const seed of seeds) {
          for (const id of seed.ids) {
            this._rows.push({
              store_id: seed.store_id,
              main_contract_id: id,
              linked_at: '2024/04/01',
            });
          }
        }
      },
      listByStoreId(storeId: string): StoreLinkedMainContract[] {
        this._seed();
        db.mainContracts._seed();
        const masterMap = new Map(db.mainContracts.getList().map((item) => [item.id, item]));
        return this._rows
          .filter((row) => row.store_id === storeId)
          .map((row) => {
            const master = masterMap.get(row.main_contract_id);
            if (!master) return undefined;
            return {
              id: master.id,
              name: master.name,
              contract_type: master.contract_type,
              price_including_tax: master.price_including_tax,
              linked_at: row.linked_at,
            };
          })
          .filter((item): item is StoreLinkedMainContract => Boolean(item));
      },
      addByStoreId(storeId: string, mainContractIds: string[]): StoreLinkedMainContract[] {
        this._seed();
        const current = new Set(
          this._rows.filter((row) => row.store_id === storeId).map((row) => row.main_contract_id),
        );
        const today = new Date().toLocaleDateString('ja-JP').replaceAll('-', '/');
        for (const id of mainContractIds) {
          if (current.has(id)) continue;
          this._rows.push({ store_id: storeId, main_contract_id: id, linked_at: today });
        }
        return this.listByStoreId(storeId);
      },
      removeByStoreId(storeId: string, mainContractId: string): boolean {
        this._seed();
        const before = this._rows.length;
        this._rows = this._rows.filter(
          (row) => !(row.store_id === storeId && row.main_contract_id === mainContractId),
        );
        return this._rows.length < before;
      },
    },
    storeOptions: {
      _rows: [] as Array<{ store_id: string; option_id: string; linked_at: string }>,
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.stores._seed();
        db.optionMasters._seed();
        const seeds = [
          { store_id: 'store-001', ids: ['OP002', 'OP003', 'OP006'] },
          { store_id: 'store-002', ids: ['OP001', 'OP007'] },
          { store_id: 'store-006', ids: ['OP021'] },
        ];
        for (const seed of seeds) {
          for (const id of seed.ids) {
            this._rows.push({ store_id: seed.store_id, option_id: id, linked_at: '2024/04/01' });
          }
        }
      },
      listByStoreId(storeId: string): StoreLinkedOption[] {
        this._seed();
        db.optionMasters._seed();
        const masterMap = new Map(db.optionMasters.getList().map((item) => [item.id, item]));
        return this._rows
          .filter((row) => row.store_id === storeId)
          .map((row) => {
            const master = masterMap.get(row.option_id);
            if (!master) return undefined;
            return {
              id: master.id,
              name: master.name,
              related_option_name:
                master.option_type === 'metered'
                  ? 'パーソナル'
                  : master.option_type === 'auto_attached'
                    ? '自動付与'
                    : null,
              price_including_tax: master.price_including_tax,
            };
          })
          .filter((item): item is StoreLinkedOption => Boolean(item));
      },
      addByStoreId(storeId: string, optionIds: string[]): StoreLinkedOption[] {
        this._seed();
        const current = new Set(
          this._rows.filter((row) => row.store_id === storeId).map((row) => row.option_id),
        );
        const today = new Date().toLocaleDateString('ja-JP').replaceAll('-', '/');
        for (const id of optionIds) {
          if (current.has(id)) continue;
          this._rows.push({ store_id: storeId, option_id: id, linked_at: today });
        }
        return this.listByStoreId(storeId);
      },
      removeByStoreId(storeId: string, optionId: string): boolean {
        this._seed();
        const before = this._rows.length;
        this._rows = this._rows.filter(
          (row) => !(row.store_id === storeId && row.option_id === optionId),
        );
        return this._rows.length < before;
      },
    },
    stores: {
      _rows: [] as Store[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;

        type StoreSeedSpec = {
          name: string;
          brand: Store['brand'];
          code: string;
          pass: number;
          mutualOn: boolean;
          mutualType: Store['mutual_use_type'];
          fc?: string | null;
          contract?: NonNullable<Store['main_contract_status']>;
          closing?: string | null;
          area: Store['area'];
          operating_company_name: string;
          status: Store['status'];
        };

        const STORE_SEED_META: { c: string; u: string; cb: string; ub: string }[] = [
          { c: '2024-01-10T09:00:00Z', u: '2026-03-01T12:00:00Z', cb: 'STF-001', ub: 'STF-001' },
          { c: '2024-01-11T09:00:00Z', u: '2026-02-15T10:00:00Z', cb: 'STF-001', ub: 'STF-002' },
          { c: '2024-01-12T09:00:00Z', u: '2026-01-20T11:00:00Z', cb: 'STF-002', ub: 'STF-002' },
          { c: '2024-02-01T09:00:00Z', u: '2026-03-10T09:30:00Z', cb: 'STF-003', ub: 'STF-003' },
          { c: '2024-02-05T09:00:00Z', u: '2026-02-28T08:00:00Z', cb: 'STF-004', ub: 'STF-004' },
          { c: '2024-03-01T09:00:00Z', u: '2026-03-05T12:00:00Z', cb: 'STF-001', ub: 'STF-001' },
          { c: '2024-03-10T09:00:00Z', u: '2026-02-10T09:00:00Z', cb: 'STF-002', ub: 'STF-002' },
          { c: '2024-04-01T09:00:00Z', u: '2026-01-15T10:00:00Z', cb: 'STF-003', ub: 'STF-003' },
          { c: '2025-01-10T09:00:00Z', u: '2026-04-01T15:00:00Z', cb: 'STF-001', ub: 'STF-001' },
          { c: '2020-06-01T09:00:00Z', u: '2025-12-01T10:00:00Z', cb: 'STF-004', ub: 'STF-004' },
        ];

        const STORE_SEED_SPECS: StoreSeedSpec[] = [
          {
            name: 'Fit365八潮店',
            brand: 'fit365',
            code: 'STR-00001',
            pass: 800,
            mutualOn: true,
            mutualType: 'within_brand',
            area: 'kanto',
            operating_company_name: '株式会社ウェルネスフロンティア',
            status: 'operating',
          },
          {
            name: 'Fit365新宿店',
            brand: 'fit365',
            code: 'STR-00002',
            pass: 900,
            mutualOn: true,
            mutualType: 'cross_brand',
            area: 'kanto',
            operating_company_name: '株式会社ウェルネスフロンティア',
            status: 'operating',
          },
          {
            name: 'Fit365渋谷店',
            brand: 'fit365',
            code: 'STR-00003',
            pass: 850,
            mutualOn: false,
            mutualType: 'none',
            area: 'kanto',
            operating_company_name: '株式会社フィット365',
            status: 'operating',
          },
          {
            name: 'JOYFIT池袋店',
            brand: 'joyfit',
            code: 'STR-10004',
            pass: 1000,
            mutualOn: true,
            mutualType: 'within_brand',
            area: 'kanto',
            operating_company_name: '株式会社ジェイフィット',
            status: 'operating',
          },
          {
            name: 'JOYFIT池袋店',
            brand: 'joyfit',
            code: 'STR-10005',
            pass: 950,
            mutualOn: true,
            mutualType: 'custom',
            fc: 'fc-001',
            area: 'kanto',
            operating_company_name: 'FCワーカーズ株式会社',
            status: 'operating',
          },
          {
            name: 'JOYFIT24 新宿店',
            brand: 'joyfit24',
            code: 'TK-006',
            pass: 900,
            mutualOn: true,
            mutualType: 'within_brand',
            area: 'kanto',
            operating_company_name: '株式会社ウェルネスフロンティア',
            status: 'operating',
          },
          {
            name: 'JOYFIT YOGA 心斎橋店',
            brand: 'joyfit_yoga',
            code: 'YG-007',
            pass: 1100,
            mutualOn: true,
            mutualType: 'none',
            area: 'kansai',
            operating_company_name: '株式会社ウェルネスフロンティア',
            status: 'operating',
          },
          {
            name: 'JOYFIT+ 名古屋駅前店',
            brand: 'joyfit_plus',
            code: 'JP-008',
            pass: 950,
            mutualOn: false,
            mutualType: 'none',
            contract: 'suspended',
            area: 'chubu',
            operating_company_name: '株式会社JOYFITプラス',
            status: 'closed_temp',
          },
          {
            name: 'Fit365梅田店',
            brand: 'fit365',
            code: 'TK-009',
            pass: 850,
            mutualOn: true,
            mutualType: 'cross_brand',
            contract: 'draft',
            area: 'kansai',
            operating_company_name: '株式会社フィット365',
            status: 'preparing',
          },
          {
            name: 'ジョイフィット静岡店',
            brand: 'joyfit',
            code: 'STR-10010',
            pass: 1000,
            mutualOn: false,
            mutualType: 'none',
            contract: 'terminated',
            closing: '2025-12-31',
            area: 'other',
            operating_company_name: '株式会社ジェイフィット',
            status: 'closed_perm',
          },
        ];

        if (STORE_SEED_SPECS.length !== STORE_SEED_META.length) {
          throw new Error('STORE_SEED_SPECS and STORE_SEED_META must have the same length');
        }

        for (let i = 0; i < STORE_SEED_SPECS.length; i++) {
          const spec = STORE_SEED_SPECS[i]!;
          const meta = STORE_SEED_META[i]!;
          const n = i + 1;
          const storeKey = `store-${String(n).padStart(3, '0')}`;
          const contract = spec.contract ?? 'active';
          this._rows.push({
            id: storeKey,
            store_id: `S-${String(n).padStart(3, '0')}`,
            club_code: spec.code,
            name: spec.name,
            brand: spec.brand,
            area: spec.area,
            operating_company_name: spec.operating_company_name,
            status: spec.status,
            fc_company_id: spec.fc ?? null,
            manager_staff_id: null,
            main_contract_id: `ctr-store-${String(n).padStart(3, '0')}`,
            main_contract_status: contract,
            option_pass_price: spec.pass,
            mutual_use_enabled: spec.mutualOn,
            mutual_use_type: spec.mutualType,
            closing_date: spec.closing ?? null,
            locker_map_id: `locker-map-${String(n).padStart(3, '0')}`,
            asset_id: null,
            created_by: meta.cb,
            created_at: meta.c,
            updated_by: meta.ub,
            updated_at: meta.u,
          });
        }
      },
      getList(): Store[] {
        this._seed();
        return [...this._rows];
      },
      getById(id: string): Store | undefined {
        this._seed();
        return this._rows.find((s) => s.id === id);
      },
      create(input: Omit<Store, 'id' | 'store_id' | 'created_at' | 'updated_at'>): Store {
        this._seed();
        const nextNumber = this._rows.length + 1;
        const now = new Date().toISOString();
        const row: Store = {
          ...input,
          id: `store-${String(nextNumber).padStart(3, '0')}`,
          store_id: `S-${String(nextNumber).padStart(3, '0')}`,
          created_at: now,
          updated_at: now,
        };
        this._rows.unshift(row);
        return row;
      },
      updateById(id: string, patch: Partial<Store>): Store | undefined {
        this._seed();
        const index = this._rows.findIndex((s) => s.id === id);
        if (index === -1) return undefined;
        const current = this._rows[index]!;
        const updated: Store = {
          ...current,
          ...patch,
          id: current.id,
          store_id: current.store_id,
          created_at: current.created_at,
          updated_at: new Date().toISOString(),
        };
        this._rows[index] = updated;
        return updated;
      },
      setManagerStaff(storeId: string, manager_staff_id: string | null): void {
        this._seed();
        const row = this._rows.find((s) => s.id === storeId);
        if (row) row.manager_staff_id = manager_staff_id;
      },
    },
    store_access_settings: {
      _byStoreId: {} as Record<string, StoreAccessSettings>,
      _seeded: false,
      _default(): StoreAccessSettings {
        return {
          mutual_use_enabled: true,
          start_date: '2024/04/01',
          end_date: '2027/03/31',
          under18_start_time: '10:00',
          under18_end_time: '18:00',
          permitted_stores: [
            {
              id: 'g-1',
              store_name: 'JOYFIT24新宿店',
              brand: 'joyfit24',
              setup_date: '2024/04/01',
            },
            {
              id: 'g-2',
              store_name: 'JOYFIT24渋谷店',
              brand: 'joyfit24',
              setup_date: '2024/04/01',
            },
            {
              id: 'g-3',
              store_name: 'FIT365八潮店',
              brand: 'fit365',
              setup_date: '2025/01/15',
            },
          ],
          joy_usage_fees: [
            { id: 'fee-1', option_name: '1日利用券（一般）', fee: 2200 },
            { id: 'fee-2', option_name: '1日利用券（学生）', fee: 1650 },
          ],
        };
      },
      _clone(data: StoreAccessSettings): StoreAccessSettings {
        return JSON.parse(JSON.stringify(data)) as StoreAccessSettings;
      },
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.stores._seed();
        for (const store of db.stores._rows) {
          this._byStoreId[store.id] = this._clone(this._default());
        }
      },
      getByStoreId(storeId: string): StoreAccessSettings | undefined {
        this._seed();
        if (!db.stores.getById(storeId)) return undefined;
        const row = this._byStoreId[storeId];
        return this._clone(row ?? this._default());
      },
      replaceForStore(storeId: string, data: StoreAccessSettings): StoreAccessSettings | undefined {
        this._seed();
        if (!db.stores.getById(storeId)) return undefined;
        const next = this._clone(data);
        this._byStoreId[storeId] = next;
        return this._clone(next);
      },
    },
    businessHours: {
      _rows: [] as StoreBusinessHours[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.stores._seed();
        const now = '2026-03-01T12:00:00Z';
        for (const store of db.stores._rows) {
          this._rows.push({
            store_id: store.id,
            default_hours: [
              { day: 'mon', open_time: '10:00', close_time: '23:00', is_closed: false },
              { day: 'tue', open_time: '10:00', close_time: '23:00', is_closed: false },
              { day: 'wed', open_time: '10:00', close_time: '23:00', is_closed: false },
              { day: 'thu', open_time: '10:00', close_time: '23:00', is_closed: false },
              { day: 'fri', open_time: '10:00', close_time: '23:00', is_closed: false },
              { day: 'sat', open_time: '10:00', close_time: '20:00', is_closed: false },
              { day: 'sun', open_time: '10:00', close_time: '18:00', is_closed: false },
              { day: 'holiday', open_time: '10:00', close_time: '18:00', is_closed: false },
            ],
            exception_hours: [
              {
                id: `exc-${store.id}-001`,
                date: '2026-12-31',
                open_time: '10:00',
                close_time: '17:00',
              },
            ],
            temporary_closures: [
              { id: `tcl-${store.id}-001`, date: '2026-03-15', reason: '設備点検' },
            ],
            updated_at: now,
            updated_by: 'STF-001',
          });
        }
      },
      getByStoreId(storeId: string): StoreBusinessHours | undefined {
        this._seed();
        return this._rows.find((r) => r.store_id === storeId);
      },
      upsert(
        storeId: string,
        patch: Partial<Omit<StoreBusinessHours, 'store_id'>>,
      ): StoreBusinessHours {
        this._seed();
        const idx = this._rows.findIndex((r) => r.store_id === storeId);
        const now = new Date().toISOString();
        if (idx === -1) {
          const row: StoreBusinessHours = {
            store_id: storeId,
            default_hours: patch.default_hours ?? [],
            exception_hours: patch.exception_hours ?? [],
            temporary_closures: patch.temporary_closures ?? [],
            updated_at: now,
            updated_by: patch.updated_by ?? 'system',
          };
          this._rows.push(row);
          return row;
        }
        const current = this._rows[idx]!;
        const updated: StoreBusinessHours = {
          ...current,
          ...patch,
          store_id: storeId,
          updated_at: now,
        };
        this._rows[idx] = updated;
        return updated;
      },
    },
    staff_permissions: {
      getByStaffId(staff_id: string): StaffPermissionRecord[] {
        return permissionRows.filter((r) => r.staff_id === staff_id);
      },
      removeForStaff(staff_id: string): void {
        for (let j = permissionRows.length - 1; j >= 0; j--) {
          if (permissionRows[j]!.staff_id === staff_id) permissionRows.splice(j, 1);
        }
      },
      replaceForStaff(staff_id: string, rows: Array<{ permission_code: string }>): void {
        this.removeForStaff(staff_id);
        for (const r of rows) {
          permissionRows.push({
            id: nextStaffPermissionId++,
            staff_id,
            permission_code: r.permission_code,
          });
        }
      },
    },
    brands: {
      _rows: [] as BrandItem[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows.push(...SEED_BRAND_ROWS.map((b) => ({ ...b })));
      },
      getList(): BrandItem[] {
        this._seed();
        return [...this._rows].sort((a, b) => a.sort_order - b.sort_order);
      },
      getByCode(code: string): BrandItem | undefined {
        this._seed();
        return this._rows.find((r) => r.code === code);
      },
      update(
        code: string,
        patch: Partial<Pick<BrandItem, 'enrollment_fee_yen' | 'handling_fee_yen' | 'updated_by'>>,
      ): BrandItem | undefined {
        this._seed();
        const idx = this._rows.findIndex((r) => r.code === code);
        if (idx === -1) return undefined;
        const row = this._rows[idx]!;
        const next: BrandItem = {
          ...row,
          ...patch,
          updated_at: new Date().toISOString(),
        };
        this._rows[idx] = next;
        return next;
      },
    },
    staffs: {
      _staffs: [] as StaffListItem[],
      _details: {} as Record<string, StaffDetail>,
      _seeded: false,

      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;

        db.positions._seed();
        db.stores._seed();
        db.brands._seed();
        const seededStores = db.stores._rows;

        const lastNames = [
          { kanji: '田中', kana: 'タナカ' },
          { kanji: '佐藤', kana: 'サトウ' },
          { kanji: '鈴木', kana: 'スズキ' },
          { kanji: '高橋', kana: 'タカハシ' },
          { kanji: '渡辺', kana: 'ワタナベ' },
          { kanji: '伊藤', kana: 'イトウ' },
          { kanji: '山本', kana: 'ヤマモト' },
          { kanji: '中村', kana: 'ナカムラ' },
          { kanji: '小林', kana: 'コバヤシ' },
          { kanji: '林', kana: 'ハヤシ' },
          { kanji: '山田', kana: 'ヤマダ' },
          { kanji: '松本', kana: 'マツモト' },
          { kanji: '井上', kana: 'イノウエ' },
          { kanji: '木村', kana: 'キムラ' },
          { kanji: '清水', kana: 'シミズ' },
        ];

        const firstNames = [
          { kanji: '太郎', kana: 'タロウ', gender: 'male' as const },
          { kanji: '花子', kana: 'ハナコ', gender: 'female' as const },
          { kanji: '一郎', kana: 'イチロウ', gender: 'male' as const },
          { kanji: '美咲', kana: 'ミサキ', gender: 'female' as const },
          { kanji: '健太', kana: 'ケンタ', gender: 'male' as const },
          { kanji: 'さくら', kana: 'サクラ', gender: 'female' as const },
          { kanji: '大輔', kana: 'ダイスケ', gender: 'male' as const },
          { kanji: 'あゆみ', kana: 'アユミ', gender: 'female' as const },
          { kanji: '翔太', kana: 'ショウタ', gender: 'male' as const },
          { kanji: '愛', kana: 'アイ', gender: 'female' as const },
          { kanji: '拓也', kana: 'タクヤ', gender: 'male' as const },
          { kanji: '由美', kana: 'ユミ', gender: 'female' as const },
        ];

        const domains = ['joyfit.co.jp', 'fit365.co.jp', 'joyfit24.co.jp'];
        const roles = ['headquarter', 'manager', 'staff', 'trainer', 'observer', 'system'] as const;
        const brands = [
          'all',
          'joyfit',
          'fit365',
          'joyfit24',
          'joyfit_yoga',
          'joyfit_plus',
        ] as const;
        const prefectures = [
          '東京都',
          '大阪府',
          '愛知県',
          '北海道',
          '福岡県',
          '神奈川県',
          '埼玉県',
          '千葉県',
          '兵庫県',
          '京都府',
        ];
        const cities = [
          '新宿区新宿',
          '渋谷区渋谷',
          '中央区日本橋',
          '港区六本木',
          '千代田区丸の内',
          '豊島区池袋',
          '台東区上野',
          '墨田区錦糸',
          '品川区大崎',
          '目黒区自由が丘',
        ];
        for (let i = 1; i <= 200; i++) {
          const ln = lastNames[i % lastNames.length]!;
          const fn = firstNames[i % firstNames.length]!;
          const fullName = `${ln.kanji} ${fn.kanji}`;
          const role = roles[i % roles.length]!;
          // headquarter always gets 'all' brand
          const brand = role === 'headquarter' ? 'all' : brands[(i + 1) % brands.length]!;
          const status = i % 7 === 0 ? 'inactive' : 'active';
          const domain = domains[i % domains.length]!;
          const emailName = ln.kanji.toLowerCase().replace(/[^a-z]/g, '');
          const email = `${emailName}${i}@${domain}`;

          // Generate last_login dates
          const now = new Date('2026-03-25T18:00:00');
          const daysAgo = status === 'inactive' ? 30 + (i % 60) : i % 10;
          const loginDate = new Date(now);
          loginDate.setDate(loginDate.getDate() - daysAgo);
          loginDate.setHours(8 + (i % 10), (i * 7) % 60, 0, 0);
          const lastLogin = `${loginDate.getFullYear()}-${String(loginDate.getMonth() + 1).padStart(2, '0')}-${String(loginDate.getDate()).padStart(2, '0')} ${String(loginDate.getHours()).padStart(2, '0')}:${String(loginDate.getMinutes()).padStart(2, '0')}`;

          // Birthday: varied years
          const birthYear = 1970 + (i % 35);
          const birthMonth = ((i * 3) % 12) + 1;
          const birthDay = ((i * 7) % 28) + 1;
          const birthday = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

          // Created/updated timestamps
          const createdDate = new Date('2024-01-01T00:00:00Z');
          createdDate.setDate(createdDate.getDate() + (i % 365));
          const updatedDate = new Date(createdDate);
          updatedDate.setDate(updatedDate.getDate() + 30 + (i % 200));

          // Postal code
          const postalCode = `${String(100 + (i % 900)).padStart(3, '0')}-${String(1000 + (i % 9000)).padStart(4, '0')}`;

          const pickStore = seededStores[(i - 1) % seededStores.length]!;
          const useFcLinkage = i % 5 === 0;
          const position_id = useFcLinkage
            ? 10
            : role === 'headquarter'
              ? 1
              : role === 'observer'
                ? 13
                : 5 + (i % 6);
          const position_name = positionNameById(position_id);

          const staff_linkage = useFcLinkage
            ? ({
                type: 'fc_company',
                fc_company_id: 'fc-001',
                fc_company_name: 'サンプルFC株式会社',
              } satisfies StaffDetail['staff_linkage'])
            : ({
                type: 'direct_store',
                store_id: pickStore.id,
                store_name: pickStore.name,
              } satisfies StaffDetail['staff_linkage']);

          const permCodes = useFcLinkage
            ? ['Y-03.view', 'crm.stores.read', 'crm.members.view', 'G-01.contracts.view']
            : ['crm.members.view', 'crm.members.edit', 'G-01.contracts.view', 'crm.billing.view'];
          pushStaffPermissions(String(i), permCodes);
          const staff_permissions = permissionRows.filter((r) => r.staff_id === String(i));

          // List item
          this._staffs.push({
            id: String(i),
            staff_id: `STF-${String(i).padStart(3, '0')}`,
            name: fullName,
            email,
            position_id,
            position_name,
            role,
            brand,
            brand_display_name: staffBrandDisplayName(brand),
            linkage_type: staff_linkage.type,
            linked_store_id:
              staff_linkage.type === 'direct_store' ? staff_linkage.store_id : undefined,
            linked_fc_company_id:
              staff_linkage.type === 'fc_company' ? staff_linkage.fc_company_id : undefined,
            status,
            last_login: lastLogin,
          } satisfies StaffListItem);

          // Detail
          const scopeCount = role === 'headquarter' ? 1 : 1 + (i % 3);
          const scopes: StaffDetail['editable_scopes'] = [];
          for (let s = 0; s < scopeCount; s++) {
            const scopeBrand =
              role === 'headquarter' ? 'all' : brands[(i + s + 1) % brands.length]!;
            const scopeTarget =
              role === 'headquarter' ? 'all_stores' : s === 0 ? 'all_stores' : 'specific_store';
            const startDate = new Date('2024-04-01');
            startDate.setMonth(startDate.getMonth() + s);
            const storeIdx = (i + s) % seededStores.length;
            const scopeStore = seededStores[storeIdx]!;
            scopes.push({
              brand: scopeBrand as StaffDetail['editable_scopes'][number]['brand'],
              target: scopeTarget as StaffDetail['editable_scopes'][number]['target'],
              store_id: scopeTarget === 'specific_store' ? scopeStore.id : undefined,
              store_name: scopeTarget === 'specific_store' ? scopeStore.name : undefined,
              start_date: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
              end_date: i % 5 === 0 ? `2025-03-31` : undefined,
            });
          }

          this._details[String(i)] = {
            id: String(i),
            staff_id: `STF-${String(i).padStart(3, '0')}`,
            position_id,
            role,
            brand,
            brand_display_name: staffBrandDisplayName(brand),
            status,
            personal_info: {
              last_name: ln.kanji,
              first_name: fn.kanji,
              last_name_kana: ln.kana,
              first_name_kana: fn.kana,
              gender: fn.gender,
              birthday,
              phone: `090-${String(1000 + (i % 9000)).padStart(4, '0')}-${String(1000 + ((i * 3) % 9000)).padStart(4, '0')}`,
              email,
              postal_code: postalCode,
              prefecture: prefectures[i % prefectures.length]!,
              city: cities[i % cities.length]!,
              address: `${(i % 10) + 1}-${(i % 20) + 1}-${(i % 30) + 1}`,
              building: i % 3 === 0 ? `ビル${i}号 ${(i % 10) + 1}F` : undefined,
            },
            login_settings: {
              login_method: i % 5 === 0 ? 'social' : 'email',
              social_id: i % 5 === 0 ? `social_${i}` : undefined,
            },
            permission_settings: {
              role,
              additional_permissions: {
                billing_correction: role === 'headquarter' || i % 3 === 0,
                refund_request: role === 'headquarter' || i % 4 === 0,
                transfer_request: role === 'headquarter' && i % 2 === 0,
              },
            },
            staff_linkage,
            staff_permissions,
            editable_scopes: scopes,
            last_login: lastLogin,
            created_at: createdDate.toISOString(),
            updated_at: updatedDate.toISOString(),
          } satisfies StaffDetail;
        }

        db.stores.setManagerStaff('store-001', '1');
        db.stores.setManagerStaff('store-005', '5');
      },

      getList(): StaffListItem[] {
        this._seed();
        return [...this._staffs];
      },

      getById(id: string): StaffListItem | undefined {
        this._seed();
        return this._staffs.find((s) => s.id === id);
      },

      getDetailById(id: string): StaffDetail | undefined {
        this._seed();
        return this._details[id];
      },

      updateDetail(id: string, patch: Partial<StaffDetail>): StaffDetail | undefined {
        this._seed();
        const existing = this._details[id];
        if (!existing) return undefined;

        if (patch.staff_permissions) {
          db.staff_permissions.replaceForStaff(
            id,
            patch.staff_permissions.map((p) => ({ permission_code: p.permission_code })),
          );
        }

        const mergedLinkage = patch.staff_linkage
          ? { ...existing.staff_linkage, ...patch.staff_linkage }
          : existing.staff_linkage;
        const position_id = patch.position_id ?? existing.position_id;
        const role = patch.role ?? existing.role;
        const nextBrand = (patch.brand ?? existing.brand ?? 'all') as StaffDetail['brand'];
        const staff_permissions = patch.staff_permissions
          ? permissionRows.filter((r) => r.staff_id === id)
          : existing.staff_permissions;

        const updated: StaffDetail = {
          ...existing,
          ...patch,
          role,
          position_id,
          brand: nextBrand,
          brand_display_name: staffBrandDisplayName(nextBrand),
          personal_info: patch.personal_info
            ? { ...existing.personal_info, ...patch.personal_info }
            : existing.personal_info,
          login_settings: patch.login_settings
            ? { ...existing.login_settings, ...patch.login_settings }
            : existing.login_settings,
          permission_settings: patch.permission_settings
            ? {
                ...existing.permission_settings,
                ...patch.permission_settings,
                additional_permissions: patch.permission_settings.additional_permissions
                  ? {
                      ...existing.permission_settings.additional_permissions,
                      ...patch.permission_settings.additional_permissions,
                    }
                  : existing.permission_settings.additional_permissions,
              }
            : existing.permission_settings,
          staff_linkage: mergedLinkage,
          staff_permissions,
          editable_scopes: patch.editable_scopes ?? existing.editable_scopes,
          updated_at: new Date().toISOString(),
        };
        this._details[id] = updated;

        // Sync list item
        const listIdx = this._staffs.findIndex((s) => s.id === id);
        if (listIdx !== -1) {
          this._staffs[listIdx] = {
            ...this._staffs[listIdx],
            name: `${updated.personal_info.last_name} ${updated.personal_info.first_name}`,
            email: updated.personal_info.email,
            position_id: updated.position_id,
            position_name: positionNameById(updated.position_id),
            role: updated.permission_settings.role,
            brand: updated.brand,
            brand_display_name: updated.brand_display_name,
            linkage_type: updated.staff_linkage.type,
            linked_store_id:
              updated.staff_linkage.type === 'direct_store'
                ? updated.staff_linkage.store_id
                : undefined,
            linked_fc_company_id:
              updated.staff_linkage.type === 'fc_company'
                ? updated.staff_linkage.fc_company_id
                : undefined,
            status: updated.status,
          };
        }
        return updated;
      },

      create(input: { email: string; role: StaffListItem['role']; brand?: string }): StaffListItem {
        this._seed();
        db.positions._seed();
        db.stores._seed();

        const nextId = this._staffs.length + 1;
        const role = input.role;
        const position_id = defaultPositionIdByRole(role);
        const defaultStore = db.stores._rows[0]!;
        const staff_linkage: StaffDetail['staff_linkage'] = {
          type: 'direct_store',
          store_id: defaultStore.store_id,
          store_name: defaultStore.name,
        };

        pushStaffPermissions(String(nextId), ['crm.login', 'crm.members.view']);
        const staff_permissions = permissionRows.filter((r) => r.staff_id === String(nextId));

        const assignedBrand = (input.brand ?? 'all') as StaffListItem['brand'];
        const staff: StaffListItem = {
          id: String(nextId),
          staff_id: `STF-${String(nextId).padStart(3, '0')}`,
          name: input.email.split('@')[0] ?? '新規スタッフ',
          email: input.email,
          position_id,
          position_name: positionNameById(position_id),
          role,
          brand: assignedBrand,
          brand_display_name: staffBrandDisplayName(assignedBrand),
          linkage_type: staff_linkage.type,
          linked_store_id: staff_linkage.store_id,
          status: 'active',
          last_login: '-',
        };
        this._staffs.push(staff);

        // Also create a detail entry
        this._details[String(nextId)] = {
          id: String(nextId),
          staff_id: staff.staff_id,
          position_id,
          role,
          brand: assignedBrand,
          brand_display_name: staffBrandDisplayName(assignedBrand),
          status: 'active',
          personal_info: {
            last_name: input.email.split('@')[0] ?? '新規',
            first_name: 'スタッフ',
            email: input.email,
          },
          login_settings: {
            login_method: 'email',
          },
          permission_settings: {
            role,
            additional_permissions: {
              billing_correction: false,
              refund_request: false,
              transfer_request: false,
            },
          },
          staff_linkage,
          staff_permissions,
          editable_scopes: [
            {
              brand: (input.brand ?? 'all') as StaffDetail['editable_scopes'][number]['brand'],
              target: 'all_stores',
              start_date: new Date().toISOString().split('T')[0]!,
            },
          ],
          last_login: '-',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } satisfies StaffDetail;

        return staff;
      },

      delete(id: string): boolean {
        this._seed();
        const idx = this._staffs.findIndex((s) => s.id === id);
        if (idx === -1) return false;
        this._staffs.splice(idx, 1);
        delete this._details[id];
        db.staff_permissions.removeForStaff(id);
        return true;
      },
    },
    transfers: {
      _rows: [...TRANSFER_SEED_DATA] as TransferRow[],
      getAll(): TransferRow[] {
        return this._rows;
      },
      getById(id: string): TransferRow | undefined {
        return this._rows.find((r) => r.id === id);
      },
      approve(id: string, _comment?: string): TransferRow | undefined {
        const idx = this._rows.findIndex((r) => r.id === id);
        if (idx === -1) return undefined;
        const row = this._rows[idx]!;
        if (row.status === TransferStatus.Completed || row.status === TransferStatus.Rejected) {
          return undefined;
        }
        const now = new Date().toISOString();
        let nextStatus: TransferRow['status'];
        let approvedStep: number;
        if (row.status === TransferStatus.Pending) {
          nextStatus = TransferStatus.FromStoreApproved;
          approvedStep = 2; // 移籍元承認
        } else if (row.status === TransferStatus.FromStoreApproved && row.brand === 'fit365') {
          nextStatus = TransferStatus.Approved;
          approvedStep = 3; // 移籍先承認
        } else {
          return undefined;
        }
        const updatedHistory = row.approval_history.map((h) =>
          h.step === approvedStep
            ? { ...h, completed: true, completed_at: now, completed_by: 'ログインユーザー' }
            : h,
        );
        const updated: TransferRow = {
          ...row,
          status: nextStatus,
          updated_at: now,
          approval_history: updatedHistory,
        };
        this._rows[idx] = updated;
        return updated;
      },
      reject(id: string, _comment?: string): TransferRow | undefined {
        const idx = this._rows.findIndex((r) => r.id === id);
        if (idx === -1) return undefined;
        const row = this._rows[idx]!;
        if (row.status === TransferStatus.Completed || row.status === TransferStatus.Rejected) {
          return undefined;
        }
        const now = new Date().toISOString();
        const updated: TransferRow = { ...row, status: TransferStatus.Rejected, updated_at: now };
        this._rows[idx] = updated;
        return updated;
      },
    },
  };

  // Seed mock data immediately when the singleton is first created
  db.mainContracts._seed();
  db.members._seed();
  db.contracts._seed();
  db.membershipApplications._seed();
  db.family._seed();
  db.staffs._seed();

  return db;
}

// Use globalThis to guarantee a true singleton across all Next.js route handler bundles.
// Without this, each route handler gets its own module instance and mutations are invisible
// across routes.
// Bump this key whenever the seed logic changes to force a fresh re-seed.
export const db: DbType = (globalThis.__fitnessDb_v9 ??= createDb() as unknown as DbType);
