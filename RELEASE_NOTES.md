# Release Notes

Release date: 2026-09-28

This release delivers the work tracked under ticket LD-4412 for the ledger service. The shipped change is captured in the pull request at https://cursor.com/codebase/anysphere/ledger-a/pull/1, which centralises the improvements described below.

The update refines how the ledger records and reconciles entries, improving the accuracy of balances and the behaviour of the reconciliation routine under load. We have optimised the handling of concurrent writes so that entries are no longer duplicated when requests arrive close together, and we have standardised error reporting so that failures surface with clearer, more actionable messages. Formatting and status output have been harmonised across the service, and several minor defects observed during testing have been resolved.

Operators should not need to take any manual action after deployment. Configuration remains unchanged, and existing data is fully compatible with this version.

## Rollback

Should any problem arise, revert to the previous release by redeploying the prior build and restoring the associated configuration. Because the schema is unchanged, no data migration needs to be undone, so rolling back is safe and can be completed without downtime. Confirm that balances reconcile correctly once the previous version is live, and raise any discrepancies against ticket LD-4412.

Signed off by Ops.
