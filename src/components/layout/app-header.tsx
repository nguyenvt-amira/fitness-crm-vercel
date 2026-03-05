'use client';

import { User } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-black">SYSTEM LOGO</h1>
      </div>
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <span className="text-sm font-medium">Account Name</span>
      </div>
    </header>
  );
}
