# TODO List

## API

| Endpoint                             | Status          | Notes                    |
| ------------------------------------ | --------------- | ------------------------ |
| `POST /api/reservations`             | Implemented     | Create reservation       |
| `GET /api/reservations`              | Partially impl. | Basic list, no filters   |
| `GET /api/reservations/{id}`         | Not implemented | Reservation detail       |
| `POST /api/reservations/{id}/extend` | Not implemented | Extend reservation       |
| `POST /api/reservations/{id}/cancel` | Not implemented | Cancel reservation       |
| `GET /api/availability`              | Not implemented | Check slot availability  |
| `GET /api/config/preview`            | Not implemented | Preview published config |
| `POST /api/payments/webhook`         | Not implemented | Handle payment events    |
| `POST /api/auth/login`               | Not implemented | User login               |
| `POST /api/auth/logout`              | Not implemented | User logout              |

## UI

| Feature                              | Status          | Notes                        |
| ------------------------------------ | --------------- | ---------------------------- |
| Home screen                          | Implemented     | Links to reserve & list      |
| Reservation form                     | Implemented     | Basic form using shadcn/ui   |
| Use calendar for date/time selection | Implemented     | `datetime-local` input       |
| Reservation list screen              | Implemented     | Styled card list, no filters |
| Reservation confirmation screen      | Not implemented | Show details after create    |
| Reservation detail screen            | Not implemented | View single reservation      |
| Cancellation flow                    | Not implemented | Cancel existing booking      |
| Reservation extension flow           | Not implemented | Extend an existing booking   |
| Availability search screen           | Not implemented | Search for free slots        |
| Config preview screen                | Not implemented | Preview pricing/config       |
| Login screen                         | Not implemented | Required for auth            |

## Infrastructure / Others

| Feature                                      | Status          | Notes                          |
| -------------------------------------------- | --------------- | ------------------------------ |
| Persistence with Firestore                   | Not implemented | Currently in-memory repository |
| Double booking prevention via transactions   | Not implemented |                                |
| Pricing & cancellation policy config-as-data | Not implemented |                                |
| Idempotency-Key enforcement middleware       | Not implemented |                                |
| Authentication and authorization             | Not implemented |                                |
