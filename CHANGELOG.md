# Changelog

## Unreleased

- Renamed the core `Ledger` type and `openLedger` constructor to `Book` / `openBook`; entry, line, and summary types now use `bookId`.

## 0.4.1

- Settlement retries once when the region service times out.
- Report job reads `LEDGER_TIMEOUT_MS` instead of a hardcoded 5000.

## 0.4.0

- Added `POST /invoices`.
- Fee schedules are keyed by `LEDGER_REGION`.
