'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { downloadCsv, getCsvFilenameFromContentDisposition } from '@/utils/csv.util';
import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { Controllers, Equipment } from '@/lib/api';
import type { PostCrmControllersExportData, PostCrmEquipmentExportData } from '@/lib/api/types.gen';

type EquipmentTab = 'equipment' | 'controllers';

type SortOrder = 'asc' | 'desc';

type CsvDownload = { blob: Blob; filename: string };

function asSortOrder(value: string | null, fallback: SortOrder): SortOrder {
  return value === 'asc' || value === 'desc' ? value : fallback;
}

function EquipmentTabExportButton() {
  const searchParams = useSearchParams();
  const { mutate, isPending } = useMutation({
    mutationFn: async (): Promise<CsvDownload> => {
      const body: NonNullable<PostCrmEquipmentExportData['body']> = {
        search: searchParams.get('equipment_search') || undefined,
        store_id: searchParams.get('equipment_store_id') || undefined,
        equipment_type:
          (searchParams.get('equipment_type') as NonNullable<
            PostCrmEquipmentExportData['body']
          >['equipment_type']) || undefined,
        status:
          (searchParams.get('equipment_status') as NonNullable<
            PostCrmEquipmentExportData['body']
          >['status']) || undefined,
        sort_by:
          (searchParams.get('equipment_sort_by') as NonNullable<
            PostCrmEquipmentExportData['body']
          >['sort_by']) || 'id',
        sort_order: asSortOrder(searchParams.get('equipment_sort_order'), 'asc'),
      };

      const { data, response } = await Equipment.postCrmEquipmentExport({
        body,
        parseAs: 'blob',
        throwOnError: true,
      });

      return {
        blob: data as Blob,
        filename: getCsvFilenameFromContentDisposition(
          response.headers.get('content-disposition'),
          'equipment.csv',
        ),
      };
    },
    onSuccess: ({ blob, filename }) => {
      downloadCsv(blob, filename);
      toast.success('CSVを出力しました');
    },
    onError: () => {
      toast.error('CSVの出力に失敗しました');
    },
  });

  return (
    <Button variant="outline" className="gap-1" onClick={() => mutate()} disabled={isPending}>
      <Download className="size-4" />
      CSV出力
    </Button>
  );
}

function ControllersTabExportButton() {
  const searchParams = useSearchParams();
  const { mutate, isPending } = useMutation({
    mutationFn: async (): Promise<CsvDownload> => {
      const body: NonNullable<PostCrmControllersExportData['body']> = {
        search: searchParams.get('controller_search') || undefined,
        store_id: searchParams.get('controller_store_id') || undefined,
        status:
          (searchParams.get('controller_status') as NonNullable<
            PostCrmControllersExportData['body']
          >['status']) || undefined,
        sort_by:
          (searchParams.get('controller_sort_by') as NonNullable<
            PostCrmControllersExportData['body']
          >['sort_by']) || 'controller_id',
        sort_order: asSortOrder(searchParams.get('controller_sort_order'), 'asc'),
      };

      const { data, response } = await Controllers.postCrmControllersExport({
        body,
        parseAs: 'blob',
        throwOnError: true,
      });

      return {
        blob: data as Blob,
        filename: getCsvFilenameFromContentDisposition(
          response.headers.get('content-disposition'),
          'controllers.csv',
        ),
      };
    },
    onSuccess: ({ blob, filename }) => {
      downloadCsv(blob, filename);
      toast.success('CSVを出力しました');
    },
    onError: () => {
      toast.error('CSVの出力に失敗しました');
    },
  });

  return (
    <Button variant="outline" className="gap-1" onClick={() => mutate()} disabled={isPending}>
      <Download className="size-4" />
      CSV出力
    </Button>
  );
}

export function EquipmentCsvExportButton({ activeTab }: { activeTab: EquipmentTab }) {
  return (
    <Suspense
      fallback={
        <Button variant="outline" className="gap-1" disabled>
          <Download className="size-4" />
          CSV出力
        </Button>
      }
    >
      {activeTab === 'controllers' ? <ControllersTabExportButton /> : <EquipmentTabExportButton />}
    </Suspense>
  );
}
