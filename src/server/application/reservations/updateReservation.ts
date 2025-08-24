import type { Reservation, ReservationRepository } from '@/server/domain/reservation';

export class UpdateReservationUseCase {
  constructor(private repo: ReservationRepository) {}

  async execute(
    id: string,
    data: Partial<Pick<Reservation, 'startAtUTC' | 'amount' | 'cancelFeePreview'>>,
  ): Promise<Reservation | undefined> {
    return this.repo.update(id, data);
  }
}
