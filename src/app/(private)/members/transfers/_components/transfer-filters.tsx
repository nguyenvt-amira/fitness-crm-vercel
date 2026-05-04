'use client';

import { ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useTransferFiltersContext } from '../_contexts/transfer-filters-context';

const MOCK_STORES = [
  { id: 'store-joyfit-001', name: 'JOYFIT池袋店' },
  { id: 'store-joyfit-002', name: 'JOYFIT新宿店' },
  { id: 'store-joyfit-003', name: 'JOYFIT渋谷店' },
  { id: 'store-joyfit-004', name: 'JOYFIT横浜店' },
  { id: 'store-fit365-001', name: 'FIT365八潮店' },
  { id: 'store-fit365-002', name: 'FIT365川口店' },
  { id: 'store-fit365-003', name: 'FIT365大宮店' },
  { id: 'store-fit365-004', name: 'FIT365越谷店' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: '申請中' },
  { value: 'from_store_approved', label: '店舗承認済' },
  { value: 'approved', label: '承認済' },
  { value: 'rejected', label: '却下' },
  { value: 'completed', label: '移籍完了' },
];

const APPLIED_PERIOD_OPTIONS = [
  { value: 'this_month', label: '今月' },
  { value: 'last_month', label: '先月' },
  { value: 'this_year', label: '今年' },
];

function filterActiveClass(isActive: boolean) {
  return isActive ? 'border-primary bg-primary/10 text-foreground' : '';
}

interface TransferFiltersProps {
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
}

export function TransferFilters({
  isFilterOpen,
  onFilterOpenChange,
}: Readonly<TransferFiltersProps>) {
  const { filters, searchInput, setSearchInput, updateFilter, clearFilters, activeFilterCount } =
    useTransferFiltersContext();

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Toolbar row */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-[400px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="申請ID・会員名で検索"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-8 pl-9 text-xs"
          />
        </div>
        <Button
          variant={activeFilterCount > 0 ? 'default' : 'outline'}
          size="sm"
          className="ml-auto h-8 gap-1 text-xs"
          onClick={() => onFilterOpenChange(!isFilterOpen)}
        >
          <SlidersHorizontal className="size-4" />
          {isFilterOpen ? (
            <>
              閉じる <ChevronUp className="size-3" />
            </>
          ) : (
            <>
              詳細フィルター <ChevronDown className="size-3" />
            </>
          )}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expandable filter bar */}
      {isFilterOpen && (
        <div className="flex flex-wrap items-center gap-2">
          {/* ステータス */}
          <Select
            value={filters.status ?? 'all'}
            onValueChange={(v) =>
              updateFilter('status', v === 'all' ? null : (v as typeof filters.status))
            }
          >
            <SelectTrigger
              className={`h-8 w-[140px] text-xs ${filterActiveClass(filters.status !== null)}`}
            >
              <SelectValue placeholder="全ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ステータス</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 移籍元店舗 */}
          <Select
            value={filters.from_store_id ?? 'all'}
            onValueChange={(v) => updateFilter('from_store_id', v === 'all ' ? null : v)}
          >
            <SelectTrigger
              className={`h-8 w-[160px] text-xs ${filterActiveClass(filters.from_store_id !== null)}`}
            >
              <SelectValue placeholder="全店舗（移籍元）" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全店舗（移籍元）</SelectItem>
              {MOCK_STORES.map((store) => (
                <SelectItem key={store.id} value={store.id} className="text-xs">
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 移籍先店舗 */}
          <Select
            value={filters.to_store_id ?? 'all'}
            onValueChange={(v) => updateFilter('to_store_id', v === 'all' ? null : v)}
          >
            <SelectTrigger
              className={`h-8 w-[160px] text-xs ${filterActiveClass(filters.to_store_id !== null)}`}
            >
              <SelectValue placeholder="全店舗（移籍先）" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全店舗（移籍先）</SelectItem>
              {MOCK_STORES.map((store) => (
                <SelectItem key={store.id} value={store.id} className="text-xs">
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ブランド */}
          <Select
            value={filters.brand ?? 'all'}
            onValueChange={(v) =>
              updateFilter('brand', v === 'all' ? null : (v as typeof filters.brand))
            }
          >
            <SelectTrigger
              className={`h-8 w-[130px] text-xs ${filterActiveClass(filters.brand !== null)}`}
            >
              <SelectValue placeholder="全ブランド" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ブランド</SelectItem>
              <SelectItem value="joyfit" className="text-xs">
                JOYFIT
              </SelectItem>
              <SelectItem value="fit365" className="text-xs">
                FIT365
              </SelectItem>
            </SelectContent>
          </Select>

          {/* 申請日 */}
          <Select
            value={filters.applied_period ?? 'all'}
            onValueChange={(v) =>
              updateFilter(
                'applied_period',
                v === 'all' ? null : (v as typeof filters.applied_period),
              )
            }
          >
            <SelectTrigger
              className={`h-8 w-[120px] text-xs ${filterActiveClass(filters.applied_period !== null)}`}
            >
              <SelectValue placeholder="全期間" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全期間</SelectItem>
              {APPLIED_PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* すべてクリア */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground ml-auto h-8 text-xs"
            onClick={clearFilters}
          >
            すべてクリア
          </Button>
        </div>
      )}
    </div>
  );
}
