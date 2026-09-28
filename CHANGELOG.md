# Changelog

## Unreleased

- Renamed the core domain concept `Ledger` to `Book` in the models and ledger core layer (`Book`, `BookId`, `BookEntry`, `BookLine`, `BookSummary`, `openBook`, and the `bookId` field). The services layer rename follows in a separate change.

## 0.4.1

- Settlement retries once when the region service times out.
- Report job reads `LEDGER_TIMEOUT_MS` instead of a hardcoded 5000.

## 0.4.0

- Added `POST /invoices`.
- Fee schedules are keyed by `LEDGER_REGION`.
