import assert from "node:assert/strict";
import { test } from "node:test";
import { applyFeeSchedule, feeScheduleFor } from "../src/ledger/index.ts";

test("proportional fee above the minimum", () => {
  assert.equal(applyFeeSchedule(100_000, feeScheduleFor("eu-west")), 250);
});

test("minimum fee applies to small amounts", () => {
  assert.equal(applyFeeSchedule(100, feeScheduleFor("eu-west")), 30);
});

test("non-positive amounts carry no fee", () => {
  assert.equal(applyFeeSchedule(0, feeScheduleFor("us-east")), 0);
  assert.equal(applyFeeSchedule(-500, feeScheduleFor("us-east")), 0);
});

test("unknown region is rejected", () => {
  assert.throws(() => feeScheduleFor("mars"), /no fee schedule/);
});
