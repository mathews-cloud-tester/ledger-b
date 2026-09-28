# Changelog

## Unreleased

- Renamed model types `LedgerId`/`LedgerEntry`/`LedgerLine`/`LedgerSummary` to `Book*` and the `ledgerId` field to `bookId`.
- Renamed the `Ledger` interface to `Book` and `openLedger` to `openBook`.

## 0.4.1

- Settlement retries once when the region service times out.
- Report job reads `LEDGER_TIMEOUT_MS` instead of a hardcoded 5000.

## 0.4.0

- Added `POST /invoices`.
- Fee schedules are keyed by `LEDGER_REGION`.
