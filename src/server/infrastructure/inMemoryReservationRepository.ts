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
    startAtUTC: new Date().toISOString(),
    durationMin: 60,
  },
  {
    reservationId: 'dummy-2',
    amount: 8000,
    cancelFeePreview: 0,
    startAtUTC: new Date(Date.now() + 86400000).toISOString(),
    durationMin: 60,
  },
];

export class InMemoryReservationRepository implements ReservationRepository {
  async create(command: CreateReservationCommand, _idempotencyKey: string): Promise<Reservation> {
    const reservation: Reservation = {
      reservationId: randomUUID(),
      amount: 0,
      cancelFeePreview: 0,
      startAtUTC: command.startAtUTC,
      durationMin: command.durationMin,
    };
    reservations.push(reservation);
    return reservation;
  }

  async list(): Promise<Reservation[]> {
    return reservations;
  }

  async get(id: string): Promise<Reservation | undefined> {
    return reservations.find((r) => r.reservationId === id);
  }

  async update(
    id: string,
    data: Partial<Pick<Reservation, 'startAtUTC' | 'amount' | 'cancelFeePreview' | 'durationMin'>>,
  ): Promise<Reservation | undefined> {
    const r = await this.get(id);
    if (!r) return undefined;
    Object.assign(r, data);
    return r;
  }
}
