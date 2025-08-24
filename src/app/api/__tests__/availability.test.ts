import type { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { InMemoryReservationRepository } from '@/server/infrastructure/inMemoryReservationRepository';

import { GET } from '../availability/route';

function makeRequest(search: string) {
  const url = new URL(`http://localhost/api/availability${search}`);
  return { nextUrl: url } as unknown as NextRequest;
}

describe('GET /api/availability', () => {
  it('marks reserved slots as unavailable', async () => {
    const repo = new InMemoryReservationRepository();
    await repo.create(
      {
        tenantId: 't',
        locationId: 'l',
        resourceId: 'r',
        serviceId: 's',
        customerId: 'c',
        startAtUTC: '2025-08-24T10:00:00.000Z',
        durationMin: 60,
        people: 1,
      },
      'key',
    );

    const res = await GET(makeRequest('?tenantId=t&resourceId=r&dateUTC=2025-08-24'));
    expect(res.status).toBe(200);
    const json = await res.json();
    const slot = json.slots.find((s: { hhmm: string; available: boolean }) => s.hhmm === '1000');
    expect(slot).toBeDefined();
    expect(slot?.available).toBe(false);
  });
});
