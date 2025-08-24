import React from 'react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';

export default function Home() {
  return (
    <>
      <PageHeader title="Booking App" imageUrl="/globe.svg" />
      <main className="flex flex-col items-center justify-center gap-4 p-4">
        <Link href="/reserve" className="text-blue-600 underline hover:no-underline">
          予約する
        </Link>
        <Link href="/reservations" className="text-blue-600 underline hover:no-underline">
          予約一覧
        </Link>
      </main>
    </>
  );
}
