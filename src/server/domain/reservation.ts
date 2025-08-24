import type { components } from "@/shared/types/generated/openapi.types";

export type CreateReservationCommand = components["schemas"]["CreateReservationRequest"];
export type Reservation = components["schemas"]["CreateReservationResponse"];

export interface ReservationRepository {
  create(cmd: CreateReservationCommand, idempotencyKey: string): Promise<Reservation>;
}
