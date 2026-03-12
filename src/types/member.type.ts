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
  memberNumber: string;
  nameKanji: string;
  nameKana: string;
  birthday: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  postalCode?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  building?: string;
  phone: string;
  email: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

// Member Profile
export interface MemberProfile {
  memberType: MemberType;
  status: MemberStatus;
  storeId: string;
  storeName: string;
  brand: Brand;
  joinedAt: string;
  withdrawnAt?: string;
  isBlacklisted: boolean;
}

// eKYC Info
export interface MemberEKYC {
  verified: boolean;
  verifiedAt?: string;
  documentType?: string;
  photoUrl?: string;
}

// Consent Info
export interface MemberConsent {
  memberAgreement: {
    version: string;
    agreedAt: string;
  };
  privacyPolicy: {
    version: string;
    agreedAt: string;
  };
  optionalAgreement?: {
    version: string;
    agreedAt: string;
  };
  marketingConsent: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Health Info
export interface MemberHealthInfo {
  healthStatus?: string;
  medicalHistory?: string;
  allergies?: string;
  exerciseRestrictions?: string;
  otherNotes?: string;
}

// Contract Info
export interface MainContract {
  planName: string;
  monthlyFee: number;
  startDate: string;
  penaltyPeriodEnd?: string;
  changeHistory: ContractChange[];
}

export interface ContractChange {
  changedAt: string;
  previousPlan: string;
  newPlan: string;
  reason?: string;
}

export interface OptionContract {
  id: string;
  name: string;
  monthlyFee: number;
  startDate: string;
  nextBillingDate: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'bank_transfer';
  cardNumber?: string; // masked, last 4 digits only
  cardholderName?: string;
  expiryDate?: string;
  billingDay: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  status: 'normal' | 'error';
  paymentHistory: PaymentRecord[];
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
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  rank?: {
    current: string;
    benefits: string;
    nextRank?: {
      requiredPoints: number;
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
  adjustedBy?: string; // for manual adjustments
}

// Usage History
export interface UsageSummary {
  totalVisits: number; // last 3 months
  averageStayTime: number; // minutes
  lastVisitDate?: string;
  frequentTimeSlot?: string;
  frequentDayOfWeek?: string;
}

export interface StoreUsage {
  storeId: string;
  storeName: string;
  visitCount: number;
  usageRate: number; // percentage
  averageStayTime: number;
}

export interface VisitRecord {
  id: string;
  entryTime: string;
  exitTime?: string;
  stayTime?: number; // minutes
  storeId: string;
  storeName: string;
  entryMethod: 'qr_code' | 'face_recognition' | 'member_number';
}

// Training Records
export interface TrainingSummary {
  recordedDays: number; // last month
  totalTrainingTime: number; // minutes
  averageTrainingTime: number;
  frequentExercises: string[];
}

export interface StrengthTrainingRecord {
  id: string;
  date: string;
  exerciseName: string;
  weight?: number;
  reps?: number;
  sets?: number;
  notes?: string;
}

export interface CardioRecord {
  id: string;
  date: string;
  exerciseType: string;
  duration: number; // minutes
  distance?: number; // km
  calories?: number;
}

export interface BodyRecord {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number; // percentage
  muscleMass?: number; // kg
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
  trainerName: string;
  status: 'reserved' | 'completed' | 'cancelled';
  menu?: string;
}

export interface PTHistory {
  id: string;
  date: string;
  trainerName: string;
  menu?: string;
  feedback?: string;
  rating?: number; // 1-5
}

export interface StudioProgram {
  participationHistory: ProgramParticipation[];
  reservationHistory: ProgramReservation[];
}

export interface ProgramParticipation {
  id: string;
  date: string;
  programName: string;
  instructorName: string;
  participants: number;
  rating?: number;
}

export interface ProgramReservation {
  id: string;
  date: string;
  programName: string;
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
  storeId: string;
  storeName: string;
}

export interface LockerUsage {
  lockerNumber: string;
  startDate: string;
  status: 'active' | 'inactive';
}

export interface PurchaseRecord {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
}

// Communication
export interface InquiryRecord {
  id: string;
  date: string;
  content: string;
  staffName: string;
  result?: string;
  status: 'in_progress' | 'completed';
}

export interface StaffMemo {
  id: string;
  date: string;
  type: MemoType;
  content: string;
  createdBy: string;
}

export interface NotificationHistory {
  emails: EmailHistory[];
  sms: SMSHistory[];
  push: PushHistory[];
}

export interface EmailHistory {
  id: string;
  sentAt: string;
  subject: string;
  opened: boolean;
  status: 'success' | 'failed';
}

export interface SMSHistory {
  id: string;
  sentAt: string;
  content: string;
  status: 'success' | 'failed';
}

export interface PushHistory {
  id: string;
  sentAt: string;
  title: string;
  opened: boolean;
}

export interface PhoneRecord {
  id: string;
  date: string;
  content: string;
  staffName: string;
  result?: string;
}

// Change History
export interface ChangeHistoryItem {
  id: string;
  date: string;
  eventType: string;
  content: string;
  details?: Record<string, any>;
}

export interface MembershipHistory {
  joinedAt: string;
  joinRoute: 'web' | 'store' | 'referral';
  joinStore: string;
  campaign?: string;
  referrer?: string;
}

export interface TransferHistory {
  date: string;
  fromStore: string;
  toStore: string;
  type: 'auto' | 'member_request' | 'admin_selected';
  reason?: string;
  riskScore?: number;
}

export interface SuspensionHistory {
  startDate: string;
  endDate?: string;
  reason?: string;
  appliedAt: string;
}

export interface WithdrawalHistory {
  date: string;
  reason?: string;
  type: 'normal' | 'force';
}

export interface EditHistory {
  date: string;
  field: string;
  oldValue: string;
  newValue: string;
  editedBy: string;
}

// Relationships
export interface FamilyRelationship {
  parentMember?: {
    id: string;
    memberNumber: string;
    name: string;
    relationship: string;
    status: MemberStatus;
  };
  children: Array<{
    id: string;
    memberNumber: string;
    name: string;
    relationship: string;
    status: MemberStatus;
  }>;
  currentCount: number;
  maxCount: number;
}

export interface CorporateRelationship {
  companyName: string;
  companyNumber?: string;
  contractType: string;
  discountRate?: number;
  contactPerson?: {
    department: string;
    name: string;
  };
}

export interface ReferralRelationship {
  asReferrer: {
    referrals: Array<{
      id: string;
      memberNumber: string;
      name: string;
      referredAt: string;
      joined: boolean;
      pointsEarned?: number;
    }>;
    summary: {
      totalReferrals: number;
      totalPoints: number;
    };
  };
  asReferee?: {
    referrer: {
      id: string;
      memberNumber: string;
      name: string;
      referredAt: string;
    };
    benefits?: string;
  };
}

// Full Member
export interface Member {
  basicInfo: MemberBasicInfo;
  profile: MemberProfile;
  ekyc?: MemberEKYC;
  consent?: MemberConsent;
  healthInfo?: MemberHealthInfo;
}

// API Request/Response Types
export interface GetMembersRequest {
  page?: number;
  limit?: number;
  search?: string;
  memberType?: MemberType[];
  status?: MemberStatus[];
  brand?: Brand[];
  storeId?: string[];
  contractPlanId?: string[];
  lastVisitDays?: number; // 1 week = 7, 1 month = 30, etc.
  hasUnpaid?: boolean;
  sortBy?: 'member_number' | 'joined_at' | 'last_visit' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface GetMembersResponse {
  members: Array<{
    id: string;
    memberNumber: string;
    nameKanji: string;
    nameKana: string;
    memberType: MemberType;
    status: MemberStatus;
    storeName: string;
    brand: Brand;
    contractPlanName?: string;
    joinedAt: string;
    lastVisitDate?: string;
    hasUnpaid: boolean;
    phone?: string;
    email?: string;
    storeId: string;
    contractPlanId: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetMemberDetailResponse {
  member: Member;
}

export interface UpdateBasicInfoRequest {
  nameKanji?: string;
  nameKana?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  building?: string;
  phone?: string;
  email?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UpdateHealthInfoRequest {
  healthStatus?: string;
  medicalHistory?: string;
  allergies?: string;
  exerciseRestrictions?: string;
  otherNotes?: string;
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
  memberIds?: string[];
  fields: string[];
}
