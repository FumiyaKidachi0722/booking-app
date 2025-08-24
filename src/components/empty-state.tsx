import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  message: string;
  ctaHref: string;
  ctaLabel: string;
}

export function EmptyState({ message, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="text-center rounded-xl border p-8">
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      <Button asChild>
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
