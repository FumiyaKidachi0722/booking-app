import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { schemas } from "@/shared/types/generated/openapi.zod";

const bodySchema = schemas.CreateReservationRequest;

export async function POST(req: NextRequest) {
  const idempotencyKey = req.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return NextResponse.json(
      {
        code: "missing_idempotency_key",
        message: "Idempotency-Key header is required",
      },
      { status: 400 },
    );
  }

  try {
    const json = await req.json();
    bodySchema.parse(json);

    return NextResponse.json(
      { reservationId: "dummy", amount: 0, cancelFeePreview: 0 },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors.map((e) => e.message).join(", ")
        : (error as Error).message;
    return NextResponse.json({ code: "bad_request", message }, { status: 400 });
  }
}
