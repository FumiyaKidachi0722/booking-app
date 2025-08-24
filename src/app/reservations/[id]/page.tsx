'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';

interface Reservation {
  reservationId: string;
  amount: number;
  cancelFeePreview: number;
  startAtUTC: string;
}

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    fetch(`/api/reservations/${id}`)
      .then((res) => res.json())
      .then((data) => setReservation(data));
  }, [id]);

  if (!reservation) {
    return <p className="p-8">読み込み中...</p>;
  }

  return (
    <>
      <PageHeader title="予約詳細" />
      <div className="mx-auto max-w-xl space-y-4 p-8">
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
    </>
  );
}
