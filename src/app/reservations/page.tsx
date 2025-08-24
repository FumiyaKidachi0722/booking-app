'use client';

import { useEffect, useState } from 'react';

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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">予約一覧</h1>
      <ul className="space-y-2">
        {reservations.length === 0 && <li>予約がありません</li>}
        {reservations.map((r) => (
          <li key={r.reservationId} className="border p-2 rounded">
            <div>予約ID: {r.reservationId}</div>
            <div>金額: {r.amount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
