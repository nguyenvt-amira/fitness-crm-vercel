'use client';

import { Users } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface RealtimeStatusProps {
  totalCurrent: number;
  maleCurrent: number;
  femaleCurrent: number;
  totalToday: number;
  maleToday: number;
  femaleToday: number;
}

export function RealtimeStatus({
  totalCurrent,
  maleCurrent,
  femaleCurrent,
  totalToday,
  maleToday,
  femaleToday,
}: RealtimeStatusProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">リアルタイム稼働状況</h2>
      <div className="flex gap-4">
        {/* Total Current */}
        <Card className="flex flex-1 flex-col gap-6 rounded-lg border p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">現在の入館者数</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{totalCurrent}人</span>
              <span className="text-sm text-gray-500">在館</span>
            </div>
            <p className="text-sm text-gray-500">{totalToday}人来館</p>
          </div>
        </Card>

        {/* Male Current */}
        <Card className="flex flex-1 flex-col gap-6 rounded-lg border p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">男性</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{maleCurrent}人</span>
              <span className="text-sm text-gray-500">在館</span>
            </div>
            <p className="text-sm text-gray-500">{maleToday}人来館</p>
          </div>
        </Card>

        {/* Female Current */}
        <Card className="flex flex-1 flex-col gap-6 rounded-lg border p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50">
            <Users className="h-6 w-6 text-pink-600" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">女性</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{femaleCurrent}人</span>
              <span className="text-sm text-gray-500">在館</span>
            </div>
            <p className="text-sm text-gray-500">{femaleToday}人来館</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
