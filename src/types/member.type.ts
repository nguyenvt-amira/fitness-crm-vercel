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

export interface StaffMemo {
  id: string;
  date: string;
  type: MemoType;
  content: string;
  created_by: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: '男性',
  [Gender.FEMALE]: '女性',
  [Gender.OTHER]: 'その他',
};
