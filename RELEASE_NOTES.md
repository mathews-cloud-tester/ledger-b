# Ledger Service Release Notes

Release date: 2026-09-28

This release delivers the ledger reconciliation clean-up tracked under ticket LD-4412. The change tidies how the service handles duplicate and orphaned ledger entries, so balances now settle correctly under concurrent writes and the daily reconciliation job finishes without manual intervention. Behaviour that previously depended on retry ordering has been made deterministic, and the affected code paths have been brought in line with our current logging and error-handling conventions. Operators should notice cleaner reconciliation reports and fewer overnight alerts.

The shipped change is available for review at https://cursor.com/codebase/anysphere/ledger-a/pull/1, which captures the full diff and the accompanying test coverage. No configuration changes are required to adopt this release; existing environment variables and feature flags remain unchanged, and the migration is backwards compatible with data written by the previous version.

## Rollback

Should any anomaly appear after deployment, roll back by redeploying the previous release artefact and reverting the merge commit associated with LD-4412. Because the change introduces no schema migrations, no data restoration is necessary, and reverting will return reconciliation to its prior behaviour immediately. Confirm the rollback by running the reconciliation job once and checking that balances settle as expected before standing down.

Signed off by Ops.
