'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  STAFF_BRAND_LABELS,
  STAFF_ROLE_LABELS,
  STAFF_STATUS_LABELS,
  StaffBrand,
  StaffRole,
  StaffStatus,
} from '../_constants/constants';
import { useStaffsFiltersContext } from '../_contexts/staffs-filters-context';

interface StaffsFiltersProps {
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
}

export function StaffsFilters({ isFilterOpen, onFilterOpenChange }: StaffsFiltersProps) {
  const { filters, searchInput, setSearchInput, updateFilter, hasActiveFilters, clearFilters } =
    useStaffsFiltersContext();

  return (
    <div className="flex flex-col gap-4">
      {/* Search Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="名前・メールアドレスで検索..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-9 rounded-lg pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => onFilterOpenChange(!isFilterOpen)}
        >
          <SlidersHorizontal className="size-4" />
          {isFilterOpen ? '閉じる' : '詳細フィルター'}
        </Button>
      </div>

      {/* Filter Row - Collapsible */}
      {isFilterOpen && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* 権限 */}
            <Select
              value={filters.role ?? undefined}
              onValueChange={(value: StaffRole) => {
                updateFilter('role', value);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <SelectValue placeholder="全権限">
                    {filters.role ? STAFF_ROLE_LABELS[filters.role] : '全権限'}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ブランド */}
            <Select
              value={filters.brand ?? undefined}
              onValueChange={(value: StaffBrand) => {
                updateFilter('brand', value);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <SelectValue placeholder="全ブランド">
                    {filters.brand ? STAFF_BRAND_LABELS[filters.brand] : '全ブランド'}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAFF_BRAND_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ステータス */}
            <Select
              value={filters.status ?? undefined}
              onValueChange={(value: StaffStatus) => {
                updateFilter('status', value);
              }}
            >
              <SelectTrigger className="h-9 w-fit rounded-lg">
                <div className="flex items-center gap-1.5">
                  <SelectValue placeholder="全ステータス">
                    {filters.status ? STAFF_STATUS_LABELS[filters.status] : '全ステータス'}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAFF_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* フィルタクリア */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              すべてクリア
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
