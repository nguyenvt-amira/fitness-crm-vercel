/**
 * Shared in-memory mock database for all CRM API routes.
 * All APIs should read/update data through this module so list and detail stay in sync.
 */
import type { GetContractsResponse } from '@/app/api/_schemas/member.schema';

import {
  Brand,
  type Member,
  MemberStatus,
  MemberType,
  type UpdateBasicInfoRequest,
  type UpdateHealthInfoRequest,
  type UpdateMarketingConsentRequest,
} from '@/types/api/member.type';
import type {
  MembershipApplication,
  MembershipApplicationStatus,
} from '@/types/api/membership-application.type';

// --- Types ---
export type MemberListItem = GetMembersResponseMember;

interface GetMembersResponseMember {
  id: string;
  member_number: string;
  name_kanji: string;
  name_kana: string;
  member_type: MemberType;
  status: MemberStatus;
  store_name: string;
  store_id: string;
  brand: Brand;
  contract_plan_name: string;
  contract_plan_id: string;
  joined_at: string;
  last_visit_date?: string;
  has_unpaid: boolean;
  phone: string;
  email: string;
}

// List-only fields stored with Member for list view
interface MemberListMeta {
  contract_plan_id: string;
  contract_plan_name: string;
  last_visit_date?: string;
  has_unpaid: boolean;
}

type MemberRow = Member & { _listMeta?: MemberListMeta };

const MOCK_STORES = [
  { id: 'store-001', name: 'Fit365八潮店' },
  { id: 'store-002', name: 'Fit365新宿店' },
  { id: 'store-003', name: 'Fit365渋谷店' },
  { id: 'store-004', name: 'ジョイフィット渋谷店' },
  { id: 'store-005', name: 'JOYFIT池袋店' },
];
const MOCK_PLANS = [
  { id: 'plan-001', name: 'ベーシックプラン' },
  { id: 'plan-002', name: 'スタンダードプラン' },
  { id: 'plan-003', name: 'プレミアムプラン' },
];

type ContractRow = {
  contract_id: string;
  member_id: string;
  /**
   * For traceability in mocks: which membership application created this contract (if any).
   */
  application_id?: string;
  created_at: string;
  data: GetContractsResponse;
};

function createMember(
  id: string,
  listMeta: {
    name_kanji: string;
    name_kana: string;
    phone: string;
    email: string;
    member_type: MemberType;
    status: MemberStatus;
    store_id: string;
    store_name: string;
    brand: Brand;
    joined_at: string;
    contract_plan_id: string;
    contract_plan_name: string;
    last_visit_date?: string;
    has_unpaid: boolean;
  },
): MemberRow {
  return {
    basic_info: {
      id,
      member_number: id,
      name_kanji: listMeta.name_kanji,
      name_kana: listMeta.name_kana,
      birthday: '1990-05-15',
      age: 34,
      gender: 'female',
      postal_code: '1500002',
      prefecture: '東京都',
      city: '渋谷区',
      address: '渋谷1-2-3',
      building: 'サンプルマンション 101',
      phone: listMeta.phone,
      email: listMeta.email,
      emergency_contact: {
        name: '佐藤 太郎',
        relationship: '夫',
        phone: '09087654321',
      },
    },
    profile: {
      member_type: listMeta.member_type,
      status: listMeta.status,
      store_id: listMeta.store_id,
      store_name: listMeta.store_name,
      brand: listMeta.brand,
      joined_at: listMeta.joined_at,
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
      other_notes: '入会時健康アンケート済み。',
    },
    _listMeta: {
      contract_plan_id: listMeta.contract_plan_id,
      contract_plan_name: listMeta.contract_plan_name,
      last_visit_date: listMeta.last_visit_date,
      has_unpaid: listMeta.has_unpaid,
    },
  };
}

function memberToListItem(m: MemberRow): MemberListItem {
  const meta = m._listMeta;
  return {
    id: m.basic_info.id,
    member_number: m.basic_info.member_number,
    name_kanji: m.basic_info.name_kanji,
    name_kana: m.basic_info.name_kana,
    member_type: m.profile.member_type,
    status: m.profile.status,
    store_id: m.profile.store_id,
    store_name: m.profile.store_name,
    brand: m.profile.brand,
    joined_at: m.profile.joined_at,
    phone: m.basic_info.phone,
    email: m.basic_info.email,
    contract_plan_id: meta?.contract_plan_id ?? 'plan-001',
    contract_plan_name: meta?.contract_plan_name ?? 'ベーシックプラン',
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

function buildMemberContractData(input: {
  plan_name: string;
  start_date: string;
  monthly_fee: number;
  created_at: string;
}): GetContractsResponse {
  const start = new Date(input.start_date);
  const penaltyEnd = addMonths(start, 12);
  penaltyEnd.setDate(penaltyEnd.getDate() - 1);

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
      payment_history: [],
    },
    unpaid_info: null,
    campaigns: {
      active: [],
      history: [],
    },
  };
}

export const db = {
  members: {
    _members: [] as MemberRow[],
    _seeded: false,

    _seed(): void {
      if (this._seeded) return;
      this._seeded = true;
      const names = [
        { kanji: '佐藤 花子', kana: 'サトウ ハナコ' },
        { kanji: '鈴木 太郎', kana: 'スズキ タロウ' },
        { kanji: '田中 美咲', kana: 'タナカ ミサキ' },
        { kanji: '山田 健太', kana: 'ヤマダ ケンタ' },
        { kanji: '中村 由美', kana: 'ナカムラ ユミ' },
      ];
      for (let i = 1; i <= 200; i++) {
        const id = `M-${String(i).padStart(5, '0')}`;
        const name = names[i % names.length];
        const store = MOCK_STORES[i % MOCK_STORES.length];
        const plan = MOCK_PLANS[i % MOCK_PLANS.length];
        const phone = `090${String(1000 + (i % 9000)).slice(-4)}${String(1000 + (i % 9000)).slice(-4)}`;
        const email = `member${String(i).padStart(5, '0')}@example.jp`;
        this._members.push(
          createMember(id, {
            name_kanji: name.kanji,
            name_kana: name.kana,
            phone,
            email,
            member_type: (['regular', 'family', 'corporate'] as MemberType[])[i % 3],
            status: (['active', 'suspended', 'withdrawn'] as MemberStatus[])[i % 3],
            store_name: store.name,
            store_id: store.id,
            brand: i % 2 === 0 ? Brand.FIT365 : Brand.JOYFIT,
            contract_plan_name: plan.name,
            contract_plan_id: plan.id,
            joined_at: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
            last_visit_date:
              i % 5 === 0 ? undefined : `2024-12-${String((i % 28) + 1).padStart(2, '0')}`,
            has_unpaid: i % 7 === 0,
          }),
        );
      }
    },

    get(id: string): Member | undefined {
      this._seed();
      return this._members.find((m) => m.basic_info.id === id);
    },

    getList(): MemberListItem[] {
      this._seed();
      return this._members.map(memberToListItem);
    },

    createFromApplication(application: MembershipApplication): Member {
      this._seed();
      const nextNumber = this._members.length + 1;
      const id = `M-${String(nextNumber).padStart(5, '0')}`;
      const store = MOCK_STORES[nextNumber % MOCK_STORES.length]!;
      const plan = MOCK_PLANS[nextNumber % MOCK_PLANS.length]!;
      const now = new Date();
      const row = createMember(id, {
        name_kanji: application.applicant_name,
        name_kana: application.applicant_name,
        phone: `090${String(1000 + (nextNumber % 9000)).slice(-4)}${String(1000 + (nextNumber % 9000)).slice(-4)}`,
        email: `applicant${String(nextNumber).padStart(5, '0')}@example.jp`,
        member_type: (['regular', 'family', 'corporate'] as MemberType[])[nextNumber % 3]!,
        status: MemberStatus.ACTIVE,
        store_name: store.name,
        store_id: store.id,
        brand: nextNumber % 2 === 0 ? Brand.FIT365 : Brand.JOYFIT,
        joined_at: toIsoDate(now),
        contract_plan_name: application.plan_name || plan.name,
        contract_plan_id: plan.id,
        last_visit_date: undefined,
        has_unpaid: false,
      });
      this._members.push(row);
      return row;
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

      // Ensure members are seeded first so contracts can reference them
      db.members._seed();

      const members = db.members._members;
      for (let i = 0; i < members.length; i++) {
        const m = members[i]!;
        const meta = m._listMeta;
        const planName = meta?.contract_plan_name ?? 'ベーシックプラン';
        const joinedAt = m.profile.joined_at;

        const createdAt = new Date(joinedAt + 'T00:00:00.000Z').toISOString();
        const monthlyFee = planName.includes('プレミアム')
          ? 12000
          : planName.includes('スタンダード')
            ? 8580
            : 6580;

        const contractId = `CONTRACT-${m.basic_info.id}`;
        const data = buildMemberContractData({
          plan_name: planName,
          start_date: joinedAt,
          monthly_fee: monthlyFee,
          created_at: createdAt,
        });

        // Add a couple of deterministic options for some members
        if (i % 10 === 0) {
          data.option_contracts.push({
            id: `opt-${m.basic_info.id}-001`,
            name: 'パーソナルトレーニング',
            monthly_fee: 11000,
            start_date: joinedAt,
            next_billing_date: toIsoDate(addMonths(new Date(joinedAt), 1)),
          });
          data.option_change_history.push({
            changed_at: createdAt,
            option_name: 'パーソナルトレーニング',
            action_type: 'add',
            notes: 'オプション追加',
          });
        }

        this._contracts.push({
          contract_id: contractId,
          member_id: m.basic_info.id,
          created_at: createdAt,
          data,
        });
      }
    },

    getByMemberId(memberId: string): GetContractsResponse | undefined {
      this._seed();
      const row = this._contracts.find((c) => c.member_id === memberId);
      return row?.data;
    },

    create(input: {
      contract_id: string;
      member_id: string;
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
      this._contracts.unshift(row);
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

      const monthlyFee = application.plan_name?.includes('プレミアム')
        ? 12000
        : application.plan_name?.includes('スタンダード')
          ? 8580
          : 6580;

      const data = buildMemberContractData({
        plan_name: application.plan_name,
        start_date: application.scheduled_start_date,
        monthly_fee: monthlyFee,
        created_at: createdAt,
      });

      this.create({
        contract_id: contractId,
        member_id,
        application_id: application.id,
        data,
      });

      return { member_id, contract_id: contractId };
    },
  },

  membershipApplications: {
    _applications: [] as MembershipApplication[],
    _details: {} as Record<
      string,
      Partial<{
        // Basic info
        applicant_name: string;
        gender: 'male' | 'female' | 'other' | 'unknown';
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
        contract_details: {
          plan_id: string;
          plan_name: string;
          start_date: string; // YYYY-MM-DD
          option_ids?: string[];
        };
      }>
    >,
    _seeded: false,

    _seed(): void {
      if (this._seeded) return;
      this._seeded = true;
      const names = ['山田太郎', '佐藤花子', '鈴木一郎', '田中次郎', '中村三郎'];
      const plans = ['通常会員', 'プレミアム会員', 'ベーシックプラン'];
      const riskReasons = [
        'ブラックリスト一致',
        '重複申込',
        '決済失敗',
        '高リスクスコア',
        '書類問題',
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
        appliedDate.setHours(12 - (i % 12), i % 60, 0);
        const scheduledStart = new Date(appliedDate);
        scheduledStart.setDate(scheduledStart.getDate() + 5);
        const elapsedHours = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60));
        const elapsedDays = Math.floor(elapsedHours / 24);
        const remainingHours = elapsedHours % 24;
        const elapsedTime =
          elapsedDays > 0 ? `${elapsedDays}日${remainingHours}時間経過` : `${elapsedHours}時間経過`;
        const status = statuses[i % statuses.length];
        const deadline = new Date(appliedDate);
        deadline.setDate(deadline.getDate() + 7);
        this._applications.push({
          id: `APP-${String(i).padStart(5, '0')}`,
          applicant_name: names[i % names.length],
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
        // Seed editable detail fields (used by detail/edit screen)
        this._details[id] = {
          gender: i % 2 === 0 ? 'male' : 'female',
          blood_type: (['A', 'B', 'O', 'AB'] as const)[i % 4],
          birthday: `199${i % 10}-0${(i % 9) + 1}-15`,
          applicant_email: `applicant${String(i).padStart(5, '0')}@example.jp`,
          applicant_phone: '090-1234-5678',
          applicant_address: '東京都渋谷区1-2-3',
          emergency_contact_name: '佐藤 太郎',
          emergency_contact_relationship: '夫',
          emergency_contact_phone: '090-8765-4321',
          contract_details: {
            plan_id: `plan-00${(i % 3) + 1}`,
            plan_name: plans[i % plans.length],
            start_date: scheduledStart.toISOString().split('T')[0],
            option_ids: [],
          },
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
};

// Seed mock data immediately at module load time
db.members._seed();
db.contracts._seed();
db.membershipApplications._seed();
