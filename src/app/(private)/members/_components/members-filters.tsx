'use client';

import { QrCode, Search } from 'lucide-react';

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

import { useMembersFiltersContext } from '../_contexts/members-filters-context';
import { BRAND_LABELS, MEMBER_STATUS_LABELS, MEMBER_TYPE_LABELS } from '../_lib/constants';

interface MembersFiltersProps {
  onQRScan: () => void;
  selectedCount: number;
  totalCount: number;
  onExport: () => void;
  onBulkEmail: () => void;
}

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
  onQRScan,
  selectedCount,
  totalCount,
  onExport,
  onBulkEmail,
}: MembersFiltersProps) {
  const { filters, searchInput, setSearchInput, updateFilter, hasActiveFilters, clearFilters } =
    useMembersFiltersContext();

  const { member_type, status, brand, store_id, contract_plan_id, last_visit_days, has_unpaid } =
    filters;
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-9 rounded-lg pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={onQRScan} title="QRコード読み取り">
              <QrCode className="size-4" />
            </Button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 会員種別 */}
            <Select
              value={member_type.length > 0 ? member_type[0] : undefined}
              onValueChange={(value: MemberType) => {
                // const newTypes = memberType.includes(value as MemberType)
                //   ? memberType.filter((t) => t !== value)
                //   : [...memberType, value as MemberType];
                updateFilter('member_type', [value]);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">会員種別:</span>
                  <SelectValue placeholder="すべて">
                    {member_type.length > 0
                      ? MEMBER_TYPE_LABELS[member_type[0] as MemberType]
                      : null}
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
              onValueChange={(value: MemberStatus) => {
                // const newStatus = status.includes(value as MemberStatus)
                //   ? status.filter((s) => s !== value)
                //   : [...status, value as MemberStatus];
                updateFilter('status', [value]);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">ステータス:</span>
                  <SelectValue placeholder="すべて">
                    {status.length > 0 ? MEMBER_STATUS_LABELS[status[0] as MemberStatus] : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEMBER_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 所属店舗 */}
            <Select
              value={store_id.length > 0 ? store_id[0] : undefined}
              onValueChange={(value) => {
                // const newStores = storeId.includes(value)
                //   ? storeId.filter((s) => s !== value)
                //   : [...storeId, value];
                updateFilter('store_id', [value]);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">店舗:</span>
                  <SelectValue placeholder="すべて">
                    {store_id.length > 0
                      ? MOCK_STORES.find((s) => s.id === store_id[0])?.name
                      : null}
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
              onValueChange={(value: Brand) => {
                // const newBrand = brand.includes(value as Brand)
                //   ? brand.filter((b) => b !== value)
                //   : [...brand, value as Brand];
                updateFilter('brand', [value]);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
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
              value={contract_plan_id.length > 0 ? contract_plan_id[0] : undefined}
              onValueChange={(value) => {
                // const newPlans = contractPlanId.includes(value)
                //   ? contractPlanId.filter((p) => p !== value)
                //   : [...contractPlanId, value];
                updateFilter('contract_plan_id', [value]);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">契約プラン:</span>
                  <SelectValue placeholder="すべて">
                    {contract_plan_id.length > 0
                      ? MOCK_CONTRACT_PLANS.find((p) => p.id === contract_plan_id[0])?.name
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
              value={last_visit_days !== null ? last_visit_days.toString() : undefined}
              onValueChange={(value) => {
                updateFilter('last_visit_days', value ? Number(value) : null);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">最終来館日:</span>
                  <SelectValue placeholder="すべて">
                    {last_visit_days !== null
                      ? LAST_VISIT_OPTIONS.find((opt) => opt.value === last_visit_days)?.label
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
              value={has_unpaid !== null ? (has_unpaid === true ? 'yes' : 'no') : undefined}
              onValueChange={(value) => {
                if (value === 'yes') {
                  updateFilter('has_unpaid', true);
                } else if (value === 'no') {
                  updateFilter('has_unpaid', false);
                } else {
                  updateFilter('has_unpaid', null);
                }
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-sm">未納有無:</span>
                  <SelectValue placeholder="すべて">
                    {has_unpaid === true ? 'あり' : has_unpaid === false ? 'なし' : null}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">あり</SelectItem>
                <SelectItem value="no">なし</SelectItem>
              </SelectContent>
            </Select>

            {/* フィルタクリア */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
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
