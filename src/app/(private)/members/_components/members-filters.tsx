'use client';

import { ChevronDown, QrCode, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Brand, MemberStatus, MemberType } from '@/types/member.type';

interface MembersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchExecute: () => void;
  onQRScan: () => void;
  memberType: MemberType[];
  onMemberTypeChange: (value: MemberType[]) => void;
  status: MemberStatus[];
  onStatusChange: (value: MemberStatus[]) => void;
  brand: Brand[];
  onBrandChange: (value: Brand[]) => void;
  storeId: string[];
  onStoreIdChange: (value: string[]) => void;
  contractPlanId: string[];
  onContractPlanIdChange: (value: string[]) => void;
  lastVisitDays?: number;
  onLastVisitDaysChange: (value: number | undefined) => void;
  hasUnpaid?: boolean;
  onHasUnpaidChange: (value: boolean | undefined) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
  selectedCount: number;
  totalCount: number;
  onExport: () => void;
  onBulkEmail: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  [MemberType.REGULAR]: '通常会員',
  [MemberType.FAMILY]: '家族会員',
  [MemberType.CORPORATE]: '法人会員',
  [MemberType.COMPANY_DISCOUNT]: '社割会員',
};

const STATUS_LABELS: Record<MemberStatus, string> = {
  [MemberStatus.ACTIVE]: '利用中',
  [MemberStatus.SUSPENDED]: '休会中',
  [MemberStatus.WITHDRAWN]: '退会済み',
  [MemberStatus.FORCE_WITHDRAWN]: '強制退会済み',
};

const BRAND_LABELS: Record<Brand, string> = {
  [Brand.JOYFIT]: 'JOYFIT',
  [Brand.FIT365]: 'FIT365',
};

// Mock stores data
const MOCK_STORES = [
  { id: 'store-001', name: 'Fit365八潮店' },
  { id: 'store-002', name: 'Fit365新宿店' },
  { id: 'store-003', name: 'Fit365渋谷店' },
  { id: 'store-004', name: 'JOYFIT池袋店' },
];

// Mock contract plans
const MOCK_CONTRACT_PLANS = [
  { id: 'plan-001', name: 'ベーシックプラン' },
  { id: 'plan-002', name: 'スタンダードプラン' },
  { id: 'plan-003', name: 'プレミアムプラン' },
];

const LAST_VISIT_OPTIONS = [
  { value: 7, label: '1週間以内' },
  { value: 30, label: '1ヶ月以内' },
  { value: 90, label: '3ヶ月以内' },
  { value: -1, label: '3ヶ月以上' }, // -1 means 90+ days
];

export function MembersFilters({
  search,
  onSearchChange,
  onSearchExecute,
  onQRScan,
  memberType,
  onMemberTypeChange,
  status,
  onStatusChange,
  brand,
  onBrandChange,
  storeId,
  onStoreIdChange,
  contractPlanId,
  onContractPlanIdChange,
  lastVisitDays,
  onLastVisitDaysChange,
  hasUnpaid,
  onHasUnpaidChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedCount,
  totalCount,
  onExport,
  onBulkEmail,
  hasActiveFilters,
  onClearFilters,
}: MembersFiltersProps) {
  return (
    <div className="space-y-2">
      {/* Search Bar and Filters */}
      <Card className="rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="会員番号、氏名、電話番号、メールで検索"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchExecute();
                  }
                }}
                className="h-9 rounded-lg pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={onQRScan} title="QRコード読み取り">
              <QrCode className="size-4" />
            </Button>
            <Button variant="outline" onClick={onSearchExecute}>
              検索実行
            </Button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 会員種別 */}
            <Select
              value={memberType.length > 0 ? memberType[0] : undefined}
              onValueChange={(value) => {
                const newTypes = memberType.includes(value as MemberType)
                  ? memberType.filter((t) => t !== value)
                  : [...memberType, value as MemberType];
                onMemberTypeChange(newTypes);
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">会員種別:</span>
                  <SelectValue placeholder="すべて">
                    {memberType.length > 0 ? MEMBER_TYPE_LABELS[memberType[0] as MemberType] : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEMBER_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 会員ステータス */}
            <Select
              value={status.length > 0 ? status[0] : undefined}
              onValueChange={(value) => {
                const newStatus = status.includes(value as MemberStatus)
                  ? status.filter((s) => s !== value)
                  : [...status, value as MemberStatus];
                onStatusChange(newStatus);
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">ステータス:</span>
                  <SelectValue placeholder="すべて">
                    {status.length > 0 ? STATUS_LABELS[status[0] as MemberStatus] : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 所属店舗 */}
            <Select
              value={storeId.length > 0 ? storeId[0] : undefined}
              onValueChange={(value) => {
                const newStores = storeId.includes(value)
                  ? storeId.filter((s) => s !== value)
                  : [...storeId, value];
                onStoreIdChange(newStores);
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">店舗:</span>
                  <SelectValue placeholder="Fit365八潮店">
                    {storeId.length > 0 ? MOCK_STORES.find((s) => s.id === storeId[0])?.name : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {MOCK_STORES.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ブランド */}
            <Select
              value={brand.length > 0 ? brand[0] : undefined}
              onValueChange={(value) => {
                const newBrand = brand.includes(value as Brand)
                  ? brand.filter((b) => b !== value)
                  : [...brand, value as Brand];
                onBrandChange(newBrand);
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">ブランド:</span>
                  <SelectValue placeholder="すべて">
                    {brand.length > 0 ? BRAND_LABELS[brand[0] as Brand] : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BRAND_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 契約プラン */}
            <Select
              value={contractPlanId.length > 0 ? contractPlanId[0] : undefined}
              onValueChange={(value) => {
                const newPlans = contractPlanId.includes(value)
                  ? contractPlanId.filter((p) => p !== value)
                  : [...contractPlanId, value];
                onContractPlanIdChange(newPlans);
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">契約プラン:</span>
                  <SelectValue placeholder="すべて">
                    {contractPlanId.length > 0
                      ? MOCK_CONTRACT_PLANS.find((p) => p.id === contractPlanId[0])?.name
                      : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {MOCK_CONTRACT_PLANS.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 最終来館日 */}
            <Select
              value={lastVisitDays !== undefined ? lastVisitDays.toString() : undefined}
              onValueChange={(value) => {
                onLastVisitDaysChange(Number(value));
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">最終来館日:</span>
                  <SelectValue placeholder="すべて">
                    {lastVisitDays !== undefined
                      ? LAST_VISIT_OPTIONS.find((opt) => opt.value === lastVisitDays)?.label
                      : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {LAST_VISIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 未納有無 */}
            <Select
              value={hasUnpaid !== undefined ? (hasUnpaid === true ? 'yes' : 'no') : undefined}
              onValueChange={(value) => {
                if (value === 'yes') {
                  onHasUnpaidChange(true);
                } else if (value === 'no') {
                  onHasUnpaidChange(false);
                } else {
                  onHasUnpaidChange(undefined);
                }
              }}
            >
              <SelectTrigger className="h-9 w-[178px] rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">未納有無:</span>
                  <SelectValue placeholder="すべて">
                    {hasUnpaid === true ? 'あり' : hasUnpaid === false ? 'なし' : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">あり</SelectItem>
                <SelectItem value="no">なし</SelectItem>
              </SelectContent>
            </Select>

            {/* ソート選択 */}
            <Select
              value={`${sortBy}_${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split('_') as [string, 'asc' | 'desc'];
                onSortChange(field, order);
              }}
            >
              <SelectTrigger className="h-9 w-[180px] rounded-lg">
                <SelectValue placeholder="ソート" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member_number_asc">会員番号（昇順）</SelectItem>
                <SelectItem value="member_number_desc">会員番号（降順）</SelectItem>
                <SelectItem value="joined_at_desc">入会日（新しい順）</SelectItem>
                <SelectItem value="joined_at_asc">入会日（古い順）</SelectItem>
                <SelectItem value="last_visit_desc">最終来館日（新しい順）</SelectItem>
                <SelectItem value="last_visit_asc">最終来館日（古い順）</SelectItem>
                <SelectItem value="name_asc">氏名（五十音順）</SelectItem>
              </SelectContent>
            </Select>

            {/* フィルタクリア */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9">
                すべてクリア
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 一括操作バー */}
      {selectedCount > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              {selectedCount}件選択中 / 全{totalCount}件
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onExport}>
                一括エクスポート
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkEmail}>
                一括メール送信
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
