'use client';

import { useState } from 'react';

import { SortingState } from '@tanstack/react-table';

import { DataTable } from '@/components/common/data-table';

import type { LessonScheduleListItem } from '@/lib/api/types.gen';

import { LessonScheduleTableSkeleton } from './lesson-schedule-skeletons';
import { scheduleListColumns } from './schedule-list-columns';

interface ScheduleListViewProps {
  schedules: LessonScheduleListItem[];
  isLoading?: boolean;
}

export function ScheduleListView({ schedules, isLoading = false }: ScheduleListViewProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'start_time', desc: false }]);

  if (isLoading) return <LessonScheduleTableSkeleton />;

  return (
    <DataTable
      columns={scheduleListColumns}
      data={schedules}
      variant="simple"
      totalRows={schedules.length}
      tableOptions={{
        state: { sorting },
        onSortingChange: setSorting,
        getSortedRowModel: undefined, // manual sort is handled server-side; client sort fallback
      }}
    />
  );
}
