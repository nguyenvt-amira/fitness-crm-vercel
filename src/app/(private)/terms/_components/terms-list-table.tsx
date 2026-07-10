import { MoreHorizontal, Pencil, SearchX, Trash2 } from 'lucide-react';

import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { TablePaginationWithSize } from '@/components/common/table-pagination-with-size';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { GetCrmTermsResponse } from '@/lib/api/types.gen';

import { Permission } from '@/types/permission.type';

import {
  TERMS_PAGE_SIZE_OPTIONS,
  TERMS_STATUS_LABELS,
} from '../_schemas/terms-list-filters.schema';

type TermsListItem = GetCrmTermsResponse['items'][number];

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  return dateStr.replace(/-/g, '/');
}

function getStatusBadgeClass(status: TermsListItem['status']) {
  switch (status) {
    case 'published':
      return 'bg-success/15 text-success border-success/20';
    case 'expired':
      return 'border-border bg-muted text-muted-foreground';
    case 'draft':
      return 'bg-warning/15 text-warning border-warning/20';
  }
}

interface TermsListTableProps {
  readonly items: TermsListItem[];
  readonly total: number;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly hasActiveFilters: boolean;
  readonly onRetry: () => void;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (pageSize: number) => void;
  readonly onRowClick: (termId: string) => void;
  readonly onEditClick: (termId: string) => void;
  readonly onDeleteClick: (term: TermsListItem) => void;
  readonly onClearFilters: () => void;
}

function TermsListTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {Array.from({ length: 7 }).map((__, cellIndex) => (
            <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
              <div className="bg-muted h-4 animate-pulse rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function TermsListErrorRow({ onRetry }: Readonly<{ onRetry: () => void }>) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="p-6">
        <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-lg border px-4 py-8 text-center">
          <div>
            <p className="text-destructive text-sm font-semibold">規約一覧の取得に失敗しました</p>
            <p className="text-muted-foreground mt-1 text-xs">
              ネットワーク接続を確認して再度お試しください。
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onRetry}>
            再試行する
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TermsListEmptyRow({
  hasActiveFilters,
  onClearFilters,
}: Readonly<{
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}>) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-32 text-center">
        <div className="flex flex-col items-center gap-2">
          <SearchX className="text-muted-foreground/60 size-9 stroke-[1.75]" />
          <p className="text-muted-foreground text-sm">条件に一致する規約文書がありません</p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="text-xs" onClick={onClearFilters}>
              条件をクリア
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TermsListTable({
  items,
  total,
  currentPage,
  pageSize,
  isLoading,
  isError,
  hasActiveFilters,
  onRetry,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onEditClick,
  onDeleteClick,
  onClearFilters,
}: TermsListTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="bg-muted/50 sticky top-0 z-10 w-[60px] text-xs font-semibold">
                ID
              </TableHead>
              <TableHead className="bg-muted/50 sticky top-0 z-10 min-w-[160px] text-xs font-semibold">
                規約名
              </TableHead>
              <TableHead className="bg-muted/50 sticky top-0 z-10 w-[100px] text-xs font-semibold">
                現行バージョン
              </TableHead>
              <TableHead className="bg-muted/50 sticky top-0 z-10 w-[160px] text-xs font-semibold">
                ブランド
              </TableHead>
              <TableHead className="bg-muted/50 sticky top-0 z-10 w-[120px] text-xs font-semibold">
                適用開始日
              </TableHead>
              <TableHead className="bg-muted/50 sticky top-0 z-10 w-[100px] text-xs font-semibold">
                ステータス
              </TableHead>
              <TableHead className="bg-muted/50 sticky top-0 z-10 w-10 text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TermsListTableSkeleton />
            ) : isError ? (
              <TermsListErrorRow onRetry={onRetry} />
            ) : items.length === 0 ? (
              <TermsListEmptyRow
                hasActiveFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
              />
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className={
                    item.isDeleted
                      ? 'hover:bg-muted/50 cursor-pointer opacity-50'
                      : 'hover:bg-muted/50 cursor-pointer'
                  }
                  onClick={() => onRowClick(item.id)}
                >
                  <TableCell className="text-muted-foreground text-xs">{item.id}</TableCell>
                  <TableCell className="text-sm font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {item.version}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {item.brandEnum}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(item.effectiveFrom)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${getStatusBadgeClass(item.status)}`}
                    >
                      {TERMS_STATUS_LABELS[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger className="hover:bg-muted flex size-8 items-center justify-center rounded-md">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <RoleGatedMenuItem
                          requiredPermission={Permission.TermsEdit}
                          onClick={() => onEditClick(item.id)}
                        >
                          <Pencil className="size-4" />
                          編集
                        </RoleGatedMenuItem>
                        {!item.isDeleted && (
                          <>
                            <DropdownMenuSeparator />
                            <RoleGatedMenuItem
                              requiredPermission={Permission.TermsDelete}
                              className="text-destructive"
                              onClick={() => onDeleteClick(item)}
                            >
                              <Trash2 className="size-4" />
                              削除
                            </RoleGatedMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isError && !isLoading && (
        <TablePaginationWithSize
          currentPage={currentPage}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={TERMS_PAGE_SIZE_OPTIONS}
          className="border-t"
        />
      )}
    </>
  );
}
