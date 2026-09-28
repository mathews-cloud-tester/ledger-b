# Ledger Service 0.4.2 — 2026-09-28

This release refines the double-entry ledger service, concentrating on settlement reliability and fee handling under ticket LD-4412. The work, shipped as https://cursor.com/codebase/anysphere/ledger-a/pull/1, optimises how the report job initialises its timeout window so that regional settlement no longer stalls when the region service is slow to respond. We revisited the retry behaviour introduced in the previous release and tuned it to prioritise completing in-flight settlements over aggressively re-queuing them, which smooths the observed latency without altering any recorded balances. Fee schedules keyed by region continue to behave as before, and account balances remain identical to prior runs, so downstream reconciliation is unaffected.

Operators should notice steadier throughput during peak windows and clearer log colour coding on the settlement path, making it easier to distinguish a genuine timeout from an ordinary retry. No configuration changes are required, although anyone overriding LEDGER_TIMEOUT_MS may wish to review their value now that the initialisation path honours it consistently.

## Rollback

Should settlement behaviour regress, roll back by redeploying the previous release from the base tag and restarting the settlement and report workers. Because this change touches only timing and logging rather than the ledger data model, no data migration or replay is needed, and balances computed under the new build remain valid under the old one. Confirm the rollback by checking that the report job completes cleanly against a known region before restoring normal traffic.

We will keep monitoring settlement latency and will prioritise any follow-up under the same ticket if the behaviour needs further attention.

— Ops
