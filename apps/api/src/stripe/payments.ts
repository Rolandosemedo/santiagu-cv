import { stripe, CURRENCY, toCveStripeAmount } from "./client";
import type Stripe from "stripe";

// ─── Types ────────────────────────────────────────────────
export interface CreatePaymentIntentParams {
  amountCVE: number;
  bookingId: string;
  userId: string;
  placeId: string;
  placeName: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface RefundParams {
  paymentIntentId: string;
  amountCVE?: number; // se undefined → reembolso total
  reason?: Stripe.RefundCreateParams.Reason;
}

// ─── PaymentIntent ────────────────────────────────────────
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  const {
    amountCVE,
    bookingId,
    userId,
    placeId,
    placeName,
    description,
    customerEmail,
    customerName,
  } = params;

  // Criar ou recuperar customer Stripe
  let customerId: string | undefined;
  if (customerEmail) {
    const existing = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: { userId },
      });
      customerId = customer.id;
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: toCveStripeAmount(amountCVE),
    currency: CURRENCY,
    customer: customerId,
    description,
    receipt_email: customerEmail,
    metadata: {
      bookingId,
      userId,
      placeId,
      placeName,
      platform: "santiagu-cv",
    },
    automatic_payment_methods: {
      enabled: true,
    },
    statement_descriptor_suffix: "SANTIAGU",
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Falha ao criar PaymentIntent — client_secret em falta");
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: amountCVE,
    currency: CURRENCY,
  };
}

// ─── Retrieve ─────────────────────────────────────────────
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

// ─── Confirm status ───────────────────────────────────────
export function isPaymentSucceeded(pi: Stripe.PaymentIntent): boolean {
  return pi.status === "succeeded";
}

// ─── Refund ───────────────────────────────────────────────
export async function createRefund(
  params: RefundParams
): Promise<Stripe.Refund> {
  const { paymentIntentId, amountCVE, reason } = params;

  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amountCVE !== undefined ? toCveStripeAmount(amountCVE) : undefined,
    reason: reason ?? "requested_by_customer",
    metadata: { platform: "santiagu-cv" },
  });
}

// ─── Checkout Session (alternativa para pagamento web) ────
export interface CreateCheckoutParams {
  amountCVE: number;
  bookingId: string;
  placeName: string;
  description: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  imageUrl?: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<{ url: string; sessionId: string }> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          unit_amount: toCveStripeAmount(params.amountCVE),
          product_data: {
            name: params.placeName,
            description: params.description,
            images: params.imageUrl ? [params.imageUrl] : [],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: params.bookingId,
      platform: "santiagu-cv",
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    locale: "pt",
  });

  if (!session.url) throw new Error("Checkout session URL em falta");

  return { url: session.url, sessionId: session.id };
}
