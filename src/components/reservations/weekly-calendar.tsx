'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { addDays, addMinutes, format, startOfDay, startOfWeek } from 'date-fns';

interface Slot {
  hhmm: string;
  available: boolean;
}

interface WeeklyCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
}

export function WeeklyCalendar({ selected, onSelect }: WeeklyCalendarProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [data, setData] = useState<Record<string, Slot[]>>({});

  useEffect(() => {
    const daysToFetch = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    daysToFetch.forEach((day) => {
      const dateUTC = format(day, 'yyyy-MM-dd');
      fetch(`/api/availability?tenantId=dummy&resourceId=dummy&dateUTC=${dateUTC}`)
        .then((res) => res.json())
        .then((json) => setData((prev) => ({ ...prev, [dateUTC]: json.slots })));
    });
  }, [weekStart]);

  const times = Array.from({ length: (18 - 9) * 4 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 9 * 60 + i * 15),
  );

  return (
    <div className="overflow-auto">
      <div className="grid" style={{ gridTemplateColumns: `4rem repeat(7, 1fr)` }}>
        <div />
        {days.map((day) => (
          <div key={day.toISOString()} className="p-1 text-center text-sm font-medium">
            {format(day, 'MM/dd')}
          </div>
        ))}
        {times.map((time, rowIdx) => (
          <div key={rowIdx} className="contents">
            <div className="p-1 text-xs text-right">{format(time, 'HH:mm')}</div>
            {days.map((day) => {
              const dateUTC = format(day, 'yyyy-MM-dd');
              const hhmm = format(time, 'HHmm');
              const slotDate = new Date(`${dateUTC}T${format(time, 'HH:mm')}:00Z`);
              const slot = data[dateUTC]?.find((s) => s.hhmm === hhmm);
              const available = slot?.available;
              const isSelected = selected && selected.getTime() === slotDate.getTime();
              return (
                <button
                  key={dateUTC + hhmm}
                  disabled={!available}
                  onClick={() => available && onSelect(slotDate)}
                  className={clsx(
                    'h-8 border text-xs',
                    available
                      ? 'bg-green-100 hover:bg-green-200'
                      : 'bg-gray-100 cursor-not-allowed',
                    isSelected && 'bg-blue-500 text-white',
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
