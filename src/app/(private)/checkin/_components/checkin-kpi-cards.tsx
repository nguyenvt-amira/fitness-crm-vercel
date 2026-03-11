import { Mars, Users, Venus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface KpiCounterProps {
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

export function CheckinKpiCards({ maleCount, femaleCount, totalCount }: Readonly<KpiCounterProps>) {
  return (
    <Card className="border border-gray-100 p-0 shadow-sm">
      <div className="flex flex-col gap-5 px-4 py-4">
        {/* Header with Title and Buttons */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">人数カウント</h3>
          <div className="flex gap-0 rounded-lg border border-gray-200 bg-white">
            <Button size="sm" className="rounded-none rounded-l-lg bg-gray-800 text-white">
              在館
            </Button>
            <Button size="sm" variant="ghost" className="rounded-none rounded-r-lg text-gray-600">
              来館
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Male Card */}
          <div className="flex flex-col gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
            <div className="flex items-center justify-center gap-1">
              <Mars className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-bold text-blue-600">男性</p>
            </div>
            <p className="text-center text-5xl font-bold text-blue-700">{maleCount}</p>
          </div>

          {/* Female Card */}
          <div className="flex flex-col gap-2 rounded-2xl border border-pink-200 bg-pink-50 px-4 py-4">
            <div className="flex items-center justify-center gap-1">
              <Venus className="h-4 w-4 text-pink-600" />
              <p className="text-sm font-bold text-pink-600">女性</p>
            </div>
            <p className="text-center text-5xl font-bold text-pink-700">{femaleCount}</p>
          </div>

          {/* Total Card */}
          <div className="flex flex-col gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-4">
            <div className="flex items-center justify-center gap-1">
              {/* <Users className="h-4 w-4 text-green-600" /> */}
              <p className="text-sm font-bold text-green-600">合計</p>
            </div>
            <p className="text-center text-5xl font-bold text-green-700">{totalCount}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
