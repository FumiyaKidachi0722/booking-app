import type {
  CreateReservationCommand,
  Reservation,
  ReservationRepository,
} from "@/server/domain/reservation";

export class CreateReservationUseCase {
  constructor(private repo: ReservationRepository) {}

  async execute(
    command: CreateReservationCommand,
    idempotencyKey: string,
  ): Promise<Reservation> {
    // In a real implementation, idempotencyKey would be used to prevent duplicates
    return this.repo.create(command, idempotencyKey);
  }
}
