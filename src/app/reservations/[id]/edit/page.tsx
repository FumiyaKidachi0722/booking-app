'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';

export default function ReservationEditPage({ params }: { params: { id: string } }) {
  const [startAt, setStartAt] = useState<Date | undefined>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/reservations/${params.id}`)
      .then((res) => res.json())
      .then((data) => setStartAt(new Date(data.startAtUTC)))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/reservations/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startAtUTC: startAt?.toISOString() }),
    });
    router.push(`/reservations/${params.id}`);
  }

  if (loading) return <p className="p-8">読み込み中...</p>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 p-8">
      <DateTimePicker value={startAt} onChange={setStartAt} />
      <Button type="submit" className="w-full">
        保存
      </Button>
    </form>
  );
}
