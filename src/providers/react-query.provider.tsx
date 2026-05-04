import { useMemo } from 'react';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

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
            // refetchOnMount: 'always',
            // staleTime: 5 * 60 * 1000,
          },
        },
        mutationCache: new MutationCache({
          onError: (error: any) => {
            const errorMsg =
              error?.detail?.message || 'エラーが発生しました。後で再試行してください。';
            toast.error(errorMsg);
          },
        }),
        queryCache: new QueryCache({
          onError: (error: any) => {
            const errorMsg =
              error?.detail?.message || 'エラーが発生しました。後で再試行してください。';
            toast.error(errorMsg);
          },
        }),
      }),
    [],
  );

  // Initialize client request
  useClientRequest();
  console.log('queryClient', queryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
