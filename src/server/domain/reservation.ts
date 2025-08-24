import type { components } from '@/shared/types/generated/openapi.types';

export type CreateReservationCommand = components['schemas']['CreateReservationRequest'];

// Reservation entity persisted in the repository. In addition to the fields
// returned from the API, we store the start time so that the UI can display and
// group reservations by date.
export interface Reservation {
  reservationId: string;
  tenantId: string;
  resourceId: string;
  amount: number;
  cancelFeePreview: number;
  startAtUTC: string;
  durationMin: number;
}

export interface ReservationRepository {
  create(cmd: CreateReservationCommand, idempotencyKey: string): Promise<Reservation>;
  list(): Promise<Reservation[]>;
  get(id: string): Promise<Reservation | undefined>;
  update(
    id: string,
    data: Partial<Pick<Reservation, 'startAtUTC' | 'amount' | 'cancelFeePreview' | 'durationMin'>>,
  ): Promise<Reservation | undefined>;
}
