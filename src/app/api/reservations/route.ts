import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { CreateReservationUseCase } from '@/server/application/reservations/createReservation';
import { ListReservationsUseCase } from '@/server/application/reservations/listReservations';
import { InMemoryReservationRepository } from '@/server/infrastructure/inMemoryReservationRepository';
import { schemas } from '@/shared/types/generated/openapi.zod';

const bodySchema = schemas.CreateReservationRequest;

export async function POST(req: NextRequest) {
  const idempotencyKey = req.headers.get('Idempotency-Key');
  if (!idempotencyKey) {
    return NextResponse.json(
      {
        code: 'missing_idempotency_key',
        message: 'Idempotency-Key header is required',
      },
      { status: 400 },
    );
  }

  try {
    const json = await req.json();
    const command = bodySchema.parse(json);

    const repo = new InMemoryReservationRepository();
    const useCase = new CreateReservationUseCase(repo);
    const result = await useCase.execute(command, idempotencyKey);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors.map((e) => e.message).join(', ')
        : (error as Error).message;
    return NextResponse.json({ code: 'bad_request', message }, { status: 400 });
  }
}

export async function GET() {
  const repo = new InMemoryReservationRepository();
  const useCase = new ListReservationsUseCase(repo);
  const reservations = await useCase.execute();
  return NextResponse.json(reservations, { status: 200 });
}
