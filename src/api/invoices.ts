import { applyFee, feeScheduleFor } from "../ledger/index.ts";

export interface InvoiceRequest {
  customerId?: string;
  amount?: number;
  currency?: string;
  region?: string;
  memo?: string;
}

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

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

export function validateInvoice(body: InvoiceRequest): string | null {
  if (body.customerId === undefined || body.customerId === null) {
    return "customerId is required";
  }
  if (typeof body.customerId !== "string") return "customerId must be a string";
  if (body.customerId.trim() === "") return "customerId must not be empty";

  if (body.amount === undefined || body.amount === null) return "amount is required";
  if (typeof body.amount !== "number") return "amount must be a number";
  if (!Number.isFinite(body.amount)) return "amount must be a finite number";
  if (body.amount <= 0) return "amount must be greater than 0";

  if (!isOptionalString(body.currency)) return "currency must be a string";
  if (typeof body.currency === "string" && body.currency.trim() === "") {
    return "currency must not be empty";
  }

  if (!isOptionalString(body.region)) return "region must be a string";
  if (typeof body.region === "string" && body.region.trim() === "") {
    return "region must not be empty";
  }

  if (!isOptionalString(body.memo)) return "memo must be a string";

  return null;
}

export function createInvoice(body: InvoiceRequest): ApiResponse {
  if (typeof body !== "object" || body === null) {
    return { status: 400, body: { error: "request body must be a JSON object" } };
  }

  const problem = validateInvoice(body);
  if (problem) return { status: 400, body: { error: problem } };

  const customerId = (body.customerId as string).trim();
  const amount = body.amount as number;
  const region = body.region ?? "eu-west";

  let fee: number;
  try {
    fee = applyFee(amount, feeScheduleFor(region));
  } catch {
    return { status: 400, body: { error: `unknown region: ${region}` } };
  }

  const invoice: Invoice = {
    id: `inv_${invoices.length + 1}`,
    customerId,
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
