'use client';

import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { ReservationCard } from '@/components/reservations/reservation-card';
import { Button } from '@/components/ui/button';

interface Reservation {
  reservationId: string;
  amount: number;
  cancelFeePreview: number;
  startAtUTC: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [view, setView] = useState<'list' | 'date'>('list');

  useEffect(() => {
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch(() => setReservations([]));
  }, []);

  return (
    <>
      <PageHeader title="予約一覧" />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            リスト
          </Button>
          <Button
            variant={view === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('date')}
          >
            日付
          </Button>
        </div>
        {reservations.length === 0 ? (
          <EmptyState message="まだ予約がありません" ctaHref="/reserve" ctaLabel="予約する" />
        ) : (
          <>
            {view === 'list' && (
              <div className="grid w-full gap-6 sm:grid-cols-2">
                {reservations.map((r) => (
                  <ReservationCard key={r.reservationId} {...r} />
                ))}
              </div>
            )}
            {view === 'date' && (
              <div className="space-y-6">
                {Object.entries(
                  reservations.reduce<Record<string, Reservation[]>>((acc, r) => {
                    const date = r.startAtUTC.split('T')[0];
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(r);
                    return acc;
                  }, {}),
                ).map(([date, list]) => (
                  <div key={date} className="space-y-2">
                    <h2 className="text-lg font-semibold">{date}</h2>
                    <div className="grid w-full gap-6 sm:grid-cols-2">
                      {list.map((r) => (
                        <ReservationCard key={r.reservationId} {...r} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
