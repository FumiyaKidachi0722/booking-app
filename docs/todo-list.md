# TODO List

## API

| Endpoint                             | Status          | Notes                            |
| ------------------------------------ | --------------- | -------------------------------- |
| `POST /api/reservations`             | Implemented     | Create reservation               |
| `GET /api/reservations`              | Partially impl. | Returns dummy data, no filters   |
| `GET /api/reservations/{id}`         | Not implemented | Reservation detail               |
| `POST /api/reservations/{id}/extend` | Not implemented | Extend reservation               |
| `POST /api/reservations/{id}/cancel` | Not implemented | Cancel reservation               |
| `GET /api/availability`              | Implemented     | 15-min slots with conflict check |
| `GET /api/config/preview`            | Not implemented | Preview published config         |
| `POST /api/payments/webhook`         | Not implemented | Handle payment events            |
| `POST /api/auth/login`               | Not implemented | User login                       |
| `POST /api/auth/logout`              | Not implemented | User logout                      |

## UI

| Feature                              | Status          | Notes                                        |
| ------------------------------------ | --------------- | -------------------------------------------- |
| Home screen                          | Implemented     | Links to reserve & list                      |
| Reservation target selection screen  | Implemented     | Choose tenant/resource from dummy dropdowns  |
| Reservation form                     | Implemented     | shadcn/ui form with validation and errors    |
| Use calendar for date/time selection | Implemented     | Weekly calendar with slot picker             |
| Reservation list screen              | Implemented     | Responsive grid using dummy data, no filters |
| Reservation confirmation screen      | Not implemented | Show details after create                    |
| Reservation detail screen            | Not implemented | View single reservation                      |
| Cancellation flow                    | Not implemented | Cancel existing booking                      |
| Reservation extension flow           | Not implemented | Extend an existing booking                   |
| Availability search screen           | Implemented     | Weekly calendar in reservation form          |
| Config preview screen                | Not implemented | Preview pricing/config                       |
| Login screen                         | Not implemented | Required for auth                            |

## Infrastructure / Others

| Feature                                      | Status          | Notes                          |
| -------------------------------------------- | --------------- | ------------------------------ |
| Persistence with Firestore                   | Not implemented | Currently in-memory repository |
| Double booking prevention via transactions   | Not implemented |                                |
| Pricing & cancellation policy config-as-data | Not implemented |                                |
| Idempotency-Key enforcement middleware       | Not implemented |                                |
| Authentication and authorization             | Not implemented |                                |
