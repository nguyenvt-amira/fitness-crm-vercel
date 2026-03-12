'use client';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCheckinHistoriesFiltersContext } from '../_contexts/checkin-histories-filters-context';

export function HistoriesFilterCard() {
  const {
    filters,
    searchInput,
    setSearchInput,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    handleSearchExecute,
  } = useCheckinHistoriesFiltersContext();

  // Parse date strings to Date objects (format: YYYY-MM-DD)
  const startDate = filters.startDate
    ? new Date(filters.startDate + 'T00:00:00')
    : new Date(2026, 10, 1); // Default: 2026年11月1日
  const endDate = filters.endDate
    ? new Date(filters.endDate + 'T00:00:00')
    : new Date(2026, 10, 30); // Default: 2026年11月30日

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      updateFilter('startDate', `${year}-${month}-${day}`);
    } else {
      updateFilter('startDate', null);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      updateFilter('endDate', `${year}-${month}-${day}`);
    } else {
      updateFilter('endDate', null);
    }
  };

  return (
    <Card className="border shadow-sm">
      <div className="flex flex-wrap items-end gap-3 p-4">
        {/* Date Range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">期間</label>
          <div className="flex items-center gap-2">
            <DatePicker date={startDate} onDateChange={handleStartDateChange} />
            <span className="text-xs text-gray-500">〜</span>
            <DatePicker date={endDate} onDateChange={handleEndDateChange} />
          </div>
        </div>

        {/* Search Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">利用者名</label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder="利用者名を検索"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchExecute();
                }
              }}
              className="h-8 w-[180px] rounded-lg pl-8"
            />
          </div>
        </div>

        {/* Store Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">所属店舗</label>
          <Select value={filters.store} onValueChange={(value) => updateFilter('store', value)}>
            <SelectTrigger className="h-8 w-[130px] rounded-lg">
              <SelectValue placeholder="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="store1">八潮店</SelectItem>
              <SelectItem value="store2">草加店</SelectItem>
              <SelectItem value="store3">越谷店</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Member Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">会員種別</label>
          <Select
            value={filters.memberType}
            onValueChange={(value) => updateFilter('memberType', value)}
          >
            <SelectTrigger className="h-8 w-[130px] rounded-lg">
              <SelectValue placeholder="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="fc">FC会員</SelectItem>
              <SelectItem value="regular">正会員</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">性別</label>
          <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
            <SelectTrigger className="h-8 w-[100px] rounded-lg">
              <SelectValue placeholder="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-8">
            すべてクリア
          </Button>
        )}
      </div>
    </Card>
  );
}
