'use client';

import { ReactNode } from 'react';

import '@/styles/globals.css';

import ReactQueryProvider from './react-query.provider';

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider = ({ children }: RootProviderProps) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};
