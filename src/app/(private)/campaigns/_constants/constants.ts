import { StoreListBrand } from '@/lib/api/types.gen';

export { StoreListBrand } from '@/lib/api/types.gen';

export type CampaignAcceptStatus = 'active' | 'inactive';

export const CAMPAIGN_BRAND_LABELS: Record<StoreListBrand, string> = {
  [StoreListBrand.JOYFIT]: 'JOYFIT',
  [StoreListBrand.FIT365]: 'FIT365',
  [StoreListBrand.JOYFIT24]: 'JOYFIT24',
  [StoreListBrand.JOYFIT_YOGA]: 'JOYFIT YOGA',
  [StoreListBrand.JOYFIT_PLUS]: 'JOYFIT+',
};

export const CAMPAIGN_ACCEPT_STATUS_LABELS: Record<CampaignAcceptStatus, string> = {
  active: '受付中',
  inactive: '受付停止',
};

export const CAMPAIGN_ACCEPT_STATUS_BADGE_CLASSES: Record<CampaignAcceptStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-zinc-100 text-zinc-600 border-zinc-200',
};

export const CAMPAIGN_ACCEPT_STATUS_VALUES = ['active', 'inactive'] as const;
