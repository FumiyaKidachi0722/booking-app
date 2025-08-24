import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          Booking App
        </Link>
        <nav className="space-x-4 text-sm font-medium">
          <Link href="/reserve" className="hover:underline">
            予約する
          </Link>
          <Link href="/reservations" className="hover:underline">
            予約一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
