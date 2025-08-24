'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">予約一覧</h1>
      {reservations.length === 0 ? (
        <div className="text-center rounded-xl border p-8">
          <p className="mb-4 text-sm text-muted-foreground">まだ予約がありません</p>
          <Button asChild>
            <Link href="/reserve">予約する</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <Card key={r.reservationId}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">予約ID: {r.reservationId}</CardTitle>
                  <CardDescription>金額: ¥{r.amount.toLocaleString()}</CardDescription>
                </div>
                <CardAction>
                  <Button variant="outline" size="sm" disabled>
                    詳細
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  キャンセル料見込み: ¥{r.cancelFeePreview.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
