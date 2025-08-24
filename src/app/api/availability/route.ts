import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { BUSINESS_END_HOUR, BUSINESS_START_HOUR } from '@/lib/constants';
import { availabilityByDate } from '@/lib/mockAvailability';
import { InMemoryReservationRepository } from '@/server/infrastructure/inMemoryReservationRepository';

const querySchema = z.object({
  tenantId: z.string(),
  resourceId: z.string(),
  dateUTC: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'dateUTC must be YYYY-MM-DD'),
  unitMin: z.coerce.number().int().positive().optional().default(15),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId, resourceId, dateUTC, unitMin } = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );

    const repo = new InMemoryReservationRepository();
    const reservations = (await repo.list()).filter(
      (r) => r.tenantId === tenantId && r.resourceId === resourceId,
    );

    const todayUTC = new Date().toISOString().substring(0, 10);
    if (dateUTC < todayUTC) {
      return NextResponse.json({ unitMin, slots: [] });
    }

    const dayStart = new Date(`${dateUTC}T00:00:00Z`);
    const forcedSlots = availabilityByDate[dateUTC];
    const startMinutes = BUSINESS_START_HOUR * 60;
    const endMinutes = BUSINESS_END_HOUR * 60;
    const totalSlots = (endMinutes - startMinutes) / unitMin;
    const now = new Date();

    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const slotStart = new Date(dayStart.getTime() + (startMinutes + i * unitMin) * 60000);
      const slotEnd = new Date(slotStart.getTime() + unitMin * 60000);
      const hhmm = slotStart.toISOString().substring(11, 16).replace(':', '');
      const isPastSlot = dateUTC === todayUTC && slotStart.getTime() < now.getTime();
      const available = forcedSlots
        ? !isPastSlot && forcedSlots.includes(hhmm)
        : !isPastSlot &&
          !reservations.some((r) => {
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
