import { applyFee, feeScheduleFor } from "../ledger/index.ts";

export interface InvoiceRequest {
  customerId?: string;
  amount?: number;
  currency?: string;
  region?: string;
  memo?: string;
}

const KNOWN_REGIONS = ["eu-west", "us-east", "ap-south"] as const;

/** Largest amount (minor units) we accept on a single invoice. */
const MAX_AMOUNT = 1_000_000_000_000;
const MAX_CUSTOMER_ID_LENGTH = 128;
const MAX_MEMO_LENGTH = 500;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  fee: number;
  currency: string;
  memo: string;
}

const invoices: Invoice[] = [];

export function validateInvoice(body: InvoiceRequest): string | null {
  if (body === null || typeof body !== "object") return "request body must be a JSON object";

  const { customerId, amount, currency, region, memo } = body;

  if (customerId === undefined || customerId === null) return "customerId is required";
  if (typeof customerId !== "string") return "customerId must be a string";
  if (customerId.trim().length === 0) return "customerId must not be empty";
  if (customerId.length > MAX_CUSTOMER_ID_LENGTH) {
    return `customerId must be at most ${MAX_CUSTOMER_ID_LENGTH} characters`;
  }

  if (amount === undefined || amount === null) return "amount is required";
  if (typeof amount !== "number" || Number.isNaN(amount)) return "amount must be a number";
  if (!Number.isInteger(amount)) return "amount must be an integer number of minor units";
  if (amount <= 0) return "amount must be greater than zero";
  if (amount > MAX_AMOUNT) return `amount must be at most ${MAX_AMOUNT}`;

  if (currency !== undefined) {
    if (typeof currency !== "string") return "currency must be a string";
    if (!CURRENCY_PATTERN.test(currency)) return "currency must be a 3-letter ISO 4217 code";
  }

  if (region !== undefined) {
    if (typeof region !== "string") return "region must be a string";
    if (!KNOWN_REGIONS.includes(region as (typeof KNOWN_REGIONS)[number])) {
      return `region must be one of: ${KNOWN_REGIONS.join(", ")}`;
    }
  }

  if (memo !== undefined) {
    if (typeof memo !== "string") return "memo must be a string";
    if (memo.length > MAX_MEMO_LENGTH) return `memo must be at most ${MAX_MEMO_LENGTH} characters`;
  }

  return null;
}

export function createInvoice(body: InvoiceRequest): ApiResponse {
  const problem = validateInvoice(body);
  if (problem) return { status: 400, body: { error: problem } };
  const region = body.region ?? "eu-west";
  const amount = body.amount as number;
  const fee = applyFee(amount, feeScheduleFor(region));
  const invoice: Invoice = {
    id: `inv_${invoices.length + 1}`,
    customerId: (body.customerId as string).trim(),
    amount,
    fee,
    currency: body.currency ?? "EUR",
    memo: body.memo ?? "",
  };
  invoices.push(invoice);
  return { status: 201, body: { ...invoice } };
}

export function listInvoices(): ApiResponse {
  return { status: 200, body: { invoices: [...invoices] } };
}
