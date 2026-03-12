'use client';

import { type ReactNode, createContext, useContext } from 'react';

import type { useCheckinHistoriesFilters } from '../_hooks/use-checkin-histories-filters';

export type CheckinHistoriesFiltersContextValue = ReturnType<typeof useCheckinHistoriesFilters>;

const CheckinHistoriesFiltersContext = createContext<
  CheckinHistoriesFiltersContextValue | undefined
>(undefined);

export function CheckinHistoriesFiltersProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: CheckinHistoriesFiltersContextValue;
}) {
  return (
    <CheckinHistoriesFiltersContext.Provider value={value}>
      {children}
    </CheckinHistoriesFiltersContext.Provider>
  );
}

export function useCheckinHistoriesFiltersContext() {
  const context = useContext(CheckinHistoriesFiltersContext);
  if (!context) {
    throw new Error(
      'useCheckinHistoriesFiltersContext must be used within CheckinHistoriesFiltersProvider',
    );
  }
  return context;
}
