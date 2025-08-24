import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { GetReservationUseCase } from '@/server/application/reservations/getReservation';
import { UpdateReservationUseCase } from '@/server/application/reservations/updateReservation';
import { InMemoryReservationRepository } from '@/server/infrastructure/inMemoryReservationRepository';

const updateSchema = z.object({
  startAtUTC: z.string().optional(),
  amount: z.number().int().nonnegative().optional(),
  cancelFeePreview: z.number().int().nonnegative().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = new InMemoryReservationRepository();
  const useCase = new GetReservationUseCase(repo);
  const reservation = await useCase.execute(id);
  if (!reservation) {
    return NextResponse.json(
      { code: 'not_found', message: 'Reservation not found' },
      { status: 404 },
    );
  }
  return NextResponse.json(reservation, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const json = await req.json();
    const command = updateSchema.parse(json);
    const repo = new InMemoryReservationRepository();
    const useCase = new UpdateReservationUseCase(repo);
    const { id } = await params;
    const updated = await useCase.execute(id, command);
    if (!updated) {
      return NextResponse.json(
        { code: 'not_found', message: 'Reservation not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors.map((e) => e.message).join(', ')
        : (error as Error).message;
    return NextResponse.json({ code: 'bad_request', message }, { status: 400 });
  }
}
