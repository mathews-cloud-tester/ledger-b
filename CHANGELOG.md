# Changelog

## Unreleased

- Renamed the ledger export `applyFee` to `applyServiceFee` for clarity; the
  function definition, all call sites, tests, and the `CHECKS.md` API table
  were updated in the same change.

## 0.4.1

- Settlement retries once when the region service times out.
- Report job reads `LEDGER_TIMEOUT_MS` instead of a hardcoded 5000.

## 0.4.0

- Added `POST /invoices`.
- Fee schedules are keyed by `LEDGER_REGION`.
