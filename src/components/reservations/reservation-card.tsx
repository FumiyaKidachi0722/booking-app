import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card className="flex h-full w-full flex-col">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base">予約ID: {reservationId}</CardTitle>
          <CardDescription>金額: ¥{amount.toLocaleString()}</CardDescription>
          <CardDescription>開始: {new Date(startAtUTC).toLocaleString()}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          キャンセル料見込み: ¥{cancelFeePreview.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="mt-auto justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/reservations/${reservationId}`}>詳細</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/reservations/${reservationId}/edit`}>編集</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
