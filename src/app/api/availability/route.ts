import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { InMemoryReservationRepository } from '@/server/infrastructure/inMemoryReservationRepository';

const querySchema = z.object({
  tenantId: z.string(),
  resourceId: z.string(),
  dateUTC: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'dateUTC must be YYYY-MM-DD'),
  unitMin: z.coerce.number().int().positive().optional().default(15),
});

export async function GET(req: NextRequest) {
  try {
    const {
      tenantId: _tenantId,
      resourceId: _resourceId,
      dateUTC,
      unitMin,
    } = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams));

    // InMemory implementation ignores tenant/resource and checks all reservations
    const repo = new InMemoryReservationRepository();
    const reservations = await repo.list();

    const dayStart = new Date(`${dateUTC}T00:00:00Z`);
    const totalSlots = (24 * 60) / unitMin;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const slotStart = new Date(dayStart.getTime() + i * unitMin * 60000);
      const slotEnd = new Date(slotStart.getTime() + unitMin * 60000);
      const hhmm = slotStart.toISOString().substring(11, 16).replace(':', '');
      const available = !reservations.some((r) => {
        const start = new Date(r.startAtUTC).getTime();
        const end = start + r.durationMin * 60000;
        return slotStart.getTime() < end && slotEnd.getTime() > start;
      });
      return { hhmm, available };
    });

    return NextResponse.json({ unitMin, slots });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors.map((e) => e.message).join(', ')
        : (error as Error).message;
    return NextResponse.json({ code: 'bad_request', message }, { status: 400 });
  }
}
