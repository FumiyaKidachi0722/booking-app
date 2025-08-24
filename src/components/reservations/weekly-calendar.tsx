'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { addDays, addMinutes, format, startOfDay, startOfWeek } from 'date-fns';

interface Slot {
  hhmm: string;
  available: boolean;
}

interface WeeklyCalendarProps {
  tenantId: string;
  resourceId: string;
  selected?: Date;
  onSelect: (date: Date) => void;
}

export function WeeklyCalendar({ tenantId, resourceId, selected, onSelect }: WeeklyCalendarProps) {
  const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );
  const [data, setData] = useState<Record<string, Slot[]>>({});

  useEffect(() => {
    if (!tenantId || !resourceId) return;
    setData({});
    let ignore = false;
    Promise.all(
      days.map(async (day) => {
        const dateUTC = format(day, 'yyyy-MM-dd');
        try {
          const res = await fetch(
            `/api/availability?tenantId=${tenantId}&resourceId=${resourceId}&dateUTC=${dateUTC}`,
          );
          if (!res.ok) throw new Error('Failed to fetch');
          const json = await res.json();
          return { dateUTC, slots: json.slots as Slot[] };
        } catch (e) {
          console.error(e);
          return { dateUTC, slots: [] as Slot[] };
        }
      }),
    ).then((results) => {
      if (ignore) return;
      setData(
        results.reduce<Record<string, Slot[]>>((acc, cur) => {
          acc[cur.dateUTC] = cur.slots;
          return acc;
        }, {}),
      );
    });
    return () => {
      ignore = true;
    };
  }, [tenantId, resourceId, days]);

  const times = Array.from({ length: (18 - 9) * 4 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 9 * 60 + i * 15),
  );

  if (!tenantId || !resourceId) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-gray-500">
        テナントIDとリソースIDを入力してください
      </div>
    );
  }

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
                      : 'cursor-not-allowed bg-gray-100',
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
