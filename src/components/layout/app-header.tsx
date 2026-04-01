'use client';

import { ChevronDown, User } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

export function AppHeader() {
  return (
    <header className="border-border sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b bg-white px-6">
      {/* Left: Store info */}
      <div className="flex items-center gap-3">
        {/* Store logo placeholder */}
        <div className="flex h-8 w-[57px] items-center justify-center rounded-md bg-neutral-100 text-[10px] font-medium text-neutral-500">
          LOGO
        </div>

        {/* Store name + company */}
        <div className="flex flex-col">
          <span className="text-foreground text-sm leading-5 font-medium">Fit365八潮店</span>
          <span className="text-muted-foreground text-[10px] leading-[15px]">fit365</span>
        </div>

        {/* Chevron */}
        <ChevronDown className="text-muted-foreground h-4 w-4" />

        {/* Separator */}
        <Separator orientation="vertical" className="bg-border h-6!" />
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-4">
        {/* Separator */}
        <Separator orientation="vertical" className="bg-border h-6!" />

        {/* User section */}
        <div className="flex items-center gap-2">
          {/* User avatar placeholder */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200">
            <User className="h-4 w-4 text-neutral-500" />
          </div>

          {/* User name */}
          <span className="text-foreground text-sm leading-5">テストユーザー</span>

          {/* Chevron */}
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
