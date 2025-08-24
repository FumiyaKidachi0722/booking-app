import type { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import { InMemoryReservationRepository } from '@/server/infrastructure/inMemoryReservationRepository';

import { GET } from '../availability/route';

function makeRequest(search: string) {
  const url = new URL(`http://localhost/api/availability${search}`);
  return { nextUrl: url } as unknown as NextRequest;
}

describe('GET /api/availability', () => {
  it('filters availability by tenant and resource', async () => {
    vi.setSystemTime(new Date('2025-08-24T09:00:00.000Z'));
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
    const json = await res.json();
    const slot = json.slots.find((s: { hhmm: string; available: boolean }) => s.hhmm === '1000');
    expect(slot?.available).toBe(false);

    const otherTenant = await GET(makeRequest('?tenantId=other&resourceId=r&dateUTC=2025-08-24'));
    const otherTenantJson = await otherTenant.json();
    const otherTenantSlot = otherTenantJson.slots.find(
      (s: { hhmm: string; available: boolean }) => s.hhmm === '1000',
    );
    expect(otherTenantSlot?.available).toBe(true);

    const otherResource = await GET(makeRequest('?tenantId=t&resourceId=other&dateUTC=2025-08-24'));
    const otherResourceJson = await otherResource.json();
    const otherResourceSlot = otherResourceJson.slots.find(
      (s: { hhmm: string; available: boolean }) => s.hhmm === '1000',
    );
    expect(otherResourceSlot?.available).toBe(true);
    vi.useRealTimers();
  });

  it('excludes past times and slots outside business hours', async () => {
    vi.setSystemTime(new Date('2025-08-24T09:30:00.000Z'));
    const res = await GET(makeRequest('?tenantId=t&resourceId=r&dateUTC=2025-08-24'));
    const json = await res.json();
    expect(json.slots.some((s: { hhmm: string }) => s.hhmm === '0800')).toBe(false);
    const slot0900 = json.slots.find((s: { hhmm: string }) => s.hhmm === '0900');
    expect(slot0900?.available).toBe(false);
    const slot0930 = json.slots.find((s: { hhmm: string }) => s.hhmm === '0930');
    expect(slot0930?.available).toBe(true);
    vi.useRealTimers();
  });

  it('returns dummy availability for configured dates', async () => {
    vi.setSystemTime(new Date('2025-08-24T00:00:00.000Z'));
    const res = await GET(makeRequest('?tenantId=t&resourceId=r&dateUTC=2025-08-25'));
    const json = await res.json();
    const available = json.slots
      .filter((s: { available: boolean }) => s.available)
      .map((s: { hhmm: string }) => s.hhmm);
    expect(available).toEqual(['0900', '0930', '1400', '1430']);
    vi.useRealTimers();
  });
});
