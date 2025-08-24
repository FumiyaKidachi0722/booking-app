import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { POST } from "../reservations/route";

const validBody = {
  tenantId: "t1",
  locationId: "l1",
  resourceId: "r1",
  serviceId: "s1",
  customerId: "c1",
  startAtUTC: "2025-08-24T10:00:00.000Z",
  durationMin: 60,
  people: 2,
};

function makeRequest(body: unknown, headers: HeadersInit = {}) {
  return new Request("http://localhost/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/reservations", () => {
  it("requires Idempotency-Key header", async () => {
    const res = await POST(makeRequest(validBody) as unknown as NextRequest);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("missing_idempotency_key");
  });

  it("validates request body", async () => {
    const badBody = { ...validBody, durationMin: 10 };
    const res = await POST(
      makeRequest(badBody, {
        "Idempotency-Key": "abc",
      }) as unknown as NextRequest,
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("bad_request");
  });

  it("returns reservation for valid request", async () => {
    const res = await POST(
      makeRequest(validBody, {
        "Idempotency-Key": "abc",
      }) as unknown as NextRequest,
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("reservationId");
  });
});
