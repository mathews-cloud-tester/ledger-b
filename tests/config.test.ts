import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { region, requireRegion, timeoutMs } from "../src/config/index.ts";

let savedRegion: string | undefined;
let savedTimeout: string | undefined;

beforeEach(() => {
  savedRegion = process.env.LEDGER_REGION;
  savedTimeout = process.env.LEDGER_TIMEOUT_MS;
  delete process.env.LEDGER_REGION;
  delete process.env.LEDGER_TIMEOUT_MS;
});

afterEach(() => {
  if (savedRegion === undefined) delete process.env.LEDGER_REGION;
  else process.env.LEDGER_REGION = savedRegion;
  if (savedTimeout === undefined) delete process.env.LEDGER_TIMEOUT_MS;
  else process.env.LEDGER_TIMEOUT_MS = savedTimeout;
});

test("region returns the raw value or undefined", () => {
  assert.equal(region(), undefined);
  process.env.LEDGER_REGION = "us-east";
  assert.equal(region(), "us-east");
});

test("requireRegion throws when unset", () => {
  assert.throws(() => requireRegion(), /LEDGER_REGION is not set/);
  process.env.LEDGER_REGION = "eu-west";
  assert.equal(requireRegion(), "eu-west");
});

test("timeoutMs defaults to 5000 when unset", () => {
  assert.equal(timeoutMs(), 5000);
});

test("timeoutMs parses a valid value", () => {
  process.env.LEDGER_TIMEOUT_MS = "1200";
  assert.equal(timeoutMs(), 1200);
});

test("timeoutMs rejects invalid values", () => {
  process.env.LEDGER_TIMEOUT_MS = "0";
  assert.throws(() => timeoutMs(), /LEDGER_TIMEOUT_MS is invalid: 0/);
  process.env.LEDGER_TIMEOUT_MS = "nope";
  assert.throws(() => timeoutMs(), /LEDGER_TIMEOUT_MS is invalid: nope/);
});
