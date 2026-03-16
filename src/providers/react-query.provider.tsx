import { useMemo } from 'react';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useClientRequest from '@/hooks/useClientRequest';

export interface ReactQueryProviderProps {
  readonly children: React.ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            retry: false,
          },
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error: any) => {
            const errorMsg = error?.detail?.message;
            console.error(errorMsg); //TODO: toast error
          },
        }),
        queryCache: new QueryCache({
          onError: (error: any) => {
            const errorMsg = error?.detail?.message;
            console.error(errorMsg); //TODO: toast error
          },
        }),
      }),
    [],
  );

  // Initialize client request
  useClientRequest();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
