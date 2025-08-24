import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Booking App</h1>
      <Link href="/reserve" className="text-blue-600 underline hover:no-underline">
        予約する
      </Link>
      <Link href="/reservations" className="text-blue-600 underline hover:no-underline">
        予約一覧
      </Link>
    </main>
  );
}
