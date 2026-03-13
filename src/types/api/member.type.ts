// Member Types based on spec

export enum MemberType {
  REGULAR = 'regular', // 通常会員
  FAMILY = 'family', // 家族会員
  CORPORATE = 'corporate', // 法人会員
  COMPANY_DISCOUNT = 'company_discount', // 社割会員
}

export enum MemberStatus {
  ACTIVE = 'active', // 利用中
  SUSPENDED = 'suspended', // 休会中
  WITHDRAWN = 'withdrawn', // 退会済み
  FORCE_WITHDRAWN = 'force_withdrawn', // 強制退会済み
}

export enum Brand {
  JOYFIT = 'joyfit',
  FIT365 = 'fit365',
}

export enum MemoType {
  CAUTION = 'caution', // 要注意
  VIP = 'vip',
  OTHER = 'other', // その他
}

export enum PointAdjustmentType {
  ADD = 'add', // 付与
  SUBTRACT = 'subtract', // 減算
}

// Basic Member Info
export interface MemberBasicInfo {
  id: string;
  member_number: string;
  name_kanji: string;
  name_kana: string;
  birthday: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  postal_code?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  building?: string;
  phone: string;
  email: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

// Member Profile
export interface MemberProfile {
  member_type: MemberType;
  status: MemberStatus;
  store_id: string;
  store_name: string;
  brand: Brand;
  joined_at: string;
  withdrawn_at?: string;
  is_black_listed: boolean;
}

// eKYC Info
export interface MemberEKYC {
  verified: boolean;
  verified_at?: string;
  document_type?: string;
  photoUrl?: string;
}

// Consent Info
export interface MemberConsent {
  member_agreement: {
    version: string;
    agreed_at: string;
  };
  privacy_policy: {
    version: string;
    agreed_at: string;
  };
  optional_agreement?: {
    version: string;
    agreed_at: string;
  };
  marketing_consent: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Health Info
export interface MemberHealthInfo {
  health_status?: string;
  medical_history?: string;
  allergies?: string;
  exercise_restrictions?: string;
  other_notes?: string;
}

// Contract Info
export interface MainContract {
  plan_name: string;
  monthly_fee: number;
  start_date: string;
  penalty_period_end?: string;
  change_history: ContractChange[];
}

export interface ContractChange {
  changed_at: string;
  previous_plan: string;
  new_plan: string;
  reason?: string;
}

export interface OptionContract {
  id: string;
  name: string;
  monthly_fee: number;
  start_date: string;
  next_billing_date: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'bank_transfer';
  card_number?: string; // masked, last 4 digits only
  cardholder_name?: string;
  expiry_date?: string;
  billing_day: number;
  last_payment_date?: string;
  last_payment_amount?: number;
  status: 'normal' | 'error';
  payment_history: PaymentRecord[];
}

export interface PaymentRecord {
  date: string;
  amount: number;
  breakdown: string;
  status: 'success' | 'failed';
  notes?: string;
}

// Points Info
export interface MemberPoints {
  current_balance: number;
  total_earned: number;
  total_spent: number;
  rank?: {
    current: string;
    benefits: string;
    next_rank?: {
      required_points: number;
      progress: number;
    };
  };
}

export interface PointHistory {
  id: string;
  date: string;
  type: 'earn' | 'spend' | 'adjust';
  reason: string;
  points: number;
  notes?: string;
  adjusted_by?: string; // for manual adjustments
}

// Usage History
export interface UsageSummary {
  total_visits: number; // last 3 months
  average_stay_time: number; // minutes
  last_visit_date?: string;
  frequent_time_slot?: string;
  frequent_day_of_week?: string;
}

export interface StoreUsage {
  store_id: string;
  store_name: string;
  visit_count: number;
  usage_rate: number; // percentage
  average_stay_time: number;
}

export interface VisitRecord {
  id: string;
  entry_time: string;
  exit_time?: string;
  stay_time?: number; // minutes
  store_id: string;
  store_name: string;
  entry_method: 'qr_code' | 'face_recognition' | 'member_number';
}

// Training Records
export interface TrainingSummary {
  recorded_days: number; // last month
  total_training_time: number; // minutes
  average_training_time: number;
  frequent_exercises: string[];
}

export interface StrengthTrainingRecord {
  id: string;
  date: string;
  exercise_name: string;
  weight?: number;
  reps?: number;
  sets?: number;
  notes?: string;
}

export interface CardioRecord {
  id: string;
  date: string;
  exercise_type: string;
  duration: number; // minutes
  distance?: number; // km
  calories?: number;
}

export interface BodyRecord {
  id: string;
  date: string;
  weight?: number;
  body_fat?: number; // percentage
  muscle_mass?: number; // kg
  bmi?: number;
  notes?: string;
}

// Service Usage
export interface PersonalTraining {
  reservations: PTReservation[];
  history: PTHistory[];
}

export interface PTReservation {
  id: string;
  date: string;
  trainer_name: string;
  status: 'reserved' | 'completed' | 'cancelled';
  menu?: string;
}

export interface PTHistory {
  id: string;
  date: string;
  trainer_name: string;
  menu?: string;
  feedback?: string;
  rating?: number; // 1-5
}

export interface StudioProgram {
  participation_history: ProgramParticipation[];
  reservation_history: ProgramReservation[];
}

export interface ProgramParticipation {
  id: string;
  date: string;
  program_name: string;
  instructor_name: string;
  participants: number;
  rating?: number;
}

export interface ProgramReservation {
  id: string;
  date: string;
  program_name: string;
  action: 'reserve' | 'cancel';
}

export interface OtherServiceUsage {
  tanning: TanningUsage[];
  locker: LockerUsage[];
  purchases: PurchaseRecord[];
}

export interface TanningUsage {
  id: string;
  date: string;
  duration: number; // minutes
  store_id: string;
  store_name: string;
}

export interface LockerUsage {
  locker_number: string;
  start_date: string;
  status: 'active' | 'inactive';
}

export interface PurchaseRecord {
  id: string;
  date: string;
  product_name: string;
  quantity: number;
  amount: number;
  payment_method: string;
}

// Communication
export interface InquiryRecord {
  id: string;
  date: string;
  content: string;
  staff_name: string;
  result?: string;
  status: 'in_progress' | 'completed';
}

export interface StaffMemo {
  id: string;
  date: string;
  type: MemoType;
  content: string;
  created_by: string;
}

export interface NotificationHistory {
  emails: EmailHistory[];
  sms: SMSHistory[];
  push: PushHistory[];
}

export interface EmailHistory {
  id: string;
  sent_at: string;
  subject: string;
  opened: boolean;
  status: 'success' | 'failed';
}

export interface SMSHistory {
  id: string;
  sent_at: string;
  content: string;
  status: 'success' | 'failed';
}

export interface PushHistory {
  id: string;
  sent_at: string;
  title: string;
  opened: boolean;
}

export interface PhoneRecord {
  id: string;
  date: string;
  content: string;
  staff_name: string;
  result?: string;
}

// Change History
export interface ChangeHistoryItem {
  id: string;
  date: string;
  event_type: string;
  content: string;
  details?: Record<string, any>;
}

export interface MembershipHistory {
  joined_at: string;
  join_route: 'web' | 'store' | 'referral';
  join_store: string;
  campaign?: string;
  referrer?: string;
}

export interface TransferHistory {
  date: string;
  from_store: string;
  to_store: string;
  type: 'auto' | 'member_request' | 'admin_selected';
  reason?: string;
  risk_score?: number;
}

export interface SuspensionHistory {
  start_date: string;
  end_date?: string;
  reason?: string;
  applied_at: string;
}

export interface WithdrawalHistory {
  date: string;
  reason?: string;
  type: 'normal' | 'force';
}

export interface EditHistory {
  date: string;
  field: string;
  old_value: string;
  new_value: string;
  edited_by: string;
}

// Relationships
export interface FamilyRelationship {
  parent_member?: {
    id: string;
    member_number: string;
    name: string;
    relationship: string;
    status: MemberStatus;
  };
  children: Array<{
    id: string;
    member_number: string;
    name: string;
    relationship: string;
    status: MemberStatus;
  }>;
  current_count: number;
  max_count: number;
}

export interface CorporateRelationship {
  company_name: string;
  company_number?: string;
  contract_type: string;
  discount_rate?: number;
  contact_person?: {
    department: string;
    name: string;
  };
}

export interface ReferralRelationship {
  as_referrer: {
    referrals: Array<{
      id: string;
      member_number: string;
      name: string;
      referred_at: string;
      joined: boolean;
      points_earned?: number;
    }>;
    summary: {
      total_referrals: number;
      total_points: number;
    };
  };
  as_referee?: {
    referrer: {
      id: string;
      member_number: string;
      name: string;
      referred_at: string;
    };
    benefits?: string;
  };
}

// Full Member
export interface Member {
  basic_info: MemberBasicInfo;
  profile: MemberProfile;
  ekyc?: MemberEKYC;
  consent?: MemberConsent;
  health_info?: MemberHealthInfo;
}

// API Request/Response Types
export interface GetMembersRequest {
  page?: number;
  limit?: number;
  search?: string;
  member_type?: MemberType[];
  status?: MemberStatus[];
  brand?: Brand[];
  store_id?: string[];
  contract_plan_id?: string[];
  last_visit_days?: number; // 1 week = 7, 1 month = 30, etc.
  has_unpaid?: boolean;
  sort_by?: 'member_number' | 'joined_at' | 'last_visit' | 'name';
  sort_order?: 'asc' | 'desc';
}

export interface GetMembersResponse {
  members: Array<{
    id: string;
    member_number: string;
    name_kanji: string;
    name_kana: string;
    member_type: MemberType;
    status: MemberStatus;
    store_name: string;
    brand: Brand;
    contract_plan_name?: string;
    joined_at: string;
    last_visit_date?: string;
    has_unpaid: boolean;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface GetMemberDetailResponse {
  member: Member;
}

export interface UpdateBasicInfoRequest {
  name_kanji?: string;
  name_kana?: string;
  postal_code?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  building?: string;
  phone?: string;
  email?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UpdateHealthInfoRequest {
  health_status?: string;
  medical_history?: string;
  allergies?: string;
  exercise_restrictions?: string;
  other_notes?: string;
}

export interface UpdateMarketingConsentRequest {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
}

export interface PointAdjustmentRequest {
  type: PointAdjustmentType;
  points: number;
  reason: string; // 10-500 characters
}

export interface CreateMemoRequest {
  type: MemoType;
  content: string; // 1-1000 characters
}

export interface UpdateMemoRequest {
  type?: MemoType;
  content?: string;
}

export interface ExportMembersRequest {
  format: 'csv' | 'excel';
  target: 'selected' | 'filtered';
  member_ids?: string[];
  fields: string[];
}
