'use client';

import { ReactNode } from 'react';

import '@/app/globals.css';

import { Toaster } from '@/components/ui/sonner';

import ReactQueryProvider from './react-query.provider';

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ReactQueryProvider>
      <Toaster />
      {children}
    </ReactQueryProvider>
  );
};
