'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { HEADER_HEIGHT } from '@/lib/constants';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className={`fixed top-0 left-0 z-50 w-full transition-colors ${
        scrolled ? 'bg-transparent' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-4">
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
