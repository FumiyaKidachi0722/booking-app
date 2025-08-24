import type { Reservation, ReservationRepository } from '@/server/domain/reservation';

export class ListReservationsUseCase {
  constructor(private repo: ReservationRepository) {}

  async execute(): Promise<Reservation[]> {
    return this.repo.list();
  }
}
