'use client';
import { useCallback, useState } from 'react';

import { ChevronDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { GetMembersData } from '@/lib/api';

import {
  MEMBER_TYPE_OPTIONS,
  STATUS_OPTIONS,
  STORE_OPTIONS,
  VISIT_HISTORY_OPTIONS,
} from '../constants';
import { INITIAL_FILTERS } from '../constants';

type MemberFilters = NonNullable<GetMembersData['query']>;

interface FilterBarProps {
  filters: MemberFilters;
  setFilters: React.Dispatch<React.SetStateAction<MemberFilters>>;
}

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  const [searchKey, setSearchKey] = useState<string>('');

  const handleFilterChange = useCallback(
    (key: keyof MemberFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters],
  );

  const handleReset = () => {
    setSearchKey('');
    setFilters(INITIAL_FILTERS);
  };

  const handleSearch = useCallback(() => {
    handleFilterChange('keyword', searchKey);
  }, [searchKey, handleFilterChange]);

  return (
    <div className="mb-4 space-y-4">
      <div className="flex gap-2">
        <div className="relative w-80">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="会員を検索"
            className="h-10 pl-10"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch} className="text-white">
          検索
        </Button>
        <Button variant="outline" className="h-10 text-[13px]">
          Filters <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <FilterSelect
          label="店舗"
          value={filters.storeId || 'all'}
          onValueChange={(val: string) => handleFilterChange('storeId', val)}
          options={STORE_OPTIONS}
        />

        <FilterSelect
          label="会員種別"
          value={filters.memberType}
          onValueChange={(val: string) => handleFilterChange('memberType', val)}
          options={MEMBER_TYPE_OPTIONS}
        />

        <FilterSelect
          label="ステータス"
          value={filters.status || 'all'}
          onValueChange={(val: string) => handleFilterChange('status', val)}
          options={STATUS_OPTIONS}
        />

        <FilterSelect
          label="入館履歴"
          value={filters.lastVisitDate || 'all'}
          onValueChange={(val: string) => handleFilterChange('lastVisitDate', val)}
          options={VISIT_HISTORY_OPTIONS}
        />

        <button
          onClick={handleReset}
          className="ml-2 text-[13px] text-gray-500 transition-colors hover:underline"
        >
          すべてクリア
        </button>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onValueChange, options }: any) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-auto min-w-[160px] px-3 text-[13px]">
        <span className="mr-1 font-normal text-gray-400">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt: any) => (
          <SelectItem key={opt.value} value={opt.value} className="text-[13px]">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
