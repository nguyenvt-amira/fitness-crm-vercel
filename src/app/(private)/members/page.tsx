'use client';

import { useEffect, useMemo, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, User } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { getCrmMembersInfiniteOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmMembersResponse } from '@/lib/api/types.gen';

import { Brand, MemberStatus, MemberType } from '@/types/member.type';

import { MembersFilters } from './_components/members-filters';
import { MembersTableColumns } from './_components/members-table-columns';

const BREADCRUMB_ITEMS = [{ url: '/', label: '会員管理' }, { label: '会員一覧' }];

export default function MembersPage() {
  const [limit] = useState(50);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState(''); // Debounced search
  const [memberType, setMemberType] = useState<MemberType[]>([]);
  const [status, setStatus] = useState<MemberStatus[]>([]);
  const [brand, setBrand] = useState<Brand[]>([]);
  const [storeId, setStoreId] = useState<string[]>([]);
  const [contractPlanId, setContractPlanId] = useState<string[]>([]);
  const [lastVisitDays, setLastVisitDays] = useState<number | undefined>();
  const [hasUnpaid, setHasUnpaid] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState<string>('member_number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Debounce search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    ...getCrmMembersInfiniteOptions({
      query: {
        limit,
        search: search || undefined,
        memberType: memberType.length > 0 ? memberType : undefined,
        status: status.length > 0 ? status : undefined,
        brand: brand.length > 0 ? brand : undefined,
        storeId: storeId.length > 0 ? storeId : undefined,
        contractPlanId: contractPlanId.length > 0 ? contractPlanId : undefined,
        lastVisitDays,
        hasUnpaid,
        sortBy: sortBy as 'member_number' | 'joined_at' | 'last_visit' | 'name',
        sortOrder,
      },
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.pagination?.totalPages || 0;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });

  // Flatten members from all pages
  const members = useMemo(() => {
    return data?.pages.flatMap((page) => page.members || []) || [];
  }, [data]);

  // Get total from first page
  const total = data?.pages[0]?.pagination?.total || 0;
  const totalFetched = members.length;

  const columns: ColumnDef<NonNullable<GetCrmMembersResponse['members']>[0]>[] =
    MembersTableColumns({
      onMemberClick: (memberId) => {
        window.location.href = `/members/${memberId}`;
      },
      selectedMembers,
      onSelectionChange: setSelectedMembers,
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export selected:', selectedMembers);
  };

  const handleBulkEmail = () => {
    // TODO: Implement bulk email functionality
    console.log('Bulk email to:', selectedMembers);
  };

  const handleSearchExecute = () => {
    // Trigger search immediately
    setSearch(searchInput);
    refetch();
  };

  const handleQRScan = () => {
    // TODO: Implement QR code scanning
    console.log('QR code scan clicked');
  };

  const hasActiveFilters: boolean =
    memberType.length > 0 ||
    status.length > 0 ||
    brand.length > 0 ||
    storeId.length > 0 ||
    contractPlanId.length > 0 ||
    lastVisitDays !== undefined ||
    hasUnpaid !== undefined ||
    search.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <User className="text-foreground size-6" />
          <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          あんしんサポート契約状況の出力
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <MembersFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          onSearchExecute={handleSearchExecute}
          onQRScan={handleQRScan}
          memberType={memberType}
          onMemberTypeChange={setMemberType}
          status={status}
          onStatusChange={setStatus}
          brand={brand}
          onBrandChange={setBrand}
          storeId={storeId}
          onStoreIdChange={setStoreId}
          contractPlanId={contractPlanId}
          onContractPlanIdChange={setContractPlanId}
          lastVisitDays={lastVisitDays}
          onLastVisitDaysChange={setLastVisitDays}
          hasUnpaid={hasUnpaid}
          onHasUnpaidChange={setHasUnpaid}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          selectedCount={selectedMembers.length}
          totalCount={total}
          onExport={handleExport}
          onBulkEmail={handleBulkEmail}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={() => {
            setSearchInput('');
            setSearch('');
            setMemberType([]);
            setStatus([]);
            setBrand([]);
            setStoreId([]);
            setContractPlanId([]);
            setLastVisitDays(undefined);
            setHasUnpaid(undefined);
            refetch();
          }}
        />

        {/* Total Count */}
        <div className="border-t px-4 py-4">
          <p className="text-lg font-medium">総件数: {total}人</p>
        </div>

        <div className="flex-1">
          <DataTable
            columns={columns}
            data={members}
            isLoading={isLoading}
            isFetching={isFetching}
            variant="default"
            totalRows={total}
            filterRows={total}
            totalRowsFetched={totalFetched}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            onRowClick={(row) => {
              if (row.id) {
                window.location.href = `/members/${row.id}`;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
