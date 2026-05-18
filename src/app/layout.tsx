import type { Metadata } from 'next';
import { Geist, Noto_Sans_JP } from 'next/font/google';

import { RootProvider } from '@/providers/root.provider';

import { cn } from '@/lib/utils';

import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const notoSansJP = Noto_Sans_JP({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Fitness CRM',
  description: 'Fitness CRM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable)}>
      <body className={`${notoSansJP.variable} antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
