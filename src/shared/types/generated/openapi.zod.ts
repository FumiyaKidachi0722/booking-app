import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ReservationStatus = z.enum([
  "pending_payment",
  "confirmed",
  "cancelled",
  "no_show",
  "completed",
]);
const Reservation = z
  .object({
    id: z.string(),
    tenantId: z.string(),
    locationId: z.string(),
    serviceId: z.string(),
    primaryResourceId: z.string(),
    customerId: z.string(),
    status: ReservationStatus,
    startAtUTC: z.string().datetime({ offset: true }),
    endAtUTC: z.string().datetime({ offset: true }),
    people: z.number().int().gte(1),
    extraSnapshot: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const ReservationListResponse = z
  .object({ items: z.array(Reservation), nextPageToken: z.string().nullish() })
  .passthrough();
const CreateReservationRequest = z
  .object({
    tenantId: z.string(),
    locationId: z.string(),
    resourceId: z.string(),
    serviceId: z.string(),
    customerId: z.string(),
    startAtUTC: z.string().datetime({ offset: true }),
    durationMin: z.number().int().gte(15),
    people: z.number().int().gte(1),
    seatType: z.string().optional(),
    hasNomination: z.boolean().optional(),
    nominationType: z.enum(["none", "in", "regular"]).optional(),
  })
  .passthrough();
const CreateReservationResponse = z
  .object({
    reservationId: z.string(),
    amount: z.number().int(),
    cancelFeePreview: z.number().int(),
  })
  .passthrough();
const ErrorResponse = z
  .object({ code: z.string(), message: z.string() })
  .passthrough();
const ExtendReservationRequest = z
  .object({
    additionalMin: z.number().int().gte(5),
    recalcPricing: z.boolean().optional().default(true),
  })
  .passthrough();
const ExtendReservationResponse = z
  .object({
    reservationId: z.string(),
    newEndAtUTC: z.string().datetime({ offset: true }),
    additionalAmount: z.number().int(),
  })
  .passthrough();
const CancelReservationRequest = z
  .object({ reason: z.string().max(200), waiveFee: z.boolean().default(false) })
  .partial()
  .passthrough();
const CancelReservationResponse = z
  .object({
    reservationId: z.string(),
    canceledAtUTC: z.string().datetime({ offset: true }),
    cancelFee: z.number().int(),
    refundedAmount: z.number().int(),
  })
  .passthrough();
const AvailabilityResponse = z
  .object({
    unitMin: z.number().int(),
    slots: z.array(
      z.object({ hhmm: z.string(), available: z.boolean() }).passthrough()
    ),
  })
  .passthrough();
const TimeWindow = z.object({
  startMin: z.number().int().gte(0).lte(2880),
  endMin: z.number().int().gte(1).lte(2880),
});
const RuleCond = z
  .object({
    dow: z.array(z.number().int().gte(0).lte(6)),
    time: TimeWindow,
    seatTypeIn: z.array(z.string()),
    hasNomination: z.boolean(),
    nominationType: z.enum(["none", "in", "regular"]),
    peopleGte: z.number().int().gte(1),
    peopleLte: z.number().int().gte(1),
    courseIdIn: z.array(z.string()),
  })
  .partial();
const CalcFixed = z
  .object({ kind: z.literal("fixed"), value: z.number().int().gte(0) })
  .passthrough();
const CalcPerTime = z
  .object({
    kind: z.literal("per_time"),
    unitMin: z.number().int().gte(1),
    unitPrice: z.number().int().gte(0),
  })
  .passthrough();
const CalcPerPerson = z
  .object({ kind: z.literal("per_person"), unitPrice: z.number().int().gte(0) })
  .passthrough();
const CalcPercent = z
  .object({ kind: z.literal("percent"), rate: z.number().gte(-1).lte(5) })
  .passthrough();
const PricingRule = z.object({
  id: z.string(),
  name: z.string(),
  when: RuleCond,
  calc: z.array(z.union([CalcFixed, CalcPerTime, CalcPerPerson, CalcPercent])),
  applyTo: z
    .enum(["subtotal", "service", "tax"])
    .optional()
    .default("subtotal"),
  priority: z.number().int().optional().default(100),
  breakOnMatch: z.boolean().optional().default(false),
});
const PricingConfig = z.object({
  currency: z.string().min(3),
  rounding: z.enum(["floor", "ceil", "round"]),
  serviceRate: z.number().gte(0),
  taxRate: z.number().gte(0),
  rules: z.array(PricingRule),
});
const ResolvedPricingConfig = z
  .object({
    cat: z.literal("pricing"),
    versionTag: z.string(),
    cfg: PricingConfig,
  })
  .passthrough();
const CancellationPolicy = z.object({
  tiersAsc: z.array(
    z
      .object({
        thresholdMin: z.number().int().gte(0),
        fee: z.union([
          z
            .object({
              kind: z.literal("percent"),
              rate: z.number().gte(0).lte(1),
            })
            .passthrough(),
          z
            .object({
              kind: z.literal("fixed"),
              amount: z.number().int().gte(0),
            })
            .passthrough(),
        ]),
      })
      .passthrough()
  ),
  noShow: z
    .object({ kind: z.literal("percent"), rate: z.number().gte(0).lte(1) })
    .passthrough(),
  boundaryRule: z.enum(["gte", "gt"]),
});
const ResolvedCancellationPolicy = z
  .object({
    cat: z.literal("cancellation"),
    versionTag: z.string(),
    cfg: CancellationPolicy,
  })
  .passthrough();

export const schemas = {
  ReservationStatus,
  Reservation,
  ReservationListResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  ErrorResponse,
  ExtendReservationRequest,
  ExtendReservationResponse,
  CancelReservationRequest,
  CancelReservationResponse,
  AvailabilityResponse,
  TimeWindow,
  RuleCond,
  CalcFixed,
  CalcPerTime,
  CalcPerPerson,
  CalcPercent,
  PricingRule,
  PricingConfig,
  ResolvedPricingConfig,
  CancellationPolicy,
  ResolvedCancellationPolicy,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/availability",
    alias: "searchAvailability",
    requestFormat: "json",
    parameters: [
      {
        name: "tenantId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "resourceId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "dateUTC",
        type: "Query",
        schema: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
      },
      {
        name: "unitMin",
        type: "Query",
        schema: z.number().int().gte(5).lte(60).optional().default(15),
      },
    ],
    response: AvailabilityResponse,
    errors: [
      {
        status: 400,
        description: `入力不正`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/config/preview",
    alias: "previewConfig",
    requestFormat: "json",
    parameters: [
      {
        name: "category",
        type: "Query",
        schema: z.enum(["pricing", "cancellation"]),
      },
      {
        name: "tenantId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "locationId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "productId",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.union([ResolvedPricingConfig, ResolvedCancellationPolicy]),
    errors: [
      {
        status: 400,
        description: `入力不正`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/payments/webhook",
    alias: "paymentsWebhook",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `入力不正`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/reservations",
    alias: "listReservations",
    requestFormat: "json",
    parameters: [
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(1).lte(200).optional().default(50),
      },
      {
        name: "pageToken",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "tenantId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "locationId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z
          .enum([
            "pending_payment",
            "confirmed",
            "cancelled",
            "no_show",
            "completed",
          ])
          .optional(),
      },
      {
        name: "fromUTC",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "toUTC",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "customerId",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: ReservationListResponse,
  },
  {
    method: "post",
    path: "/api/reservations",
    alias: "createReservation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateReservationRequest,
      },
      {
        name: "Idempotency-Key",
        type: "Header",
        schema: z.string().min(1),
      },
    ],
    response: CreateReservationResponse,
    errors: [
      {
        status: 400,
        description: `入力不正`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `競合（二重予約/スロット占有/決済状態）`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/api/reservations/:id",
    alias: "getReservation",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "tenantId",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: Reservation,
    errors: [
      {
        status: 404,
        description: `見つからない`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/reservations/:id/cancel",
    alias: "cancelReservation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CancelReservationRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "tenantId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "Idempotency-Key",
        type: "Header",
        schema: z.string().min(1),
      },
    ],
    response: CancelReservationResponse,
    errors: [
      {
        status: 400,
        description: `入力不正`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `見つからない`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `決済状態などによりキャンセル不能`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/reservations/:id/extend",
    alias: "extendReservation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ExtendReservationRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "tenantId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "Idempotency-Key",
        type: "Header",
        schema: z.string().min(1),
      },
    ],
    response: ExtendReservationResponse,
    errors: [
      {
        status: 400,
        description: `入力不正`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `見つからない`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `競合（二重予約/スロット占有/決済状態）`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバエラー`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
