'use client';

import Image from 'next/image';

import { ChevronDown, User } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-sidebar sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between px-4">
      {/* Left: Store info */}
      <div className="bg-sidebar-accent/40 hover:bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5">
        {/* Store logo placeholder */}
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100 text-[10px] font-medium text-neutral-500">
          <Image
            src={'/logo.jpeg'}
            alt="申込写真"
            width={96}
            height={96}
            className="size-full rounded object-cover"
          />
        </div>

        {/* Store name */}
        <div className="flex flex-col">
          <span className="text-sidebar-foreground/90 text-sm leading-5 font-medium">
            Fit365八潮店
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown className="text-sidebar-foreground/70 h-4 w-4" />
      </div>

      {/* Right: User info */}
      <div className="bg-sidebar-accent/40 hover:bg-sidebar-accent flex cursor-pointer items-center gap-4 rounded-lg px-3 py-1.5">
        {/* User section */}
        <div className="flex items-center gap-2">
          {/* User avatar placeholder */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200">
            <User className="h-4 w-4 text-neutral-500" />
          </div>

          {/* User name */}
          <span className="text-sidebar-foreground/70 text-sm leading-5">テストユーザー</span>

          {/* Chevron */}
          <ChevronDown className="text-sidebar-foreground/70 h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
