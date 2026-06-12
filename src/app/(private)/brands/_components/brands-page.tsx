'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

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
  patchCrmBrandsByIdMutation,
  postCrmBrandsMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmBrandsResponse } from '@/lib/api/types.gen';

import { Permission } from '@/types/permission.type';

import { useBrandsFilters } from '../_hooks/use-brands-filters';
import type { BrandFormValues } from '../_schemas/brand-form.schema';
import { BrandFormSheet } from './brand-form-sheet';

const MAX_SEARCH_LENGTH = 255;
const EMPTY_FORM_VALUES: BrandFormValues = {
  brandId: '',
  displayName: '',
};
type BrandListItem = GetCrmBrandsResponse['brands'][number];

interface BrandsSearchLayoutProps {
  totalBrands: number;
  filteredTotal: number;
  committedSearch: string;
  onApplySearch: (search: string) => void;
  onClearFilters: () => void;
  children: ReactNode;
}

function buildInitialValues(brand: BrandListItem | null): BrandFormValues {
  if (!brand) return EMPTY_FORM_VALUES;

  return {
    brandId: brand.brand_id,
    displayName: brand.display_name,
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
        <Card className="rounded-2xl border px-4 py-3">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground min-w-0 text-xs leading-5 break-all whitespace-normal">
              全 {totalBrands} 件中 {filteredTotal} 件を抽出中: &quot;{appliedSearch}&quot;
            </p>
            <Button
              type="button"
              variant="ghost"
              className="h-7 w-fit self-center rounded-lg px-2 text-xs font-medium text-slate-700"
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

      <Card className="gap-0 overflow-hidden rounded-2xl border p-0">
        <div className="px-4 py-3">
          <div className="relative max-w-[400px]">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value.slice(0, MAX_SEARCH_LENGTH))}
              maxLength={MAX_SEARCH_LENGTH}
              placeholder="キーワードで検索..."
              className="h-8 rounded-[14px] pl-9 text-xs"
            />
          </div>
        </div>
        {children}
      </Card>
    </>
  );
}

export function BrandsPage() {
  const router = useRouter();
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
      void queryClient.invalidateQueries({ queryKey: getCrmBrandsQueryKey() });
      handleSheetOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    ...patchCrmBrandsByIdMutation(),
    onSuccess: (response) => {
      toast.success(response.message || 'ブランド設定を保存しました');
      void queryClient.invalidateQueries({ queryKey: getCrmBrandsQueryKey() });
      handleSheetOpenChange(false);
    },
  });

  const brands = useMemo(() => data?.brands ?? [], [data?.brands]);
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

    try {
      if (sheetMode === 'create') {
        await createMutation.mutateAsync({
          body: {
            display_name: values.displayName.trim(),
            brand_id: normalizedBrandId,
          },
        });
        return null;
      }

      if (sheetMode === 'edit' && selectedBrand) {
        await updateMutation.mutateAsync({
          path: { id: selectedBrand.code },
          body: {
            display_name: values.displayName.trim(),
            brand_id: normalizedBrandId,
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
        className="[&_h1]:text-[18px] [&_h1]:leading-7"
        badge={
          <Badge
            variant="outline"
            className="h-5 rounded-full border-slate-200 bg-white px-1.5 text-[11px] font-medium text-slate-600"
          >
            {totalBrands}件
          </Badge>
        }
        actions={
          <RoleGatedButton
            requiredPermission={Permission.BrandsCreate}
            type="button"
            className="h-8 gap-1 rounded-xl px-3 text-xs font-semibold"
            onClick={handleCreateClick}
          >
            <Plus className="size-3.5" />
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
            <Table className="min-w-[760px] text-xs">
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] px-4 text-xs font-semibold">ブランドID</TableHead>
                  <TableHead className="px-4 text-xs font-semibold">ブランド名</TableHead>
                  <TableHead className="w-[64px] px-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && brands.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="h-40 px-4">
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 text-sm">
                        <Loader2 className="size-5 animate-spin" />
                        読み込み中...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="h-40 px-4">
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
                    <TableRow
                      key={brand.code}
                      className="h-[48px] cursor-pointer"
                      onClick={() => router.push(`/brands/${brand.code}`)}
                    >
                      <TableCell className="px-4 py-0 font-mono text-xs text-slate-500">
                        {brand.brand_id}
                      </TableCell>
                      <TableCell className="px-4 py-0 text-xs font-medium">
                        {brand.display_name}
                      </TableCell>
                      <TableCell
                        className="px-4 py-0 text-right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-slate-500"
                              />
                            }
                          >
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
                    <TableCell colSpan={3} className="h-40 px-4">
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
