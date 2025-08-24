# TODO List

## API

| Endpoint                             | Status          | Notes                    |
| ------------------------------------ | --------------- | ------------------------ |
| `POST /api/reservations`             | Implemented     | Create reservation       |
| `GET /api/reservations`              | Implemented     | List reservations        |
| `GET /api/reservations/{id}`         | Not implemented | Reservation detail       |
| `POST /api/reservations/{id}/extend` | Not implemented | Extend reservation       |
| `POST /api/reservations/{id}/cancel` | Not implemented | Cancel reservation       |
| `GET /api/availability`              | Not implemented | Check slot availability  |
| `GET /api/config/preview`            | Not implemented | Preview published config |
| `POST /api/payments/webhook`         | Not implemented | Handle payment events    |

## UI

| Feature                              | Status          | Notes                      |
| ------------------------------------ | --------------- | -------------------------- |
| Reservation form                     | Implemented     | Basic form using shadcn/ui |
| Use calendar for date/time selection | Implemented     | Use `datetime-local` input |
| Reservation list screen              | Implemented     | Basic list of reservations |
| Cancellation flow                    | Not implemented |                            |
| Reservation detail screen            | Not implemented |                            |
| Reservation extension flow           | Not implemented |                            |
| Availability search screen           | Not implemented |                            |
| Config preview screen                | Not implemented |                            |

## Infrastructure / Others

| Feature                                      | Status          | Notes                          |
| -------------------------------------------- | --------------- | ------------------------------ |
| Persistence with Firestore                   | Not implemented | Currently in-memory repository |
| Double booking prevention via transactions   | Not implemented |                                |
| Pricing & cancellation policy config-as-data | Not implemented |                                |
| Idempotency-Key enforcement middleware       | Not implemented |                                |
| Authentication and authorization             | Not implemented |                                |
