'use client';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface HistoriesPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function HistoriesPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: HistoriesPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = 1 + (currentPage - 1) * itemsPerPage;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <span className="text-xs text-gray-600">
        {startItem}-{endItem} / {totalItems}件
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-7 gap-1 opacity-50 disabled:opacity-50"
        >
          <ArrowUpDown className="h-3.5 w-3.5 rotate-90" />
          前へ
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-7 w-7 ${currentPage === page ? 'bg-gray-800 text-white' : ''}`}
            >
              {page}
            </Button>
          );
        })}
        {totalPages > 5 && (
          <>
            <span className="px-2 text-xs text-gray-600">...</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-7 w-7"
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-7 gap-1"
        >
          次へ
          <ArrowUpDown className="h-3.5 w-3.5 -rotate-90" />
        </Button>
      </div>
    </div>
  );
}
