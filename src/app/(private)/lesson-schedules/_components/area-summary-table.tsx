'use client';

import { useState } from 'react';

import { SortingState } from '@tanstack/react-table';

import { DataTable } from '@/components/common/data-table';

import type { StoreScheduleSummary } from '@/lib/api/types.gen';

import { areaSummaryColumns } from './area-summary-columns';

interface AreaSummaryTableProps {
  stores: StoreScheduleSummary[];
  focusedStoreId?: string | null;
  onStoreClick?: (storeId: string) => void;
}

export function AreaSummaryTable({ stores, focusedStoreId, onStoreClick }: AreaSummaryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'store_name', desc: false }]);

  return (
    <DataTable
      columns={areaSummaryColumns}
      data={stores}
      variant="simple"
      totalRows={stores.length}
      onRowClick={(row) => onStoreClick?.(row.store_id)}
      getRowClassName={(row) =>
        row.store_id === focusedStoreId ? 'bg-accent border-l-2 border-l-primary' : undefined
      }
      tableOptions={{
        state: { sorting },
        onSortingChange: setSorting,
      }}
    />
  );
}
