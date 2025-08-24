'use client';

import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/empty-state';
import { ReservationCard } from '@/components/reservations/reservation-card';

interface Reservation {
  reservationId: string;
  amount: number;
  cancelFeePreview: number;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch(() => setReservations([]));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <h1 className="text-2xl font-bold">予約一覧</h1>
      {reservations.length === 0 ? (
        <EmptyState message="まだ予約がありません" ctaHref="/reserve" ctaLabel="予約する" />
      ) : (
        <div className="grid w-full gap-6 sm:grid-cols-2">
          {reservations.map((r) => (
            <ReservationCard key={r.reservationId} {...r} />
          ))}
        </div>
      )}
    </div>
  );
}
