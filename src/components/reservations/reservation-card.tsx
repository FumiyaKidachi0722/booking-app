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

interface ReservationCardProps {
  reservationId: string;
  amount: number;
  cancelFeePreview: number;
  startAtUTC: string;
}

export function ReservationCard({
  reservationId,
  amount,
  cancelFeePreview,
  startAtUTC,
}: ReservationCardProps) {
  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">予約ID: {reservationId}</CardTitle>
          <CardDescription>金額: ¥{amount.toLocaleString()}</CardDescription>
          <CardDescription>開始: {new Date(startAtUTC).toLocaleString()}</CardDescription>
        </div>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/reservations/${reservationId}`}>詳細</Link>
          </Button>
          <Button variant="outline" size="sm" className="ml-2" asChild>
            <Link href={`/reservations/${reservationId}/edit`}>編集</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          キャンセル料見込み: ¥{cancelFeePreview.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
