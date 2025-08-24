import { randomUUID } from 'crypto';

import type {
  CreateReservationCommand,
  Reservation,
  ReservationRepository,
} from '@/server/domain/reservation';

const reservations: Reservation[] = [];

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
