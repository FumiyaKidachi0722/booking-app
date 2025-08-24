import type { Reservation, ReservationRepository } from '@/server/domain/reservation';

export class GetReservationUseCase {
  constructor(private repo: ReservationRepository) {}

  async execute(id: string): Promise<Reservation | undefined> {
    return this.repo.get(id);
  }
}
