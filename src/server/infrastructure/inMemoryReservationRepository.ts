import { randomUUID } from "crypto";

import type {
  CreateReservationCommand,
  Reservation,
  ReservationRepository,
} from "@/server/domain/reservation";

export class InMemoryReservationRepository implements ReservationRepository {
  async create(
    _command: CreateReservationCommand,
    _idempotencyKey: string,
  ): Promise<Reservation> {
    return {
      reservationId: randomUUID(),
      amount: 0,
      cancelFeePreview: 0,
    };
  }
}
