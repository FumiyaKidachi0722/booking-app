import { randomUUID } from 'crypto';

import type {
  CreateReservationCommand,
  Reservation,
  ReservationRepository,
} from '@/server/domain/reservation';

// Seed with dummy reservations until a real database is connected
const reservations: Reservation[] = [
  {
    reservationId: 'dummy-1',
    amount: 5000,
    cancelFeePreview: 500,
  },
  {
    reservationId: 'dummy-2',
    amount: 8000,
    cancelFeePreview: 0,
  },
];

export class InMemoryReservationRepository implements ReservationRepository {
  async create(_command: CreateReservationCommand, _idempotencyKey: string): Promise<Reservation> {
    const reservation = {
      reservationId: randomUUID(),
      amount: 0,
      cancelFeePreview: 0,
    } satisfies Reservation;
    reservations.push(reservation);
    return reservation;
  }

  async list(): Promise<Reservation[]> {
    return reservations;
  }
}
