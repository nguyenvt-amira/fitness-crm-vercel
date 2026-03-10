'use client';

import { useState } from 'react';

import { GetMembersData } from '@/lib/api';

import { FilterBar } from './_features/components/FilterBar';
import { Header } from './_features/components/Header';
import { MemberTable } from './_features/components/MemberTable';
import { INITIAL_FILTERS } from './_features/constants';
import { useGetListMembers } from './_features/hooks/useApiMember';

export default function MemberListPage() {
  const [filters, setFilters] = useState<NonNullable<GetMembersData['query']>>(INITIAL_FILTERS);

  const { data: members = [], isLoading, isError } = useGetListMembers({ filters });

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="border-b border-gray-100" />
      <div className="p-4">
        <div className="rounded-lg border p-4">
          <FilterBar filters={filters} setFilters={setFilters} />
          <div className="mb-4 text-sm font-bold text-gray-700">
            総件数: {isLoading ? '...' : members.length}人
          </div>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">データを読み込み中...</div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500">
              データの取得に失敗しました。後でもう一度お試しください。
            </div>
          ) : (
            <MemberTable data={members} />
          )}
        </div>
      </div>
    </div>
  );
}
