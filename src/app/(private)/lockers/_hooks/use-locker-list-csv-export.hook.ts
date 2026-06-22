'use client';

import { useCallback } from 'react';

import { useLockerContractsFilters } from '../contracts/_hooks/use-locker-contracts-filters';
import { useLockerPendingSlotsFilters } from '../pending/_hooks/use-locker-pending-slots-filters';
import {
  useLockerContractsCsvExport,
  useLockerPendingSlotsCsvExport,
  useLockersCsvExport,
} from './use-locker-csv-export.hook';
import { useLockersFilters } from './use-lockers-filters';

type LockerListTab = 'lockers' | 'contracts' | 'pending';

export function useLockerListCsvExport(activeTab: LockerListTab) {
  const { exportQueryParams: lockersExportParams } = useLockersFilters();
  const { exportQueryParams: contractsExportParams } = useLockerContractsFilters();
  const { exportQueryParams: pendingExportParams } = useLockerPendingSlotsFilters();

  const { mutate: exportLockers, isPending: isExportingLockers } = useLockersCsvExport();
  const { mutate: exportContracts, isPending: isExportingContracts } =
    useLockerContractsCsvExport();
  const { mutate: exportPendingSlots, isPending: isExportingPendingSlots } =
    useLockerPendingSlotsCsvExport();

  const exportCsv = useCallback(() => {
    if (activeTab === 'lockers') {
      exportLockers({ body: lockersExportParams });
      return;
    }

    if (activeTab === 'contracts') {
      exportContracts({ body: contractsExportParams });
      return;
    }

    exportPendingSlots({ body: pendingExportParams });
  }, [
    activeTab,
    contractsExportParams,
    exportContracts,
    exportLockers,
    exportPendingSlots,
    lockersExportParams,
    pendingExportParams,
  ]);

  const isExportingCsv =
    activeTab === 'lockers'
      ? isExportingLockers
      : activeTab === 'contracts'
        ? isExportingContracts
        : isExportingPendingSlots;

  return { exportCsv, isExportingCsv };
}
