import { PageHeader } from '@/components/page-header';
import { ReservationSetupForm } from '@/components/reservations/reservation-setup-form';

export default function ReserveSetupPage() {
  return (
    <>
      <PageHeader title="予約対象の選択" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReservationSetupForm />
      </div>
    </>
  );
}
