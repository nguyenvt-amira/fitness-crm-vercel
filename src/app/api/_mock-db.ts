/**
 * Shared in-memory mock database for all CRM API routes.
 * All APIs should read/update data through this module so list and detail stay in sync.
 */
import { type BlacklistDetail } from '@/app/api/_schemas/blacklist.schema';
import type { BrandItem } from '@/app/api/_schemas/brand.schema';
import type {
  EkycResult,
  FamilyRegistrationStatus,
  FamilyRelationship,
} from '@/app/api/_schemas/family-registration.schema';
import type { LeaveDetail, LeaveListItem } from '@/app/api/_schemas/leave.schema';
import type {
  MainContractChangeHistoryItem,
  MainContractDetail,
  MainContractListItem,
} from '@/app/api/_schemas/main-contract.schema';
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
import type { DirectEnrollmentRequest as DirectEnrollmentRequestType } from '@/app/api/_schemas/membership-application.schema';
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
} from '@/types/api/membership-application.type';

export type TransferRow = TransferDetail;
export type BlacklistRow = BlacklistDetail;

export enum TransferStatus {
  Pending = 'pending', // 申請中
  FromStoreApproved = 'from_store_approved', // 店舗承認済
  Approved = 'approved', // 承認済
  Rejected = 'rejected', // 却下
  Completed = 'completed', // 移籍完了
}
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
  // New detail fields
  applicant_kana: string;
  birth_date: string;
  age: number;
  gender_label: string;
  phone: string;
  phone_real: string;
  email_masked: string;
  email_real: string;
  address: string;
  address_real: string;
  blacklist_conditions: string[];
  usage_start_date: string;
  monthly_fee: number;
  options: string[];
  fee_rows: { label: string; amount: number }[];
  payment_method: string;
  card_last4: string;
  application_source: string;
  updated_at: string;
  parental_consent: boolean;
  proxy_applicant: string;
  agreement_date: string;
  approved_by: string;
  approved_at: string;
  rejected_by: string;
  rejected_at: string;
  rejected_reason: string;
  timeline: {
    id: string;
    kind: 'system' | 'memo';
    date: string;
    operator: string;
    content: string;
  }[];
  // Contact (legacy)
  applicant_email: string;
  applicant_phone: string;
  applicant_address: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  // Contract (legacy)
  contract_details: MembershipApplicationContractDetails;
  // eKYC (legacy)
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
    gate_stop_info?: MemberProfile['gate_stop_info'];
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
      gate_stop_info: listMeta.gate_stop_info,
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

// ─── T-004: Enrollment Fee Master + Corporate Master types ────────────────────

interface EnrollmentFeeMasterRow {
  id: string;
  name: string;
  amount: number;
  brand: string;
  application_type: string;
  isActive: boolean;
}

// ─── User (auth) row ─────────────────────────────────────────────────────────

export interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  position: string;
  staff_id?: string; // link to staff if applicable
  role: 'System' | 'Headquarter' | 'Manager' | 'Staff' | 'Trainer' | 'Observer';
}

const SEED_USERS: UserRow[] = [
  {
    id: 'U-000',
    email: 'system@example.com',
    password: 'password123',
    name: 'System',
    position: 'システム管理者',
    role: 'System',
  },
  {
    id: 'U-001',
    email: 'admin@example.com',
    password: 'password123',
    name: 'Headquarter',
    position: '本部管理者',
    role: 'Headquarter',
  },
  {
    id: 'U-003',
    email: 'manager@example.com',
    password: 'password123',
    name: 'Manager',
    position: 'ブロック長',
    role: 'Manager',
  },
  {
    id: 'U-006',
    email: 'area-manager@example.com',
    password: 'password123',
    name: 'Area Manager',
    position: 'テリトリーマネージャー',
    role: 'Manager',
  },
  {
    id: 'U-007',
    email: 'store-manager@example.com',
    password: 'password123',
    name: 'Store Manager',
    position: '店舗責任者',
    staff_id: 'STF-005',
    role: 'Staff',
  },
  {
    id: 'U-002',
    email: 'staff@example.com',
    password: 'password123',
    name: 'Fulltime Staff',
    position: '正社員スタッフ',
    staff_id: 'STF-001',
    role: 'Staff',
  },
  {
    id: 'U-008',
    email: 'fc-staff@example.com',
    password: 'password123',
    name: 'FC Staff',
    position: 'FC企業管理者',
    staff_id: 'STF-010',
    role: 'Staff',
  },
  {
    id: 'U-004',
    email: 'trainer@example.com',
    password: 'password123',
    name: 'Trainer',
    position: '社員トレーナー',
    role: 'Trainer',
  },
  {
    id: 'U-005',
    email: 'observer@example.com',
    password: 'password123',
    name: 'Observer',
    position: '閲覧専任',
    role: 'Observer',
  },
];

interface CorporateMasterRow {
  id: string;
  name: string;
  code: string;
}

const SEED_ENROLLMENT_FEE_MASTERS: EnrollmentFeeMasterRow[] = [
  {
    id: 'EF001',
    name: '標準入会金',
    amount: 2200,
    brand: 'JOYFIT',
    application_type: 'normal',
    isActive: true,
  },
  {
    id: 'EF002',
    name: 'ファミリー入会金',
    amount: 1100,
    brand: 'JOYFIT',
    application_type: 'normal',
    isActive: true,
  },
  {
    id: 'EF003',
    name: '法人入会金',
    amount: 5500,
    brand: '共通',
    application_type: 'corporate',
    isActive: true,
  },
  {
    id: 'EF004',
    name: '社員割引入会金',
    amount: 0,
    brand: '共通',
    application_type: 'employee_discount',
    isActive: true,
  },
  {
    id: 'EF005',
    name: '特別契約入会金',
    amount: 0,
    brand: '共通',
    application_type: 'special_contract',
    isActive: true,
  },
];

const SEED_CORPORATE_MASTERS: CorporateMasterRow[] = [
  { id: 'CORP-001', name: '株式会社サンプルA', code: 'CA001' },
  { id: 'CORP-002', name: '株式会社サンプルB', code: 'CB002' },
  { id: 'CORP-003', name: '株式会社サンプルC', code: 'CC003' },
];

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
    anonymizePersonalData(id: string): Member | undefined;
    handleWithdrawal(input: {
      id: string;
      scheduled_date: string;
      reason: string;
    }): Member | undefined;
    handleForceWithdrawal(input: {
      id: string;
      reason: string;
    }): { member: Member; blacklistId: string } | undefined;
    handleTransfer(input: {
      id: string;
      to_store_id: string;
      to_store_name: string;
      reason?: string;
    }): { member: Member; transfer_id: string } | undefined;
    handleSuspension(input: {
      id: string;
      start_month: string;
      end_month: string;
      reason?: string;
      is_proxy?: boolean;
      proxy_agreed_at?: string;
      proxy_method?: string;
    }): Member | undefined;
    handleSuspendRelease(input: { id: string; resume_month: string }): Member | undefined;
    setGateStop(input: {
      id: string;
      scope: string;
      reason: string;
      terminal_message?: string;
      lock_after_message: boolean;
      set_by?: string;
    }): Member | undefined;
    releaseGateStop(id: string): Member | undefined;
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
    addMemo(
      id: string,
      content: string,
      operator: string,
    ): MembershipApplicationDetails['timeline'] | undefined;
    deleteMemo(id: string, memoId: string): boolean;
    createDirect(data: DirectEnrollmentRequestType, blMatched: boolean): MembershipApplication;
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
    _details: Record<string, MainContractDetail>;
    _changeHistory: Record<string, MainContractChangeHistoryItem[]>;
    _seeded: boolean;
    _seed(): void;
    getList(): MainContractListItem[];
    getById(id: string): MainContractDetail | undefined;
    getChangeHistory(id: string): MainContractChangeHistoryItem[];
    delete(id: string): boolean;
    add(contract: MainContractDetail): void;
    update(id: string, data: Partial<MainContractDetail>): MainContractDetail | undefined;
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
    create(input: {
      member_id: string;
      member_name: string;
      from_store_id: string;
      from_store_name: string;
      to_store_id: string;
      to_store_name: string;
      brand: string;
      reason?: string;
    }): TransferRow;
    approve(id: string, comment?: string): TransferRow | undefined;
    reject(id: string, comment?: string): TransferRow | undefined;
  };
  memberLeaves: {
    _rows: LeaveListItem[];
    _details: Record<string, LeaveDetail>;
    _seeded: boolean;
    _seed(): void;
    list(): LeaveListItem[];
    getById(id: string): LeaveDetail | undefined;
    getActiveSuspensionByMemberId(memberId: string): LeaveDetail | undefined;
    approve(id: string, comment?: string): LeaveDetail | undefined;
    reject(id: string, reason: string): LeaveDetail | undefined;
    cancelWithdrawal(id: string, comment?: string): LeaveDetail | undefined;
    executeWithdrawal(id: string, comment?: string): LeaveDetail | undefined;
    create(input: { member_id: string; scheduled_date: string; reason: string }): LeaveDetail;
    createSuspension(input: {
      member_id: string;
      start_month: string;
      end_month: string;
      reason?: string;
      is_proxy?: boolean;
      proxy_agreed_at?: string;
      proxy_method?: string;
    }): LeaveDetail;
  };
  memberBlacklist: {
    _rows: BlacklistRow[];
    _seeded: boolean;
    _seed(): void;
    getList(): BlacklistRow[];
    getById(id: string): BlacklistRow | undefined;
    create(input: Omit<BlacklistRow, 'id' | 'registeredAt'>): BlacklistRow;
  };
  enrollmentFeeMasters: {
    _rows: EnrollmentFeeMasterRow[];
    _seeded: boolean;
    _seed(): void;
    getAll(): EnrollmentFeeMasterRow[];
    getFiltered(brand?: string, applicationType?: string): EnrollmentFeeMasterRow[];
  };
  corporateMasters: {
    _rows: CorporateMasterRow[];
    _seeded: boolean;
    _seed(): void;
    getAll(): CorporateMasterRow[];
  };
  partnerCompanies: {
    _rows: CorporateMasterRow[];
    _seeded: boolean;
    _seed(): void;
    getAll(): CorporateMasterRow[];
  };
  users: {
    _rows: UserRow[];
    _seeded: boolean;
    _seed(): void;
    getByEmail(email: string): UserRow | undefined;
    getById(id: string): UserRow | undefined;
    getList(): UserRow[];
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
          const member = {
            name_kanji: name.kanji,
            name_kana: name.kana,
            phone,
            email,
            birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
            gender: i % 2 === 0 ? 'male' : ('female' as MemberRow['basic_info']['gender']),
            member_type: memberType,
            status: (
              [
                'active',
                'suspended',
                'withdrawn',
                'gate_stop',
                'pending_withdrawal',
                'force_withdrawn',
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
            gate_stop_info: null as MemberProfile['gate_stop_info'],
          };
          if (member.status === 'gate_stop') {
            member.gate_stop_info = {
              scope: 'own_store_only',
              reason: 'unpaid',
              terminal_message: '未納金のため、入館を制限します。',
              lock_after_message: true,
              set_at: new Date().toISOString(),
              set_by: 'スタッフ',
            };
          }
          this._members.push(createMember(id, member));
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
      anonymizePersonalData(id: string): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === id);
        if (idx === -1) return undefined;
        const current = this._members[idx];
        const updated: MemberRow = {
          ...current,
          basic_info: {
            ...current.basic_info,
            name_kanji: '削除済み 会員',
            name_kana: 'サクジョズミ カイイン',
            email: 'deleted@example.com',
            phone: '000-0000-0000',
            postal_code: '000-0000',
            prefecture: '',
            city: '',
            address: '',
            building: '',
          },
        };
        this._members[idx] = updated;
        return updated;
      },
      handleSuspendRelease(input: { id: string; resume_month: string }): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === input.id);
        if (idx === -1) return undefined;
        // Mark the active suspension leave record as completed
        const suspensionLeave = db.memberLeaves
          .list()
          .find(
            (l) =>
              l.member_id === input.id &&
              l.type === 'suspension' &&
              (l.status === 'suspended' || l.status === 'suspension_scheduled'),
          );
        if (suspensionLeave) {
          db.memberLeaves._updateDetail(suspensionLeave.id, { status: 'completed' });
          // Manually sync list row without triggering member status change
          const listIdx = db.memberLeaves._rows.findIndex((r) => r.id === suspensionLeave.id);
          if (listIdx !== -1) {
            db.memberLeaves._rows[listIdx] = {
              ...db.memberLeaves._rows[listIdx]!,
              status: 'completed',
            };
          }
        }
        const updated: MemberRow = {
          ...this._members[idx]!,
          profile: {
            ...this._members[idx]!.profile,
            status: MemberStatus.ACTIVE,
          },
        };
        this._members[idx] = updated;
        return updated;
      },

      handleWithdrawal(input: {
        id: string;
        scheduled_date: string;
        reason: string;
      }): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === input.id);
        if (idx === -1) return undefined;
        // Create a new leave record if member status is active or gate_stop
        if (
          this._members[idx].profile.status == MemberStatus.ACTIVE ||
          this._members[idx].profile.status == MemberStatus.GATE_STOP
        ) {
          db.memberLeaves.create({
            member_id: input.id,
            scheduled_date: input.scheduled_date,
            reason: input.reason,
          });
        }
        // Update member status to pending_withdrawal
        const updated: MemberRow = {
          ...this._members[idx]!,
          profile: {
            ...this._members[idx]!.profile,
            status: MemberStatus.PENDING_WITHDRAWAL,
          },
        };
        this._members[idx] = updated;
        return updated;
      },

      handleForceWithdrawal(input: {
        id: string;
        reason: string;
      }): { member: Member; blacklistId: string } | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === input.id);
        if (idx === -1) return undefined;
        const member = this._members[idx]!;

        // Create a leave record
        db.memberLeaves.create({
          member_id: input.id,
          scheduled_date: new Date().toISOString().slice(0, 10),
          reason: input.reason,
        });

        // Update member status to force_withdrawn
        const updated: MemberRow = {
          ...member,
          profile: {
            ...member.profile,
            status: MemberStatus.FORCE_WITHDRAWN,
            is_black_listed: true,
          },
        };
        this._members[idx] = updated;

        // Register to blacklist
        const blRow = db.memberBlacklist.create({
          memberId: member.basic_info.member_number,
          memberName: member.basic_info.name_kanji,
          storeName: member.profile.store_name,
          registrationSource: 'forced_withdrawal',
          manualReason: null,
          unpaidAmount: 0,
          memo: input.reason,
          registeredBy: 'System',
          matchConditions: {
            nameAndBirthdate: true,
            email: false,
            phone: false,
            address: false,
          },
        });

        return { member: updated, blacklistId: blRow.id };
      },

      handleTransfer(input: {
        id: string;
        to_store_id: string;
        to_store_name: string;
        reason?: string;
      }): { member: Member; transfer_id: string } | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === input.id);
        if (idx === -1) return undefined;
        const member = this._members[idx]!;
        const transfer = db.transfers.create({
          member_id: input.id,
          member_name: member.basic_info.name_kanji,
          from_store_id: member.profile.store_id,
          from_store_name: member.profile.store_name,
          to_store_id: input.to_store_id,
          to_store_name: input.to_store_name,
          brand: member.profile.brand,
          reason: input.reason,
        });
        return { member, transfer_id: transfer.id };
      },

      setGateStop(input: {
        id: string;
        scope: string;
        reason: string;
        terminal_message?: string;
        lock_after_message: boolean;
        set_by?: string;
      }): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === input.id);
        if (idx === -1) return undefined;
        const updated: MemberRow = {
          ...this._members[idx]!,
          profile: {
            ...this._members[idx]!.profile,
            status: MemberStatus.GATE_STOP,
            gate_stop_info: {
              scope: input.scope as 'all_stores' | 'own_store_only',
              reason: input.reason as 'nuisance' | 'unpaid' | 'fraudulent_use' | 'other',
              terminal_message: input.terminal_message,
              lock_after_message: input.lock_after_message,
              set_at: new Date().toISOString(),
              set_by: input.set_by ?? 'スタッフ',
            },
          },
        };
        this._members[idx] = updated;
        return updated;
      },

      releaseGateStop(id: string): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === id);
        if (idx === -1) return undefined;
        const updated: MemberRow = {
          ...this._members[idx]!,
          profile: {
            ...this._members[idx]!.profile,
            status: MemberStatus.ACTIVE,
            gate_stop_info: null,
          },
        };
        this._members[idx] = updated;
        return updated;
      },

      handleSuspension(input: {
        id: string;
        start_month: string;
        end_month: string;
        reason?: string;
        is_proxy?: boolean;
        proxy_agreed_at?: string;
        proxy_method?: string;
      }): Member | undefined {
        this._seed();
        const idx = this._members.findIndex((m) => m.basic_info.id === input.id);
        if (idx === -1) return undefined;
        // Create a suspension leave record
        db.memberLeaves.createSuspension({
          member_id: input.id,
          start_month: input.start_month,
          end_month: input.end_month,
          reason: input.reason,
          is_proxy: input.is_proxy,
          proxy_agreed_at: input.proxy_agreed_at,
          proxy_method: input.proxy_method,
        });
        // Update member status to suspended
        const updated: MemberRow = {
          ...this._members[idx]!,
          profile: {
            ...this._members[idx]!.profile,
            status: MemberStatus.SUSPENDED,
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
          start_date: application.start_date,
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

        const seed: MembershipApplication[] = [
          {
            id: 'APP-2026-0001',
            applicant_name: '山田 太郎',
            store_name: 'FIT365八潮店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-30T09:15:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: '春の入会キャンペーン',
          },
          {
            id: 'APP-2026-0002',
            applicant_name: '佐藤 花子',
            store_name: 'FIT365草加店',
            plan_name: 'デイタイム会員',
            application_date: '2026-03-30T10:32:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-02',
            brand_name: 'FIT365',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0003',
            applicant_name: '鈴木 一郎',
            store_name: 'FIT365越谷店',
            plan_name: 'ナイト会員',
            application_date: '2026-03-30T11:08:00+09:00',
            status: 'pending',
            blacklist_match: true,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0004',
            applicant_name: '田中 美咲',
            store_name: 'FIT365八潮店',
            plan_name: 'ウィークエンド会員',
            application_date: '2026-03-30T11:45:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-05',
            brand_name: 'FIT365',
            campaign: '春の入会キャンペーン',
          },
          {
            id: 'APP-2026-0005',
            applicant_name: '伊藤 健二',
            store_name: 'FIT365草加店',
            plan_name: 'レギュラー会員（学生）',
            application_date: '2026-03-30T13:20:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: '学生割引キャンペーン',
          },
          {
            id: 'APP-2026-0006',
            applicant_name: '松本 奈々',
            store_name: 'ジョイフィット24越谷店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-30T14:05:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'JOYFIT',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0007',
            applicant_name: '高橋 正男',
            store_name: 'ジョイフィット24草加店',
            plan_name: 'デイタイム会員',
            application_date: '2026-03-30T14:50:00+09:00',
            status: 'pending',
            blacklist_match: true,
            start_date: '2026-04-14',
            brand_name: 'JOYFIT',
            campaign: '春の入会キャンペーン',
          },
          {
            id: 'APP-2026-0008',
            applicant_name: '渡辺 由美子',
            store_name: 'FIT365八潮店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-30T08:05:00+09:00',
            status: 'approved',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0009',
            applicant_name: '中村 拓也',
            store_name: 'FIT365越谷店',
            plan_name: 'デイタイム会員',
            application_date: '2026-03-30T07:42:00+09:00',
            status: 'approved',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0010',
            applicant_name: '小林 優子',
            store_name: 'ジョイフィット24越谷店',
            plan_name: 'ナイト会員',
            application_date: '2026-03-30T09:55:00+09:00',
            status: 'approved',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'JOYFIT',
            campaign: '法人会員キャンペーン',
          },
          {
            id: 'APP-2026-0011',
            applicant_name: '加藤 次郎',
            store_name: 'FIT365八潮店',
            plan_name: 'レギュラー会員（シニア）',
            application_date: '2026-03-29T14:20:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'シニア割引キャンペーン',
          },
          {
            id: 'APP-2026-0012',
            applicant_name: '吉田 恵子',
            store_name: 'FIT365越谷店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-29T09:55:00+09:00',
            status: 'rejected',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0013',
            applicant_name: '山本 直人',
            store_name: 'FIT365草加店',
            plan_name: 'ウィークエンド会員',
            application_date: '2026-03-28T11:22:00+09:00',
            status: 'cancelled',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0014',
            applicant_name: '木村 幸子',
            store_name: 'ジョイフィット24草加店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-28T08:50:00+09:00',
            status: 'approved',
            blacklist_match: false,
            start_date: '2026-04-07',
            brand_name: 'JOYFIT',
            campaign: 'なし',
          },
          {
            id: 'APP-2026-0015',
            applicant_name: '石川 雄介',
            store_name: 'FIT365八潮店',
            plan_name: 'デイタイム会員',
            application_date: '2026-03-27T16:30:00+09:00',
            status: 'rejected',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: '春の入会キャンペーン',
          },
          {
            id: 'APP-2026-0016',
            applicant_name: '前田 由香',
            store_name: 'FIT365八潮店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-30T15:40:00+09:00',
            status: 'review',
            blacklist_match: true,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: '学生割引キャンペーン',
          },
          {
            id: 'APP-2026-0017',
            applicant_name: '若林 みなみ',
            store_name: 'ジョイフィット24越谷店',
            plan_name: 'レギュラー会員（学生）',
            application_date: '2026-03-30T10:00:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'JOYFIT',
            campaign: '学生割引キャンペーン',
            is_minor: true,
          },
          {
            id: 'APP-2026-0018',
            applicant_name: '青木 太一',
            store_name: 'FIT365草加店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-30T09:00:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'FIT365',
            campaign: 'なし',
            is_proxy: true,
          },
          {
            id: 'APP-2026-0019',
            applicant_name: '小川 拓海',
            store_name: 'ジョイフィット24越谷店',
            plan_name: 'レギュラー会員',
            application_date: '2026-03-30T12:30:00+09:00',
            status: 'pending',
            blacklist_match: false,
            start_date: '2026-04-01',
            brand_name: 'JOYFIT',
            campaign: 'なし',
          },
        ];

        this._applications.push(...seed);

        // Helper: build masked phone/email/address
        function maskPhone(real: string) {
          return real.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
        }
        function maskEmail(real: string) {
          const [local, domain] = real.split('@');
          return `${local.slice(0, 2)}***@${domain}`;
        }
        function maskAddress(real: string) {
          return real.replace(/(\d+-\d+-\d+)$/, '***');
        }

        // Fee rows by brand
        const FEE_ROWS_JOYFIT = [
          { label: '入会金', amount: 2200 },
          { label: '登録事務手数料', amount: 3300 },
          { label: '初月会費（日割）', amount: 990 },
          { label: '翌月会費', amount: 7700 },
        ];
        const FEE_ROWS_FIT365 = [
          { label: 'カード発行料', amount: 5500 },
          { label: '初月会費（日割）', amount: 990 },
          { label: '翌月会費', amount: 7700 },
        ];

        // Rich detail seed for special variants
        const SPECIAL_DETAILS: Record<string, Record<string, unknown>> = {
          'APP-2026-0003': {
            blacklist_conditions: ['氏名＆生年月日一致', '電話番号一致'],
            timeline: [
              {
                id: 'tl-0003-2',
                kind: 'system',
                date: '2026/03/25 11:00',
                operator: 'システム',
                content: 'ブラックリスト照合で一致を検出しました。',
              },
              {
                id: 'tl-0003-1',
                kind: 'system',
                date: '2026/03/25 10:30',
                operator: 'システム',
                content: '申請受付（アプリ経由）',
              },
            ],
          },
          'APP-2026-0007': {
            blacklist_conditions: ['氏名＆生年月日一致'],
            timeline: [
              {
                id: 'tl-0007-1',
                kind: 'system',
                date: '2026/03/26 14:00',
                operator: 'システム',
                content: '申請受付（アプリ経由）',
              },
            ],
          },
          'APP-2026-0008': {
            approved_by: '管理者A',
            approved_at: '2026/03/26 15:30',
            timeline: [
              {
                id: 'tl-0008-3',
                kind: 'system',
                date: '2026/03/26 15:30',
                operator: '管理者A',
                content: '入会申請を承認しました。会員登録完了通知を送信しました。',
              },
              {
                id: 'tl-0008-2',
                kind: 'memo',
                date: '2026/03/26 15:00',
                operator: '管理者A',
                content: '本人確認書類を目視確認済み。',
              },
              {
                id: 'tl-0008-1',
                kind: 'system',
                date: '2026/03/26 14:00',
                operator: 'システム',
                content: '申請受付（アプリ経由）',
              },
            ],
          },
          'APP-2026-0016': {
            blacklist_conditions: ['氏名＆生年月日一致', '住所一致'],
            timeline: [
              {
                id: 'tl-0016-1',
                kind: 'system',
                date: '2026/03/30 15:40',
                operator: 'システム',
                content: '申請受付（アプリ経由）',
              },
            ],
          },
          'APP-2026-0017': {
            // minor
            applicant_kana: 'ワカバヤシ ミナミ',
            birth_date: '2009/05/15',
            age: 16,
            gender_label: '女性',
            parental_consent: true,
            timeline: [
              {
                id: 'tl-0017-1',
                kind: 'system',
                date: '2026/03/30 10:00',
                operator: 'システム',
                content: '申請受付（アプリ経由）',
              },
            ],
          },
          'APP-2026-0018': {
            // proxy
            application_source: '管理画面',
            proxy_applicant: '管理者A（STAFF-001）',
            agreement_date: '2026/03/30 09:00',
            timeline: [
              {
                id: 'tl-0018-1',
                kind: 'system',
                date: '2026/03/30 09:00',
                operator: '管理者A',
                content: '管理画面から代理申請を登録',
              },
            ],
          },
        };

        // Seed detail for every application
        for (const app of seed) {
          const phoneReal = '090-1234-5678';
          const emailReal = `${app.id.toLowerCase().replaceAll('-', '')}@example.jp`;
          const addressReal = '東京都渋谷区1-2-3';
          const special = SPECIAL_DETAILS[app.id] ?? {};
          const feeRows = app.brand_name === 'FIT365' ? FEE_ROWS_FIT365 : FEE_ROWS_JOYFIT;
          const monthlyFee = app.brand_name === 'FIT365' ? 7700 : 7700;

          this._details[app.id] = {
            // Personal
            applicant_kana: (special.applicant_kana as string) ?? 'ヤマダ タロウ',
            birth_date: (special.birth_date as string) ?? '1990/01/15',
            age: (special.age as number) ?? 36,
            gender_label: (special.gender_label as string) ?? '男性',
            phone: maskPhone(phoneReal),
            phone_real: phoneReal,
            email_masked: maskEmail(emailReal),
            email_real: emailReal,
            address: maskAddress(addressReal),
            address_real: addressReal,
            // Blacklist
            blacklist_conditions: (special.blacklist_conditions as string[]) ?? [],
            // Contract
            usage_start_date: app.start_date.replaceAll('-', '/'),
            monthly_fee: monthlyFee,
            options: ['タオル'],
            fee_rows: feeRows,
            // Payment
            payment_method: 'クレジットカード',
            card_last4: '1234',
            // Application meta
            application_source: (special.application_source as string) ?? 'アプリ',
            updated_at: '2026/03/30 09:20',
            // Minor
            parental_consent: (special.parental_consent as boolean) ?? false,
            // Proxy
            proxy_applicant: special.proxy_applicant as string | undefined,
            agreement_date: special.agreement_date as string | undefined,
            // Status feedback
            approved_by: special.approved_by as string | undefined,
            approved_at: special.approved_at as string | undefined,
            rejected_by: special.rejected_by as string | undefined,
            rejected_at: special.rejected_at as string | undefined,
            rejected_reason: special.rejected_reason as string | undefined,
            // Timeline
            timeline: (special.timeline as MembershipApplicationDetails['timeline']) ?? [
              {
                id: `tl-${app.id}-1`,
                kind: 'system' as const,
                date: '2026/03/30 09:15',
                operator: 'システム',
                content: '申請受付（アプリ経由）',
              },
            ],
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

      addMemo(
        id: string,
        content: string,
        operator: string,
      ): MembershipApplicationDetails['timeline'] | undefined {
        this._seed();
        const exists = this._applications.some((a) => a.id === id);
        if (!exists) return undefined;

        const details = this._details[id] ?? {};
        const timeline = (details.timeline ?? []) as NonNullable<
          MembershipApplicationDetails['timeline']
        >;

        const now = new Date();
        const dateStr = now.toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newMemo = {
          id: `tl-${Date.now()}-memo`,
          kind: 'memo' as const,
          date: dateStr.replace(/\//g, '/'),
          operator,
          content,
        };

        const updatedTimeline = [newMemo, ...timeline];
        this._details[id] = { ...details, timeline: updatedTimeline };

        return updatedTimeline;
      },

      deleteMemo(id: string, memoId: string): boolean {
        this._seed();
        const exists = this._applications.some((a) => a.id === id);
        if (!exists) return false;

        const details = this._details[id];
        if (!details || !details.timeline) return false;

        const memoIndex = details.timeline.findIndex((entry) => entry.id === memoId);
        if (memoIndex === -1) return false;

        const updatedTimeline = details.timeline.filter((_, idx) => idx !== memoIndex);
        this._details[id] = { ...details, timeline: updatedTimeline };

        return true;
      },

      // ─── T-005: createDirect ───────────────────────────────────────────────
      createDirect(data: DirectEnrollmentRequestType, blMatched: boolean): MembershipApplication {
        this._seed();
        const id = `APP-DIRECT-${Date.now()}`;
        const newApp: MembershipApplication = {
          id,
          applicant_name: `${data.applicant.last_name_kanji}${data.applicant.first_name_kanji}`,
          status: 'pending',
          blacklist_match: blMatched,
          brand_name: data.contract.brand,
          store_name: data.contract.store_id,
          plan_name: data.contract.plan_id,
          campaign: data.contract.campaign_id ?? 'なし',
          application_date: new Date().toISOString(),
          start_date: data.contract.start_date,
          is_proxy: true,
        };
        this._applications.push(newApp);
        this._details[id] = {
          applicant_name: newApp.applicant_name,
          proxy_applicant: '管理者A（STAFF-001）',
          agreement_date: new Date().toISOString(),
          payment_method: data.contract.payment_method,
          usage_start_date: data.contract.start_date,
          timeline: [],
        };
        return newApp;
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
            code: 'REG-001',
            old_code: 'OLD-REG-001',
            contract_type: 'general',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 7700,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 1250,
            other_store_usage: 'all',
            companion_benefit_enabled: true,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC001-A',
            name: 'レギュラー会員（学生）',
            code: 'REG-001S',
            old_code: 'OLD-REG-001S',
            contract_type: 'general',
            brand: 'joyfit',
            parent_contract_name: 'レギュラー会員',
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 5500,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 180,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC002',
            name: 'デイタイム会員',
            code: 'DAY-001',
            old_code: 'OLD-DAY-001',
            contract_type: 'general',
            brand: 'fit365',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 6600,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 820,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC003',
            name: 'ナイト会員',
            code: 'NIT-001',
            old_code: null,
            contract_type: 'general',
            brand: 'joyfit24',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 5500,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 450,
            other_store_usage: 'direct',
            companion_benefit_enabled: false,
            enabled_stores: 1,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC004',
            name: 'ウィークエンド会員',
            code: 'WKD-001',
            old_code: null,
            contract_type: 'general',
            brand: 'fit365',
            parent_contract_name: null,
            start_date: '2024/06/01',
            target_store_name: null,
            price_including_tax: 4400,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 320,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC005',
            name: '1Day利用',
            code: '1DAY-001',
            old_code: null,
            contract_type: 'oneDay',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 1650,
            suspension_fee: 0,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '―',
            cancellable_months: '―',
            active_contracts: 0,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC006',
            name: 'ファミリー会員（親）',
            code: 'FAM-001',
            old_code: 'OLD-FAM-001',
            contract_type: 'family',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 7700,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 210,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC006-A',
            name: 'ファミリー会員（子・大人）',
            code: 'FAM-001A',
            old_code: null,
            contract_type: 'family',
            brand: 'joyfit',
            parent_contract_name: 'ファミリー会員（親）',
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 4400,
            suspension_fee: 550,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 85,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC006-B',
            name: 'ファミリー会員（子・学生）',
            code: 'FAM-001B',
            old_code: null,
            contract_type: 'family',
            brand: 'joyfit',
            parent_contract_name: 'ファミリー会員（親）',
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 3300,
            suspension_fee: 550,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 45,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC007',
            name: '法人会員',
            code: 'CORP-001',
            old_code: 'OLD-CORP-001',
            contract_type: 'corporate',
            brand: 'fit365',
            parent_contract_name: null,
            start_date: '2024/07/01',
            target_store_name: null,
            price_including_tax: 6600,
            suspension_fee: 0,
            monthly_limit: 8,
            tax_rate: 10,
            suspendable_months: '―',
            cancellable_months: '毎月',
            active_contracts: 35,
            other_store_usage: 'none',
            companion_benefit_enabled: false,
            enabled_stores: 1,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC008',
            name: '体験利用',
            code: 'TRIAL-001',
            old_code: null,
            contract_type: 'oneDay',
            brand: 'joyfit24',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 0,
            suspension_fee: 0,
            monthly_limit: 1,
            tax_rate: 10,
            suspendable_months: '―',
            cancellable_months: '―',
            active_contracts: 0,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC009',
            name: 'プレミアム会員',
            code: 'PRM-001',
            old_code: null,
            contract_type: 'special',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2025/01/01',
            target_store_name: null,
            price_including_tax: 11000,
            suspension_fee: 2200,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '毎月',
            cancellable_months: '毎月',
            active_contracts: 0,
            other_store_usage: 'all',
            companion_benefit_enabled: true,
            enabled_stores: 0,
            total_stores: 12,
            status: 'inactive',
          },
          {
            id: 'MC010',
            name: 'スタッフ会員（当店限定）',
            code: 'SPC-010',
            old_code: null,
            contract_type: 'special',
            brand: 'joyfit24',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: 'JOYFIT24新宿店',
            price_including_tax: 0,
            suspension_fee: 0,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '―',
            cancellable_months: '毎月',
            active_contracts: 18,
            other_store_usage: 'direct',
            companion_benefit_enabled: true,
            enabled_stores: 1,
            total_stores: 12,
            status: 'inactive',
          },
          {
            id: 'MC011',
            name: 'ファミリー会員',
            code: 'FAM-010',
            old_code: null,
            contract_type: 'family',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 8800,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 276,
            other_store_usage: 'all',
            companion_benefit_enabled: true,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC012',
            name: 'キッズ会員',
            code: 'KID-001',
            old_code: null,
            contract_type: 'kids',
            brand: 'fit365',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 4400,
            suspension_fee: 550,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 140,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC013',
            name: '法人スタンダード',
            code: 'CORP-STD',
            old_code: null,
            contract_type: 'corporate',
            brand: 'joyfit24',
            parent_contract_name: null,
            start_date: '2024/07/01',
            target_store_name: null,
            price_including_tax: 9900,
            suspension_fee: 0,
            monthly_limit: 12,
            tax_rate: 10,
            suspendable_months: '―',
            cancellable_months: '毎月',
            active_contracts: 52,
            other_store_usage: 'none',
            companion_benefit_enabled: false,
            enabled_stores: 2,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC014',
            name: '福利厚生プラン',
            code: 'WEL-001',
            old_code: null,
            contract_type: 'welfare',
            brand: 'fit365',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 7150,
            suspension_fee: 550,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 98,
            other_store_usage: 'direct',
            companion_benefit_enabled: false,
            enabled_stores: 4,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC015',
            name: 'プリペイド30',
            code: 'PRE-030',
            old_code: null,
            contract_type: 'prepaid',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 3300,
            suspension_fee: 0,
            monthly_limit: 30,
            tax_rate: 10,
            suspendable_months: '―',
            cancellable_months: '毎月',
            active_contracts: 72,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC016',
            name: '朝活会員',
            code: 'MOR-001',
            old_code: null,
            contract_type: 'general',
            brand: 'joyfit_yoga',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 6050,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 64,
            other_store_usage: 'direct',
            companion_benefit_enabled: false,
            enabled_stores: 2,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC017',
            name: '平日デイ会員',
            code: 'WKD-DAY',
            old_code: null,
            contract_type: 'general',
            brand: 'joyfit_plus',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 6600,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 128,
            other_store_usage: 'direct',
            companion_benefit_enabled: false,
            enabled_stores: 3,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC018',
            name: 'シニア午前会員',
            code: 'SPC-SEN',
            old_code: null,
            contract_type: 'special',
            brand: 'joyfit24',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: 'JOYFIT24 新宿店',
            price_including_tax: 3850,
            suspension_fee: 550,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 54,
            other_store_usage: 'direct',
            companion_benefit_enabled: false,
            enabled_stores: 1,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC019',
            name: '学生ナイト会員',
            code: 'STD-NIT',
            old_code: null,
            contract_type: 'student',
            brand: 'joyfit',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 4950,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 96,
            other_store_usage: 'all',
            companion_benefit_enabled: false,
            enabled_stores: 10,
            total_stores: 12,
            status: 'active',
          },
          {
            id: 'MC020',
            name: 'Weekend会員',
            code: 'WEN-001',
            old_code: null,
            contract_type: 'general',
            brand: 'fit365',
            parent_contract_name: null,
            start_date: '2024/04/01',
            target_store_name: null,
            price_including_tax: 5720,
            suspension_fee: 1100,
            monthly_limit: null,
            tax_rate: 10,
            suspendable_months: '1〜3月',
            cancellable_months: '毎月',
            active_contracts: 288,
            other_store_usage: 'all',
            companion_benefit_enabled: true,
            enabled_stores: 12,
            total_stores: 12,
            status: 'active',
          },
        );
      },
      getList(): MainContractListItem[] {
        this._seed();
        return [...this._rows];
      },
      _details: {} as Record<string, MainContractDetail>,
      _changeHistory: {} as Record<string, MainContractChangeHistoryItem[]>,
      getById(id: string): MainContractDetail | undefined {
        this._seed();
        if (Object.keys(this._details).length === 0) {
          // Build detail map from list rows with extended fields
          const detailExtras: Record<string, Partial<MainContractDetail>> = {
            MC001: {
              changeability: '可能',
              previous_contract: null,
              billing_enabled: true,
              modifiable: '可能',
              initial_payment_months: 1,
              same_day_cancellation: false,
              family_contract_allowed: false,
              suspension_monthly_limit: null,
              usage_schedule: '終日（24時間）',
              company: null,
              regulation: null,
              public_name: 'レギュラー（全時間利用可）',
              public_description:
                '全時間帯利用可能な標準的な会員プラン。24時間いつでも全店舗のトレーニング施設を利用できます。初心者から上級者まで幅広い会員層に対応。',
              memo: null,
              usage_hours_by_day: [
                { day: '月', from: '06:00', to: '23:00', all_day: false },
                { day: '火', from: '06:00', to: '23:00', all_day: false },
                { day: '水', from: '06:00', to: '23:00', all_day: false },
                { day: '木', from: '06:00', to: '23:00', all_day: false },
                { day: '金', from: '06:00', to: '23:00', all_day: false },
                { day: '土', from: '08:00', to: '21:00', all_day: false },
                { day: '日', from: '08:00', to: '21:00', all_day: false },
              ],
              accounting_code: 'ACC-101',
              age_restriction: '16歳以上',
              gender_restriction: '制限なし',
              store_range: '全店舗（12店舗）',
              thumbnail_url: null,
              description:
                '全時間帯利用可能な標準的な会員プラン。24時間いつでも全店舗のトレーニング施設を利用できます。初心者から上級者まで幅広い会員層に対応。',
              created_at: '2024/03/15 10:00',
              updated_at: '2026/02/28 14:30',
              parent_contract_id: 'MC000',
              parent_contract_name: 'スタンダード会員',
              child_contracts: [
                { id: 'MC001-A', name: 'レギュラー会員（学生）' },
                { id: 'MC001-B', name: 'レギュラー会員（シニア）' },
              ],
            },
            MC009: {
              changeability: '可能',
              previous_contract: null,
              billing_enabled: true,
              modifiable: '可能',
              initial_payment_months: 1,
              same_day_cancellation: false,
              family_contract_allowed: false,
              suspension_monthly_limit: null,
              usage_schedule: '終日（24時間）',
              company: null,
              regulation: null,
              public_name: 'プレミアム（全時間利用可・特典付）',
              public_description:
                'プレミアム会員専用の最上位プラン。全時間帯利用可・同伴特典あり。',
              memo: null,
              usage_hours_by_day: [
                { day: '月', from: '00:00', to: '23:59', all_day: true },
                { day: '火', from: '00:00', to: '23:59', all_day: true },
                { day: '水', from: '00:00', to: '23:59', all_day: true },
                { day: '木', from: '00:00', to: '23:59', all_day: true },
                { day: '金', from: '00:00', to: '23:59', all_day: true },
                { day: '土', from: '00:00', to: '23:59', all_day: true },
                { day: '日', from: '00:00', to: '23:59', all_day: true },
              ],
              accounting_code: 'ACC-901',
              age_restriction: '16歳以上',
              gender_restriction: '制限なし',
              store_range: '全店舗（12店舗）',
              thumbnail_url: null,
              description: 'プレミアム会員専用の最上位プラン。全時間帯利用可・同伴特典あり。',
              created_at: '2024/12/15 10:00',
              updated_at: '2026/01/10 14:30',
              parent_contract_id: null,
              parent_contract_name: null,
              child_contracts: [],
            },
          };
          for (const row of this._rows) {
            const extras = detailExtras[row.id] ?? {
              changeability: '可能',
              previous_contract: null,
              billing_enabled: true,
              modifiable: '可能',
              initial_payment_months: 1,
              same_day_cancellation: false,
              family_contract_allowed: false,
              suspension_monthly_limit: null,
              usage_schedule: '終日（24時間）',
              company: null,
              regulation: null,
              public_name: row.name,
              public_description: '',
              memo: null,
              usage_hours_by_day: [
                { day: '月', from: '06:00', to: '23:00', all_day: false },
                { day: '火', from: '06:00', to: '23:00', all_day: false },
                { day: '水', from: '06:00', to: '23:00', all_day: false },
                { day: '木', from: '06:00', to: '23:00', all_day: false },
                { day: '金', from: '06:00', to: '23:00', all_day: false },
                { day: '土', from: '08:00', to: '21:00', all_day: false },
                { day: '日', from: '08:00', to: '21:00', all_day: false },
              ],
              accounting_code: 'ACC-000',
              age_restriction: '16歳以上',
              gender_restriction: '制限なし',
              store_range: `全店舗（${row.total_stores}店舗）`,
              thumbnail_url: null,
              description: '',
              created_at: '2024/04/01 10:00',
              updated_at: '2024/04/01 10:00',
              parent_contract_id: row.parent_contract_name ? 'MC000' : null,
              parent_contract_name: row.parent_contract_name ?? null,
              child_contracts: [],
            };
            this._details[row.id] = { ...row, ...extras } as MainContractDetail;
          }
        }
        return this._details[id];
      },
      getChangeHistory(id: string): MainContractChangeHistoryItem[] {
        const defaultHistory: MainContractChangeHistoryItem[] = [
          {
            date: '2026/02/28 14:30',
            user: '管理者A',
            field: '説明文',
            from: '全時間帯利用可能な標準的な会員プラン。',
            to: '全時間帯利用可能な標準的な会員プラン。24時間いつでも全店舗のトレーニング施設を利用できます...',
          },
          {
            date: '2025/10/01 09:00',
            user: '管理者B',
            field: '料金（税込）',
            from: '¥7,150',
            to: '¥7,700',
          },
          {
            date: '2025/07/01 10:00',
            user: '管理者C',
            field: '最低契約期間',
            from: '1ヶ月',
            to: '3ヶ月',
          },
          {
            date: '2025/04/01 10:00',
            user: '管理者A',
            field: 'ステータス',
            from: '無効',
            to: '有効',
          },
          { date: '2024/03/15 10:00', user: '管理者A', field: null, from: null, to: '新規作成' },
        ];
        if (!this._changeHistory[id]) {
          this._changeHistory[id] = defaultHistory;
        }
        return this._changeHistory[id];
      },
      delete(id: string): boolean {
        this._seed();
        const idx = this._rows.findIndex((r) => r.id === id);
        if (idx === -1) return false;
        this._rows.splice(idx, 1);
        delete this._details[id];
        delete this._changeHistory[id];
        return true;
      },
      add(contract: MainContractDetail): void {
        this._seed();
        const listItem: MainContractListItem = {
          id: contract.id,
          name: contract.name,
          code: contract.code,
          old_code: contract.old_code,
          contract_type: contract.contract_type,
          brand: contract.brand,
          parent_contract_name: contract.parent_contract_name,
          start_date: contract.start_date,
          target_store_name: contract.target_store_name,
          price_including_tax: contract.price_including_tax,
          suspension_fee: contract.suspension_fee,
          monthly_limit: contract.monthly_limit,
          tax_rate: contract.tax_rate,
          suspendable_months: contract.suspendable_months,
          cancellable_months: contract.cancellable_months,
          active_contracts: contract.active_contracts,
          other_store_usage: contract.other_store_usage,
          companion_benefit_enabled: contract.companion_benefit_enabled,
          enabled_stores: contract.enabled_stores,
          total_stores: contract.total_stores,
          status: contract.status,
        };
        this._rows.push(listItem);
        this._details[contract.id] = contract;
      },
      update(id: string, data: Partial<MainContractDetail>): MainContractDetail | undefined {
        this._seed();
        const existing = this._details[id];
        if (!existing) return undefined;
        const updated = { ...existing, ...data, id, updated_at: new Date().toISOString() };
        this._details[id] = updated;
        // update list row
        const idx = this._rows.findIndex((r) => r.id === id);
        if (idx !== -1) {
          this._rows[idx] = {
            ...this._rows[idx],
            name: updated.name,
            code: updated.code,
            old_code: updated.old_code,
            contract_type: updated.contract_type,
            brand: updated.brand,
            status: updated.status,
            companion_benefit_enabled: updated.companion_benefit_enabled,
            other_store_usage: updated.other_store_usage,
            price_including_tax: updated.price_including_tax,
            suspension_fee: updated.suspension_fee,
            monthly_limit: updated.monthly_limit,
            tax_rate: updated.tax_rate,
            start_date: updated.start_date,
            suspendable_months: updated.suspendable_months,
            cancellable_months: updated.cancellable_months,
            parent_contract_name: updated.parent_contract_name,
          };
        }
        return updated;
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
            code: 'DRK-001',
            brand: 'fit365',
            option_type: 'standard',
            price_including_tax: 550,
            tax_rate: 10,
            prorated_enabled: true,
            prorata_method: 'daily',
            usage_rule: 'add_remove_change',
            linked_contracts: 6,
            member_count: 310,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-101',
            status: 'active',
          },
          {
            id: 'OP002',
            name: '水素水',
            code: 'H2O-001',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 1100,
            tax_rate: 10,
            prorated_enabled: true,
            prorata_method: 'daily',
            usage_rule: 'add_remove_change',
            linked_contracts: 10,
            member_count: 680,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-102',
            status: 'active',
          },
          {
            id: 'OP003',
            name: 'タオルセット',
            code: 'TWL-001',
            brand: 'joyfit',
            option_type: 'standard',
            price_including_tax: 330,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'add_remove',
            linked_contracts: 10,
            member_count: 350,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-103',
            status: 'active',
          },
          {
            id: 'OP004',
            name: 'パーソナルロッカー（S）',
            code: 'LCK-001',
            brand: 'joyfit',
            option_type: 'standard',
            price_including_tax: 550,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'add_remove_change',
            linked_contracts: 6,
            member_count: 180,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-201',
            status: 'active',
          },
          {
            id: 'OP005',
            name: 'パーソナルロッカー（L）',
            code: 'LCK-002',
            brand: 'fit365',
            option_type: 'standard',
            price_including_tax: 880,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'add_remove_change',
            linked_contracts: 6,
            member_count: 95,
            store_id: 'store-002',
            store_name: 'Fit365新宿店',
            accounting_code: 'OPT-202',
            status: 'active',
          },
          {
            id: 'OP006',
            name: '契約ロッカー',
            code: 'LCK-003',
            brand: 'joyfit',
            option_type: 'standard',
            price_including_tax: 1100,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'change_remove',
            linked_contracts: 4,
            member_count: 60,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-203',
            status: 'active',
          },
          {
            id: 'OP007',
            name: '安心サポートプラス',
            code: 'SPT-001',
            brand: 'joyfit',
            option_type: 'auto_attached',
            price_including_tax: 550,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'disabled',
            linked_contracts: 8,
            member_count: 920,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-301',
            status: 'active',
          },
          {
            id: 'OP008',
            name: 'Wi-Fi利用',
            code: 'WIF-001',
            brand: 'joyfit',
            option_type: 'auto_attached',
            price_including_tax: 0,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'disabled',
            linked_contracts: 10,
            member_count: 1200,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-401',
            status: 'active',
          },
          {
            id: 'OP009',
            name: 'シャワールーム優先利用',
            code: 'SHW-001',
            brand: 'joyfit',
            option_type: 'metered',
            price_including_tax: 220,
            tax_rate: 10,
            prorated_enabled: true,
            prorata_method: 'fixed',
            usage_rule: 'add_remove',
            linked_contracts: 3,
            member_count: 45,
            store_id: 'store-001',
            store_name: 'Fit365八潮店',
            accounting_code: 'OPT-402',
            status: 'inactive',
          },
          {
            id: 'OP011',
            name: 'パーソナルトレーニング（月4回）',
            code: 'PT-002',
            brand: 'joyfit24',
            option_type: 'metered',
            price_including_tax: 22000,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'add_remove_change',
            linked_contracts: 5,
            member_count: 88,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-501',
            status: 'active',
          },
          {
            id: 'OP021',
            name: '安心サポート（当店版）',
            code: 'SPT-002',
            brand: 'joyfit24',
            option_type: 'auto_attached',
            price_including_tax: 660,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'disabled',
            linked_contracts: 3,
            member_count: 420,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-601',
            status: 'active',
          },
          {
            id: 'OP022',
            name: '有料駐車場チケット（当店限定）',
            code: 'PKG-001',
            brand: 'fit365',
            option_type: 'standard',
            price_including_tax: 1100,
            tax_rate: 10,
            prorated_enabled: true,
            prorata_method: 'daily',
            usage_rule: 'add_remove',
            linked_contracts: 2,
            member_count: 30,
            store_id: 'store-002',
            store_name: 'Fit365新宿店',
            accounting_code: 'OPT-701',
            status: 'inactive',
          },
          {
            id: 'OP023',
            name: 'プロテインサーバー',
            code: 'PRO-001',
            brand: 'fit365',
            option_type: 'metered',
            price_including_tax: 1650,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'add_remove_change',
            linked_contracts: 8,
            member_count: 420,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-801',
            status: 'active',
          },
          {
            id: 'OP025',
            name: '契約ロッカーL',
            code: 'LCK-004',
            brand: 'joyfit',
            option_type: 'standard',
            price_including_tax: 1650,
            tax_rate: 10,
            prorated_enabled: true,
            prorata_method: 'daily',
            usage_rule: 'change_remove',
            linked_contracts: 4,
            member_count: 72,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-204',
            status: 'active',
          },
          {
            id: 'OP030',
            name: '安心サポートPLUS',
            code: 'SPT-003',
            brand: 'joyfit_plus',
            option_type: 'auto_attached',
            price_including_tax: 880,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'disabled',
            linked_contracts: 2,
            member_count: 155,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-901',
            status: 'active',
          },
          {
            id: 'OP031',
            name: 'メンテナンス会費',
            code: 'MNT-001',
            brand: 'fit365',
            option_type: 'auto_attached',
            price_including_tax: 770,
            tax_rate: 10,
            prorated_enabled: false,
            prorata_method: null,
            usage_rule: 'disabled',
            linked_contracts: 7,
            member_count: 890,
            store_id: null,
            store_name: null,
            accounting_code: 'OPT-902',
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
      create(input: {
        member_id: string;
        member_name: string;
        from_store_id: string;
        from_store_name: string;
        to_store_id: string;
        to_store_name: string;
        brand: string;
        reason?: string;
      }): TransferRow {
        const now = new Date().toISOString();
        const id = `TR-${String(this._rows.length + 1).padStart(3, '0')}`;
        const newRow: TransferRow = {
          id,
          member_id: input.member_id,
          member_name: input.member_name,
          from_store_id: input.from_store_id,
          from_store_name: input.from_store_name,
          to_store_id: input.to_store_id,
          to_store_name: input.to_store_name,
          brand: input.brand as TransferRow['brand'],
          applied_at: now,
          scheduled_date: now,
          status: TransferStatus.Pending,
          reason: input.reason ?? '',
          applicant_name: 'スタッフ',
          applicant_role: 'staff',
          updated_at: now,
          approval_history: [
            {
              step: 1,
              label: '申請',
              store_type: null,
              completed: true,
              completed_at: now,
              completed_by: 'スタッフ',
              is_automatic: false,
            },
            {
              step: 2,
              label: '移籍元承認',
              store_type: 'from',
              completed: false,
              completed_at: null,
              completed_by: null,
              is_automatic: false,
            },
            {
              step: 3,
              label: '移籍先承認',
              store_type: 'to',
              completed: false,
              completed_at: null,
              completed_by: null,
              is_automatic: false,
            },
          ],
        };
        this._rows.push(newRow);
        return newRow;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    memberLeaves: {
      _rows: [] as LeaveListItem[],
      _details: {} as Record<string, LeaveDetail>,
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        db.members._seed();

        const targetStatuses = new Set<string>([
          MemberStatus.SUSPENDED,
          MemberStatus.PENDING_WITHDRAWAL,
          MemberStatus.WITHDRAWN,
          MemberStatus.FORCE_WITHDRAWN,
        ]);

        const candidates = db.members._members.filter((m) => targetStatuses.has(m.profile.status));

        // Deterministic date helpers
        const baseDate = new Date('2026-01-01');
        const toJpDate = (d: Date): string =>
          `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
        const toJpMonth = (d: Date): string =>
          `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;

        this._rows = candidates.map((m, i) => {
          const memberStatus = m.profile.status;
          const appliedDate = new Date(baseDate);
          appliedDate.setDate(appliedDate.getDate() + i * 7);

          const scheduledDate = new Date(appliedDate);
          scheduledDate.setDate(scheduledDate.getDate() + 14);

          let leaveStatus: LeaveListItem['status'];
          let leaveType: LeaveListItem['type'];
          let endDate: string | null = null;
          let unpaidAmount = 0;

          if (memberStatus === MemberStatus.SUSPENDED) {
            leaveType = 'suspension';
            leaveStatus = i % 2 === 0 ? 'suspended' : 'suspension_scheduled';
            const endD = new Date(scheduledDate);
            endD.setMonth(endD.getMonth() + 2);
            endDate = toJpMonth(endD);
            unpaidAmount = i % 5 === 0 ? 1100 * ((i % 3) + 1) : 0;
          } else if (memberStatus === MemberStatus.PENDING_WITHDRAWAL) {
            leaveType = 'withdrawal';
            leaveStatus = 'withdrawal_pending';
            unpaidAmount = i % 3 === 0 ? 7700 : 0;
          } else if (memberStatus === MemberStatus.WITHDRAWN) {
            leaveType = 'withdrawal';
            leaveStatus = i % 2 === 0 ? 'withdrawal_scheduled' : 'withdrawal_pending';
            unpaidAmount = 0;
          } else {
            // FORCE_WITHDRAWN
            leaveType = 'withdrawal';
            leaveStatus = 'completed';
            unpaidAmount = 0;
          }

          const scheduledDateStr =
            leaveType === 'suspension' ? toJpMonth(scheduledDate) : toJpDate(scheduledDate);

          return {
            id: `LV-${String(i + 1).padStart(3, '0')}`,
            member_id: m.basic_info.id,
            member_name: m.basic_info.name_kanji,
            brand: m.profile.brand,
            store_id: m.profile.store_id,
            store_name: m.profile.store_name,
            type: leaveType,
            status: leaveStatus,
            applied_at: toJpDate(appliedDate),
            scheduled_date: scheduledDateStr,
            end_date: endDate,
            unpaid_amount: unpaidAmount,
          } satisfies LeaveListItem;
        });

        // Build detail records from list rows
        const consentMethods = ['来店', 'オンライン', '電話'];
        this._rows.forEach((row, i) => {
          const appliedDateTime = `${row.applied_at} ${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`;
          const isProxy = i % 3 === 0;
          this._details[row.id] = {
            id: row.id,
            member_id: row.member_id,
            member_name: row.member_name,
            brand: row.brand,
            store_id: row.store_id,
            store_name: row.store_name,
            type: row.type,
            status: row.status,
            applied_at: appliedDateTime,
            scheduled_date: row.scheduled_date,
            end_date: row.end_date,
            reason: [
              '海外出張のため',
              '体調不良のため',
              '育児のため',
              '経済的理由のため',
              '転居のため',
            ][i % 5]!,
            applicant: isProxy ? `${row.member_name}（本人）` : `${row.member_name}（本人）`,
            is_proxy_applied: isProxy,
            proxy_applicant: isProxy ? `スタッフ${i + 1}（スタッフ）` : null,
            consent_at: isProxy
              ? new Date(
                  `${row.applied_at} ${String(9 + (i % 8)).padStart(2, '0')}:00`,
                ).toISOString()
              : null,
            consent_method: isProxy ? (consentMethods[i % 3] ?? '来店') : null,
            suspension_fee: row.type === 'suspension' ? 1100 : null,
            applied_campaign: 'なし',
            unused_lessons: (i * 2) % 5,
            unpaid_amount: row.unpaid_amount,
            created_at: appliedDateTime,
            updated_at: appliedDateTime,
          } satisfies LeaveDetail;
        });
      },
      list(): LeaveListItem[] {
        this._seed();
        return this._rows;
      },
      getById(id: string): LeaveDetail | undefined {
        this._seed();
        return this._details[id];
      },
      getActiveSuspensionByMemberId(memberId: string): LeaveDetail | undefined {
        this._seed();
        const row = this._rows.find(
          (r) =>
            r.member_id === memberId &&
            r.type === 'suspension' &&
            (r.status === 'suspended' || r.status === 'suspension_scheduled'),
        );
        return row ? this._details[row.id] : undefined;
      },
      _updateDetail(id: string, patch: Partial<LeaveDetail>): LeaveDetail | undefined {
        const detail = this._details[id];
        if (!detail) return undefined;
        const now = new Date()
          .toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/\//g, '/')
          .replace(',', '');
        const updated: LeaveDetail = { ...detail, ...patch, updated_at: now };
        this._details[id] = updated;
        // Sync list row status
        const listIdx = this._rows.findIndex((r) => r.id === id);
        if (listIdx !== -1 && patch.status) {
          this._rows[listIdx] = { ...this._rows[listIdx]!, status: patch.status };
        }
        // Sync member status if needed
        if (patch.status && updated.member_id) {
          const memberIdx = db.members._members.findIndex(
            (m) => m.basic_info.id === updated.member_id,
          );
          if (memberIdx !== -1) {
            let memberStatus: MemberStatus | null = null;
            if (patch.status === 'suspended') memberStatus = 'suspended';
            else if (patch.status === 'suspension_scheduled') memberStatus = 'active';
            else if (patch.status === 'withdrawal_pending') memberStatus = 'pending_withdrawal';
            else if (patch.status === 'completed') memberStatus = 'force_withdrawn';
            if (memberStatus) {
              db.members._members[memberIdx] = {
                ...db.members._members[memberIdx]!,
                profile: {
                  ...db.members._members[memberIdx]!.profile,
                  status: memberStatus,
                },
              };
            }
          }
        }
        return updated;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      approve(id: string, _comment?: string): LeaveDetail | undefined {
        this._seed();
        const detail = this._details[id];
        if (!detail) return undefined;
        let nextStatus: LeaveDetail['status'] | null = null;
        if (detail.type === 'suspension' && detail.status === 'suspension_scheduled') {
          nextStatus = 'suspended';
        } else if (detail.type === 'withdrawal' && detail.status === 'withdrawal_scheduled') {
          nextStatus = 'withdrawal_pending';
        } else {
          return undefined; // invalid transition
        }
        return this._updateDetail(id, { status: nextStatus });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      reject(id: string, _reason: string): LeaveDetail | undefined {
        this._seed();
        const detail = this._details[id];
        if (!detail) return undefined;
        const canReject =
          detail.status === 'suspension_scheduled' || detail.status === 'withdrawal_scheduled';
        if (!canReject) return undefined;
        // On reject: revert member to active, remove the leave record from active list
        const nextStatus: LeaveDetail['status'] = 'completed'; // mark as completed (rejected)
        const updated = this._updateDetail(id, { status: nextStatus });
        // Revert member to active
        if (updated?.member_id) {
          const memberIdx = db.members._members.findIndex(
            (m) => m.basic_info.id === updated.member_id,
          );
          if (memberIdx !== -1) {
            db.members._members[memberIdx] = {
              ...db.members._members[memberIdx]!,
              profile: {
                ...db.members._members[memberIdx]!.profile,
                status: 'active',
              },
            };
          }
        }
        return updated;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cancelWithdrawal(id: string, _comment?: string): LeaveDetail | undefined {
        this._seed();
        const detail = this._details[id];
        if (!detail) return undefined;
        if (detail.status !== 'withdrawal_scheduled') return undefined;
        // Cancel: revert to active
        const updated = this._updateDetail(id, { status: 'completed' });
        if (updated?.member_id) {
          const memberIdx = db.members._members.findIndex(
            (m) => m.basic_info.id === updated.member_id,
          );
          if (memberIdx !== -1) {
            db.members._members[memberIdx] = {
              ...db.members._members[memberIdx]!,
              profile: { ...db.members._members[memberIdx]!.profile, status: 'active' },
            };
          }
        }
        return updated;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      executeWithdrawal(id: string, _comment?: string): LeaveDetail | undefined {
        this._seed();
        const detail = this._details[id];
        if (!detail) return undefined;
        if (detail.status !== 'withdrawal_pending') return undefined;
        return this._updateDetail(id, { status: 'completed' });
      },
      create(input: { member_id: string; scheduled_date: string; reason: string }): LeaveDetail {
        this._seed();
        const member = db.members._members.find((m) => m.basic_info.id === input.member_id);
        const now = new Date()
          .toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(',', '');
        const newId = `LV-${String(this._rows.length + 1).padStart(3, '0')}`;
        const listItem: LeaveListItem = {
          id: newId,
          member_id: input.member_id,
          member_name: member?.basic_info.name_kanji ?? '',
          brand: member?.profile.brand ?? '',
          store_id: member?.profile.store_id ?? '',
          store_name: member?.profile.store_name ?? '',
          type: 'withdrawal',
          status: 'withdrawal_pending',
          applied_at: now.split(' ')[0]!,
          scheduled_date: input.scheduled_date,
          end_date: null,
          unpaid_amount: 0,
        };
        this._rows.push(listItem);
        const detail: LeaveDetail = {
          id: newId,
          member_id: input.member_id,
          member_name: listItem.member_name,
          brand: listItem.brand,
          store_id: listItem.store_id,
          store_name: listItem.store_name,
          type: 'withdrawal',
          status: 'withdrawal_pending',
          applied_at: now,
          scheduled_date: input.scheduled_date,
          end_date: null,
          reason: input.reason,
          applicant: `${listItem.member_name}（本人）`,
          is_proxy_applied: false,
          proxy_applicant: null,
          consent_at: null,
          consent_method: null,
          suspension_fee: null,
          applied_campaign: 'なし',
          unused_lessons: 0,
          unpaid_amount: 0,
          created_at: now,
          updated_at: now,
        };
        this._details[newId] = detail;
        return detail;
      },
      createSuspension(input: {
        member_id: string;
        start_month: string;
        end_month: string;
        reason?: string;
        is_proxy?: boolean;
        proxy_agreed_at?: string;
        proxy_method?: string;
      }): LeaveDetail {
        this._seed();
        const member = db.members._members.find((m) => m.basic_info.id === input.member_id);
        const now = new Date()
          .toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(',', '');
        const newId = `LV-${String(this._rows.length + 1).padStart(3, '0')}`;
        const listItem: LeaveListItem = {
          id: newId,
          member_id: input.member_id,
          member_name: member?.basic_info.name_kanji ?? '',
          brand: member?.profile.brand ?? '',
          store_id: member?.profile.store_id ?? '',
          store_name: member?.profile.store_name ?? '',
          type: 'suspension',
          status: 'suspension_scheduled',
          applied_at: now.split(' ')[0]!,
          scheduled_date: input.start_month,
          end_date: input.end_month,
          unpaid_amount: 0,
        };
        this._rows.push(listItem);
        const detail: LeaveDetail = {
          id: newId,
          member_id: input.member_id,
          member_name: listItem.member_name,
          brand: listItem.brand,
          store_id: listItem.store_id,
          store_name: listItem.store_name,
          type: 'suspension',
          status: 'suspension_scheduled',
          applied_at: now,
          scheduled_date: input.start_month,
          end_date: input.end_month,
          reason: input.reason ?? '',
          applicant: input.is_proxy
            ? `${listItem.member_name}（代理）`
            : `${listItem.member_name}（本人）`,
          is_proxy_applied: input.is_proxy ?? false,
          proxy_applicant: input.is_proxy ? 'スタッフ（代理）' : null,
          consent_at: input.proxy_agreed_at ?? null,
          consent_method: input.proxy_method ?? null,
          suspension_fee: 1100,
          applied_campaign: 'なし',
          unused_lessons: 0,
          unpaid_amount: 0,
          created_at: now,
          updated_at: now,
        };
        this._details[newId] = detail;
        return detail;
      },
    },
    memberBlacklist: {
      _rows: [] as BlacklistRow[],
      _seeded: false,
      _seed() {
        if (this._seeded) return;
        this._seeded = true;
        db.members._seed();

        const forceWithdrawn = db.members._members.filter(
          (m) => m.profile.status === MemberStatus.FORCE_WITHDRAWN,
        );
        const withdrawn = db.members._members.filter(
          (m) => m.profile.status === MemberStatus.WITHDRAWN,
        );

        const manualReasons: BlacklistRow['manualReason'][] = [
          'nuisance',
          'unpaid',
          'fraudulent_use',
          'other',
        ];

        const baseDate = new Date('2026-01-01');

        forceWithdrawn.forEach((m, i) => {
          const registeredAt = new Date(baseDate);
          registeredAt.setDate(registeredAt.getDate() + i * 14);
          this._rows.push({
            id: `BL-FW-${String(i + 1).padStart(3, '0')}`,
            memberId: m.basic_info.member_number,
            memberName: m.basic_info.name_kanji,
            storeName: m.profile.store_name,
            registrationSource: 'forced_withdrawal',
            manualReason: null,
            unpaidAmount: i % 3 === 0 ? (i + 1) * 3300 : 0,
            registeredAt: registeredAt.toISOString(),
            memo: null,
            registeredBy: 'System',
            matchConditions: {
              nameAndBirthdate: true,
              email: i % 2 === 0,
              phone: i % 3 !== 0,
              address: i % 4 === 0,
            },
          });
        });

        const staffNames = ['佐藤 花子', '鈴木 次郎', '高橋 美咲', '田中 健一', '伊藤 直子'];
        withdrawn.slice(0, 5).forEach((m, i) => {
          const registeredAt = new Date(baseDate);
          registeredAt.setDate(registeredAt.getDate() + i * 21 + 7);
          this._rows.push({
            id: `BL-MN-${String(i + 1).padStart(3, '0')}`,
            memberId: m.basic_info.member_number,
            memberName: m.basic_info.name_kanji,
            storeName: m.profile.store_name,
            registrationSource: 'manual',
            manualReason: manualReasons[i % manualReasons.length]!,
            unpaidAmount: i % 2 === 0 ? (i + 1) * 1100 : 0,
            registeredAt: registeredAt.toISOString(),
            memo: i % 2 === 0 ? '手動登録済み' : null,
            registeredBy: staffNames[i % staffNames.length]!,
            matchConditions: {
              nameAndBirthdate: i % 2 === 0,
              email: i % 3 !== 0,
              phone: true,
              address: i % 2 !== 0,
            },
          });
        });
      },
      getList(): BlacklistRow[] {
        this._seed();
        return this._rows;
      },
      getById(id: string): BlacklistRow | undefined {
        this._seed();
        return this._rows.find((r) => r.id === id);
      },
      create(input: Omit<BlacklistRow, 'id' | 'registeredAt'>): BlacklistRow {
        this._seed();
        const newRow: BlacklistRow = {
          ...input,
          id: `BL-${Date.now()}`,
          registeredAt: new Date().toISOString(),
        };
        this._rows.push(newRow);
        return newRow;
      },
    },

    // ─── T-004: Enrollment Fee Masters ─────────────────────────────────────
    enrollmentFeeMasters: {
      _rows: [] as EnrollmentFeeMasterRow[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows = [...SEED_ENROLLMENT_FEE_MASTERS];
      },
      getAll(): EnrollmentFeeMasterRow[] {
        this._seed();
        return [...this._rows];
      },
      getFiltered(brand?: string, applicationType?: string): EnrollmentFeeMasterRow[] {
        this._seed();
        return this._rows.filter((r) => {
          if (brand && r.brand !== brand && r.brand !== '共通') return false;
          if (applicationType && r.application_type !== applicationType) return false;
          return r.isActive;
        });
      },
    },

    // ─── T-004: Corporate Masters ───────────────────────────────────────────
    corporateMasters: {
      _rows: [] as CorporateMasterRow[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows = [...SEED_CORPORATE_MASTERS];
      },
      getAll(): CorporateMasterRow[] {
        this._seed();
        return [...this._rows];
      },
    },

    // ─── T-004: Partner Companies ───────────────────────────────────────────
    partnerCompanies: {
      _rows: [] as CorporateMasterRow[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows = [...SEED_CORPORATE_MASTERS];
      },
      getAll(): CorporateMasterRow[] {
        this._seed();
        return [...this._rows];
      },
    },

    // ─── Users (auth) ────────────────────────────────────────────────────────
    users: {
      _rows: [] as UserRow[],
      _seeded: false,
      _seed(): void {
        if (this._seeded) return;
        this._seeded = true;
        this._rows = [...SEED_USERS];
      },
      getByEmail(email: string): UserRow | undefined {
        this._seed();
        return this._rows.find((u) => u.email === email);
      },
      getById(id: string): UserRow | undefined {
        this._seed();
        return this._rows.find((u) => u.id === id);
      },
      getList(): UserRow[] {
        this._seed();
        return [...this._rows];
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
  db.enrollmentFeeMasters._seed();
  db.corporateMasters._seed();
  db.partnerCompanies._seed();
  db.users._seed();

  return db;
}

// Use globalThis to guarantee a true singleton across all Next.js route handler bundles.
// Without this, each route handler gets its own module instance and mutations are invisible
// across routes.
// Bump this key whenever the seed logic changes to force a fresh re-seed.
export const db: DbType = (globalThis.__fitnessDb_v9 ??= createDb() as unknown as DbType);
