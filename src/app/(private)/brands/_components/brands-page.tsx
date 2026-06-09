'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MoreHorizontal, Pencil, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/common/page-header';
import { RoleGatedButton } from '@/components/common/role-gated-button';
import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { TablePaginationWithSize } from '@/components/common/table-pagination-with-size';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  getCrmBrandsOptions,
  getCrmBrandsQueryKey,
  patchCrmBrandsByCodeMutation,
  postCrmBrandsMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmBrandsResponse } from '@/lib/api/types.gen';

import { Permission } from '@/types/permission.type';

import { useBrandsFilters } from '../_hooks/use-brands-filters';
import type { BrandFormValues } from '../_schemas/brand-form.schema';
import { BrandFormSheet } from './brand-form-sheet';
import type { BrandListItem } from './brands.types';

const MAX_SEARCH_LENGTH = 255;
const EMPTY_FORM_VALUES: BrandFormValues = {
  brandId: '',
  displayName: '',
  enrollmentFee: 0,
  registrationAdminFee: 0,
  cardIssuanceFee: 0,
  otherFeeDescription: '',
};

interface BrandsSearchLayoutProps {
  totalBrands: number;
  filteredTotal: number;
  committedSearch: string;
  onApplySearch: (search: string) => void;
  onClearFilters: () => void;
  children: ReactNode;
}

function formatYen(value: number | null): string {
  if (value === null) return 'ー';
  return `¥${value.toLocaleString('ja-JP')}`;
}

function mapBrandItem(brand: GetCrmBrandsResponse['brands'][number]): BrandListItem {
  return {
    code: brand.code,
    brandId: brand.brand_id,
    displayName: brand.display_name,
    enrollmentFee: brand.enrollment_fee_yen,
    registrationAdminFee: brand.registration_admin_fee_yen,
    cardIssuanceFee: brand.card_issuance_fee_yen,
    otherFeeDescription: brand.other_fee_description,
  };
}

function buildInitialValues(brand: BrandListItem | null): BrandFormValues {
  if (!brand) return EMPTY_FORM_VALUES;

  return {
    brandId: brand.brandId,
    displayName: brand.displayName,
    enrollmentFee: brand.enrollmentFee,
    registrationAdminFee: brand.registrationAdminFee,
    cardIssuanceFee: brand.cardIssuanceFee,
    otherFeeDescription: brand.otherFeeDescription ?? '',
  };
}

function BrandsSearchLayout({
  totalBrands,
  filteredTotal,
  committedSearch,
  onApplySearch,
  onClearFilters,
  children,
}: BrandsSearchLayoutProps) {
  const [searchInput, setSearchInput] = useState(committedSearch);

  useEffect(() => {
    const nextSearch = searchInput.slice(0, MAX_SEARCH_LENGTH);
    const timer = setTimeout(() => {
      if (nextSearch !== committedSearch) {
        onApplySearch(nextSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [committedSearch, onApplySearch, searchInput]);

  const hasSearch = searchInput.length > 0 || committedSearch.length > 0;
  const appliedSearch = searchInput || committedSearch;

  return (
    <>
      {hasSearch && (
        <Card className="rounded-xl border px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <p className="text-muted-foreground min-w-0 flex-1 text-sm break-all whitespace-normal">
              全 {totalBrands} 件中 {filteredTotal} 件を抽出中: &quot;{appliedSearch}&quot;
            </p>
            <Button
              type="button"
              variant="ghost"
              className="h-8 shrink-0 self-start px-2 text-sm"
              onClick={() => {
                setSearchInput('');
                onClearFilters();
              }}
            >
              条件をクリア
            </Button>
          </div>
        </Card>
      )}

      <Card className="gap-0 overflow-hidden rounded-xl border p-0">
        <div className="px-4 py-3">
          <div className="relative max-w-[420px]">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value.slice(0, MAX_SEARCH_LENGTH))}
              maxLength={MAX_SEARCH_LENGTH}
              placeholder="キーワードで検索..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
        </div>
        {children}
      </Card>
    </>
  );
}

export function BrandsPage() {
  const [sheetMode, setSheetMode] = useState<'create' | 'edit' | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandListItem | null>(null);
  const filtersHook = useBrandsFilters();
  const {
    filters,
    setFilters,
    clearFilters,
    queryParams,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = filtersHook;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    ...getCrmBrandsOptions({ query: queryParams }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    ...postCrmBrandsMutation(),
    onSuccess: (response) => {
      toast.success(response.message || 'ブランドを作成しました');
      queryClient.invalidateQueries({ queryKey: getCrmBrandsQueryKey(), refetchType: 'all' });
      handleSheetOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    ...patchCrmBrandsByCodeMutation(),
    onSuccess: (response) => {
      toast.success(response.message || 'ブランド設定を保存しました');
      queryClient.invalidateQueries({ queryKey: getCrmBrandsQueryKey(), refetchType: 'all' });
      handleSheetOpenChange(false);
    },
  });

  const brands = useMemo(() => (data?.brands ?? []).map(mapBrandItem), [data?.brands]);
  const pagination = data?.pagination;
  const totalBrands = pagination?.all_total ?? 0;
  const filteredTotal = pagination?.total ?? 0;
  const page = pagination?.page ?? currentPage;
  const limit = pagination?.limit ?? pageSize;
  const sheetOpen = sheetMode !== null;

  const handleCreateClick = () => {
    setSelectedBrand(null);
    setSheetMode('create');
  };

  const handleEditClick = (brand: BrandListItem) => {
    setSelectedBrand(brand);
    setSheetMode('edit');
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSheetMode(null);
      setSelectedBrand(null);
    }
  };

  const handleSaveBrand = async (values: BrandFormValues) => {
    const normalizedBrandId = values.brandId.trim().toLowerCase();
    const normalizedOtherFeeDescription = values.otherFeeDescription.trim() || null;

    try {
      if (sheetMode === 'create') {
        await createMutation.mutateAsync({
          body: {
            display_name: values.displayName.trim(),
            brand_id: normalizedBrandId,
            enrollment_fee_yen: values.enrollmentFee,
            registration_admin_fee_yen: values.registrationAdminFee,
            card_issuance_fee_yen: values.cardIssuanceFee,
            other_fee_description: normalizedOtherFeeDescription,
          },
        });
        return null;
      }

      if (sheetMode === 'edit' && selectedBrand) {
        await updateMutation.mutateAsync({
          path: { code: selectedBrand.code },
          body: {
            display_name: values.displayName.trim(),
            brand_id: normalizedBrandId,
            enrollment_fee_yen: values.enrollmentFee,
            registration_admin_fee_yen: values.registrationAdminFee,
            card_issuance_fee_yen: values.cardIssuanceFee,
            other_fee_description: normalizedOtherFeeDescription,
          },
        });
        return null;
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'error' in error &&
        typeof error.error === 'string'
      ) {
        return error.error;
      }

      return sheetMode === 'edit'
        ? 'ブランド設定の更新に失敗しました。後で再試行してください。'
        : 'ブランドの作成に失敗しました。後で再試行してください。';
    }

    return null;
  };

  return (
    <div>
      <PageHeader
        title="ブランド管理"
        badge={<Badge variant="secondary">{totalBrands}件</Badge>}
        actions={
          <RoleGatedButton
            requiredPermission={Permission.BrandsCreate}
            type="button"
            className="gap-1"
            onClick={handleCreateClick}
          >
            <Plus className="size-4" />
            新規登録
          </RoleGatedButton>
        }
      />

      <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
        <BrandsSearchLayout
          key={filters.search}
          totalBrands={totalBrands}
          filteredTotal={filteredTotal}
          committedSearch={filters.search}
          onApplySearch={(search) => {
            setFilters({ search: search || null, page: 1 });
          }}
          onClearFilters={clearFilters}
        >
          <div className="overflow-x-auto border-t">
            <Table className="min-w-[920px]">
              <TableHeader className="bg-muted/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px] px-4 text-xs font-semibold">ブランドID</TableHead>
                  <TableHead className="w-[200px] px-4 text-xs font-semibold">ブランド名</TableHead>
                  <TableHead className="w-[150px] px-4 text-right text-xs font-semibold">
                    入会金（税別）
                  </TableHead>
                  <TableHead className="w-[180px] px-4 text-right text-xs font-semibold">
                    登録事務手数料（税別）
                  </TableHead>
                  <TableHead className="w-[160px] px-4 text-right text-xs font-semibold">
                    カード発行料（税別）
                  </TableHead>
                  <TableHead className="px-4 text-xs font-semibold">その他費用</TableHead>
                  <TableHead className="w-[64px] px-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && brands.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-40 px-4">
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 text-sm">
                        <Loader2 className="size-5 animate-spin" />
                        読み込み中...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-40 px-4">
                      <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-muted-foreground text-base">
                          ブランド一覧の取得に失敗しました。
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 px-4"
                          onClick={() => refetch()}
                        >
                          再読み込み
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : brands.length > 0 ? (
                  brands.map((brand) => (
                    <TableRow key={brand.code}>
                      <TableCell className="px-4 text-xs text-slate-500">{brand.brandId}</TableCell>
                      <TableCell className="px-4 text-sm font-semibold">
                        {brand.displayName}
                      </TableCell>
                      <TableCell className="px-4 text-right text-sm">
                        {formatYen(brand.enrollmentFee)}
                      </TableCell>
                      <TableCell className="px-4 text-right text-sm">
                        {formatYen(brand.registrationAdminFee)}
                      </TableCell>
                      <TableCell className="px-4 text-right text-sm">
                        {formatYen(brand.cardIssuanceFee)}
                      </TableCell>
                      <TableCell className="px-4 text-sm break-all whitespace-normal text-slate-600">
                        {brand.otherFeeDescription ?? 'ー'}
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <RoleGatedMenuItem
                              requiredPermission={Permission.BrandsEdit}
                              onClick={() => handleEditClick(brand)}
                            >
                              <Pencil className="size-4" />
                              編集
                            </RoleGatedMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-40 px-4">
                      <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-muted-foreground text-base">
                          該当のデータがありません。
                        </p>
                        {filters.search.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-8 px-4"
                            onClick={clearFilters}
                          >
                            条件をクリア
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePaginationWithSize
            total={filteredTotal}
            currentPage={page}
            pageSize={limit}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            className={isFetching ? 'opacity-80' : undefined}
          />
        </BrandsSearchLayout>
      </div>

      <BrandFormSheet
        open={sheetOpen}
        mode={sheetMode ?? 'create'}
        initialValues={buildInitialValues(selectedBrand)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onOpenChange={handleSheetOpenChange}
        onSave={handleSaveBrand}
      />
    </div>
  );
}
