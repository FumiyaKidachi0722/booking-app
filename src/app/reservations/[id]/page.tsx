'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Reservation {
  reservationId: string;
  amount: number;
  cancelFeePreview: number;
  startAtUTC: string;
}

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    fetch(`/api/reservations/${params.id}`)
      .then((res) => res.json())
      .then((data) => setReservation(data));
  }, [params.id]);

  if (!reservation) {
    return <p className="p-8">読み込み中...</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">予約詳細</h1>
      <p>予約ID: {reservation.reservationId}</p>
      <p>金額: ¥{reservation.amount.toLocaleString()}</p>
      <p>開始: {new Date(reservation.startAtUTC).toLocaleString()}</p>
      <p>キャンセル料見込み: ¥{reservation.cancelFeePreview.toLocaleString()}</p>
      <Link
        className="text-blue-500 hover:underline"
        href={`/reservations/${reservation.reservationId}/edit`}
      >
        編集する
      </Link>
    </div>
  );
}
