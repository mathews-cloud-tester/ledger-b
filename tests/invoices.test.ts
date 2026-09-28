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
  assert.equal(response.body.error, "amount must be a number");
});

test("rejects a missing customerId without throwing", () => {
  const response = createInvoice({ amount: 100 } as unknown as Parameters<typeof createInvoice>[0]);
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "customerId is required");
});

test("rejects an empty customerId", () => {
  const response = createInvoice({ customerId: "   ", amount: 100 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "customerId must not be empty");
});

test("rejects a missing amount", () => {
  const response = createInvoice({ customerId: "c_3" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount is required");
});

test("rejects a non-integer amount", () => {
  const response = createInvoice({ customerId: "c_4", amount: 10.5 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be an integer number of minor units");
});

test("rejects a non-positive amount", () => {
  const response = createInvoice({ customerId: "c_5", amount: 0 });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "amount must be greater than zero");
});

test("rejects an oversized amount", () => {
  const response = createInvoice({ customerId: "c_6", amount: 1_000_000_000_001 });
  assert.equal(response.status, 400);
});

test("rejects a malformed currency", () => {
  const response = createInvoice({ customerId: "c_7", amount: 100, currency: "euro" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "currency must be a 3-letter ISO 4217 code");
});

test("rejects an unknown region", () => {
  const response = createInvoice({ customerId: "c_8", amount: 100, region: "mars-1" });
  assert.equal(response.status, 400);
});

test("rejects a non-object body", () => {
  const response = createInvoice(null as unknown as Parameters<typeof createInvoice>[0]);
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "request body must be a JSON object");
});

test("accepts a valid invoice with optional fields", () => {
  const response = createInvoice({
    customerId: " c_9 ",
    amount: 5_000,
    currency: "USD",
    region: "us-east",
    memo: "March services",
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.customerId, "c_9");
  assert.equal(response.body.currency, "USD");
});
