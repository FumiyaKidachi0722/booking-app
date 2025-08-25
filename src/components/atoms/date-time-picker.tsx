'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(value ? format(value, 'HH:mm') : '');

  function handleSelect(date: Date | undefined) {
    if (!date) {
      onChange(undefined);
      return;
    }
    const [h, m] = time.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      date.setHours(h);
      date.setMinutes(m);
    }
    onChange(date);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const t = e.target.value;
    setTime(t);
    if (value) {
      const [h, m] = t.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        const d = new Date(value);
        d.setHours(h);
        d.setMinutes(m);
        onChange(d);
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'yyyy-MM-dd') : '日付を選択'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={handleSelect} initialFocus />
        </PopoverContent>
      </Popover>
      <Input type="time" value={time} onChange={handleTimeChange} className="w-[100px]" />
    </div>
  );
}
