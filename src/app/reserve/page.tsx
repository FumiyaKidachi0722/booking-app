import { PageHeader } from '@/components/page-header';
import { ReservationForm } from '@/components/reservations/reservation-form';

interface ReservePageProps {
  searchParams?: {
    tenantId?: string;
    locationId?: string;
    resourceId?: string;
    serviceId?: string;
  };
}

export default function ReservePage({ searchParams }: ReservePageProps) {
  return (
    <>
      <PageHeader title="予約する" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReservationForm
          tenantId={searchParams?.tenantId ?? ''}
          locationId={searchParams?.locationId ?? ''}
          resourceId={searchParams?.resourceId ?? ''}
          serviceId={searchParams?.serviceId ?? ''}
        />
      </div>
    </>
  );
}
