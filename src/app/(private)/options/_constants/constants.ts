import { OptionStatus, OptionType, OptionUsageRule } from '@/lib/api/types.gen';

export { OptionStatus, OptionType, OptionUsageRule } from '@/lib/api/types.gen';

export const OPTION_TYPE_LABELS: Record<OptionType, string> = {
  [OptionType.STANDARD]: '通常',
  [OptionType.METERED]: '都次',
  [OptionType.AUTO_ATTACHED]: '自動付与',
};

export const OPTION_TYPE_BADGE_CLASSES: Record<OptionType, string> = {
  [OptionType.STANDARD]: '',
  [OptionType.METERED]: 'bg-warning/15 text-warning border-warning/20',
  [OptionType.AUTO_ATTACHED]: 'bg-success/15 text-success border-success/20',
};

export const OPTION_STATUS_LABELS: Record<OptionStatus, string> = {
  [OptionStatus.ACTIVE]: '有効',
  [OptionStatus.INACTIVE]: '無効',
};

export const OPTION_STATUS_BADGE_CLASSES: Record<OptionStatus, string> = {
  [OptionStatus.ACTIVE]: 'bg-success/15 text-success border-success/20',
  [OptionStatus.INACTIVE]: 'bg-muted text-muted-foreground border-border',
};

export const OPTION_USAGE_RULE_LABELS: Record<OptionUsageRule, string> = {
  [OptionUsageRule.DISABLED]: '利用不可',
  [OptionUsageRule.ADD_REMOVE]: '追加・解約のみ',
  [OptionUsageRule.ADD_REMOVE_CHANGE]: '追加・解約・変更',
  [OptionUsageRule.CHANGE_REMOVE]: '変更・解約のみ',
};
