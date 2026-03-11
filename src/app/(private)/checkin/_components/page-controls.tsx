'use client';

import { useState } from 'react';

import { BellRing, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useSidebar } from '@/components/ui/sidebar';

interface PageControlsProps {
  currentDate: string;
  lastUpdated: string;
  onRefresh?: () => void;
  onDateChange?: (date: string) => void;
  onToggleNotifications?: () => void;
}

export function PageControls({
  currentDate,
  lastUpdated,
  onRefresh,
  onDateChange,
  onToggleNotifications,
}: Readonly<PageControlsProps>) {
  const { setOpen } = useSidebar();

  const parseJapaneseDate = (dateStr: string): Date => {
    const match = /(\d{4})年(\d{2})月(\d{2})日/.exec(dateStr);
    if (match) {
      return new Date(
        Number.parseInt(match[1]),
        Number.parseInt(match[2]) - 1,
        Number.parseInt(match[3]),
      );
    }
    return new Date();
  };

  const formatJapaneseDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(parseJapaneseDate(currentDate));

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const newDate = formatJapaneseDate(date);
      onDateChange?.(newDate);
    }
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    onDateChange?.(formatJapaneseDate(newDate));
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    onDateChange?.(formatJapaneseDate(newDate));
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">入退館</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <DatePicker date={selectedDate} onDateChange={handleDateChange} />
          <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">最終更新 {lastUpdated}</div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RotateCw className="h-4 w-4" />
          更新
        </Button>
        {/* <SidebarTrigger> */}
        <Button
          variant="outline"
          className="h-8 gap-2 px-3 text-xs font-medium"
          onClick={onToggleNotifications}
        >
          <BellRing className="h-3.5 w-3.5" />
          通知
          <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600">
            <span className="text-xs font-bold text-white">6</span>
          </div>
        </Button>
        {/* </SidebarTrigger> */}
      </div>
    </div>
  );
}
