import { PageHeader } from '@/components/page-header';
import { ReservationForm } from '@/components/reservations/reservation-form';

interface ReserveCreatePageProps {
  searchParams: Promise<{
    tenantId?: string;
    locationId?: string;
    resourceId?: string;
    serviceId?: string;
  }>;
}

export default async function ReserveCreatePage({ searchParams }: ReserveCreatePageProps) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="予約する" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReservationForm
          tenantId={params?.tenantId ?? ''}
          locationId={params?.locationId ?? ''}
          resourceId={params?.resourceId ?? ''}
          serviceId={params?.serviceId ?? ''}
        />
      </div>
    </>
  );
}
