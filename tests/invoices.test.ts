import assert from "node:assert/strict";
import { test } from "node:test";
import { createInvoice, listInvoices } from "../src/api/invoices.ts";

test("creates an invoice with the region fee", () => {
  const response = createInvoice({ customerId: "c_1", amount: 100_000, region: "eu-west" });
  assert.equal(response.status, 201);
  assert.equal(response.body.fee, 250);
  assert.equal(listInvoices().status, 200);
});

test("rejects a non-numeric amount", () => {
  const response = createInvoice({ customerId: "c_2", amount: "12" as unknown as number });
  assert.equal(response.status, 400);
});

test("returns 400 (not a crash) when customerId is missing", () => {
  const response = createInvoice({ amount: 100 } as unknown as Parameters<typeof createInvoice>[0]);
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /customerId/);
});

test("rejects a customerId that is empty after trimming", () => {
  const response = createInvoice({ customerId: "   ", amount: 100 });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /customerId/);
});

test("rejects a customerId that is not a string", () => {
  const response = createInvoice({ customerId: 5 as unknown as string, amount: 100 });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /customerId/);
});

test("rejects a negative amount", () => {
  const response = createInvoice({ customerId: "c_3", amount: -5 });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /amount/);
});

test("rejects a zero amount", () => {
  const response = createInvoice({ customerId: "c_3", amount: 0 });
  assert.equal(response.status, 400);
});

test("rejects a non-finite amount (NaN)", () => {
  const response = createInvoice({ customerId: "c_4", amount: Number.NaN });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /amount/);
});

test("rejects a non-finite amount (Infinity)", () => {
  const response = createInvoice({ customerId: "c_4", amount: Number.POSITIVE_INFINITY });
  assert.equal(response.status, 400);
});

test("rejects a non-string currency", () => {
  const response = createInvoice({
    customerId: "c_5",
    amount: 100,
    currency: 5 as unknown as string,
  });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /currency/);
});

test("rejects an empty currency", () => {
  const response = createInvoice({ customerId: "c_5", amount: 100, currency: "  " });
  assert.equal(response.status, 400);
});

test("rejects a non-string memo", () => {
  const response = createInvoice({
    customerId: "c_6",
    amount: 100,
    memo: {} as unknown as string,
  });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /memo/);
});

test("returns 400 for an unknown region rather than throwing", () => {
  const response = createInvoice({ customerId: "c_7", amount: 100, region: "moon-base" });
  assert.equal(response.status, 400);
  assert.match(String(response.body.error), /region/);
});
