import { PageHeader } from '@/components/page-header';
import { ReservationForm } from '@/components/reservations/reservation-form';

export default function ReservePage() {
  return (
    <>
      <PageHeader title="予約する" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReservationForm />
      </div>
    </>
  );
}
