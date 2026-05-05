import type { MembershipApplicationStatus } from '@/types/api/membership-application.type';

export const STATUS_BADGE_CLASSES: Record<MembershipApplicationStatus, string> = {
  未審査: 'bg-warning/15 text-warning border-warning/20',
  審査中: 'bg-info/15 text-info border-info/20',
  承認済: 'bg-success/15 text-success border-success/20',
  否認: 'bg-destructive/15 text-destructive border-destructive/20',
  取り消し済: 'bg-muted text-muted-foreground border-border',
};

export const STATUS_OPTIONS: { label: string; value: MembershipApplicationStatus | '' }[] = [
  { label: '全ステータス', value: '' },
  { label: '未審査', value: '未審査' },
  { label: '審査中', value: '審査中' },
  { label: '承認済', value: '承認済' },
  { label: '否認', value: '否認' },
  { label: '取り消し済', value: '取り消し済' },
];

export const BRAND_OPTIONS = [
  { label: '全ブランド', value: '' },
  { label: 'FIT365', value: 'FIT365' },
  { label: 'JOYFIT', value: 'JOYFIT' },
];

export const BLACKLIST_OPTIONS = [
  { label: '全申請', value: 'all' as const },
  { label: 'BL一致のみ', value: 'match' as const },
  { label: 'BL一致なし', value: 'no_match' as const },
];

export const IN_QUEUE_STATUSES: MembershipApplicationStatus[] = ['未審査', '審査中'];
