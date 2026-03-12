import { GetCrmMembersData } from '@/lib/api';

export const MEMBER_COLUMNS = [
  { id: 'id', label: '利用者ID', sortable: true },
  { id: 'memberNo', label: 'オカモトID', sortable: true },
  { id: 'name', label: '利用者名', sortable: true, align: 'center' as const },
  { id: 'type', label: '会員種別', sortable: true },
  { id: 'status', label: '会員ステータス', sortable: true },
];

export const STORE_OPTIONS = [
  { label: 'Fit365八潮店', value: 'fit365' },
  { label: 'JOYFIT24 門前仲町', value: 'joyfit' },
];

export const MEMBER_TYPE_OPTIONS = [
  { label: 'すべて', value: 'all' },
  { label: '通常会員', value: 'normal' },
  { label: '家族会員', value: 'family' },
  { label: '法人会員', value: 'corporate' },
  { label: '社割会員', value: 'staff' },
];

export const STATUS_OPTIONS = [
  { label: 'すべて', value: 'all' },
  { label: '利用中', value: 'active' },
  { label: '休会中', value: 'pause' },
  { label: '退会済み', value: 'exit' },
  { label: '強制退会済み', value: 'forced' },
];

export const VISIT_HISTORY_OPTIONS = [
  { label: 'すべて', value: 'all' },
  { label: '1週間以内', value: '1_week' },
  { label: '1ヶ月以内', value: '1_month' },
  { label: '3ヶ月以上なし', value: 'over_3_months' },
];

export const INITIAL_FILTERS: Partial<NonNullable<GetCrmMembersData['query']>> = {
  search: undefined,
  storeId: undefined,
  memberType: undefined,
  status: undefined,
  lastVisitDays: undefined,
};
