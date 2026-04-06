'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  disabled = false,
  placeholder = 'Pick a date',
  hasError = false,
  fromDate,
  toDate,
}: Readonly<DatePickerProps>) {
  const disabledDays = (day: Date) => {
    if (fromDate && day <= fromDate) return true;
    if (toDate && day >= toDate) return true;
    return false;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-between gap-2 text-left font-medium',
            !date && 'text-muted-foreground',
            hasError && 'border-destructive focus-visible:ring-destructive/20',
            hasError && !date && '!text-destructive',
          )}
          disabled={disabled}
        >
          {date ? format(date, 'yyyy/MM/dd', { locale: ja }) : placeholder}
          <CalendarIcon className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={fromDate || toDate ? disabledDays : disabled}
          defaultMonth={date}
          captionLayout="dropdown"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
