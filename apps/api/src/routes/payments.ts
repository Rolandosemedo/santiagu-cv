import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createPaymentIntent, createCheckoutSession, createRefund, getPaymentIntent } from "../stripe/payments";
import { stripeWebhookHandler } from "../webhooks/stripe";

// ─── Validation schemas ───────────────────────────────────
const CreatePaymentIntentSchema = z.object({
  amountCVE: z.number().int().positive().max(500_000), // max 500.000 ECV
  bookingId: z.string().uuid(),
  placeId: z.string().uuid(),
  placeName: z.string().max(200),
  description: z.string().max(500),
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(200).optional(),
});

const CreateCheckoutSchema = z.object({
  amountCVE: z.number().int().positive().max(500_000),
  bookingId: z.string().uuid(),
  placeName: z.string().max(200),
  description: z.string().max(500),
  customerEmail: z.string().email().optional(),
  imageUrl: z.string().url().optional(),
});

const RefundSchema = z.object({
  paymentIntentId: z.string().startsWith("pi_"),
  amountCVE: z.number().int().positive().optional(),
  reason: z.enum(["duplicate", "fraudulent", "requested_by_customer"]).optional(),
});

// ─── Plugin ───────────────────────────────────────────────
export async function paymentRoutes(fastify: FastifyInstance) {
  // ── POST /payments/intent ──────────────────────────────
  // Cria um PaymentIntent para integração no frontend (Elements)
  fastify.post(
    "/payments/intent",
    {
      preHandler: [fastify.authenticate], // JWT middleware
      schema: {
        tags: ["payments"],
        summary: "Criar PaymentIntent (CVE)",
        body: {
          type: "object",
          required: ["amountCVE", "bookingId", "placeId", "placeName", "description"],
          properties: {
            amountCVE:      { type: "number" },
            bookingId:      { type: "string" },
            placeId:        { type: "string" },
            placeName:      { type: "string" },
            description:    { type: "string" },
            customerEmail:  { type: "string" },
            customerName:   { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const user = (request as any).user; // JWT payload
      const body = CreatePaymentIntentSchema.parse(request.body);

      const result = await createPaymentIntent({
        ...body,
        userId: user.sub,
        customerEmail: body.customerEmail ?? user.email,
        customerName: body.customerName ?? user.name,
      });

      return reply.status(201).send(result);
    }
  );

  // ── POST /payments/checkout ────────────────────────────
  // Cria uma Checkout Session (redireciona para página Stripe)
  fastify.post(
    "/payments/checkout",
    {
      preHandler: [fastify.authenticate],
      schema: { tags: ["payments"], summary: "Criar Checkout Session" },
    },
    async (request, reply) => {
      const body = CreateCheckoutSchema.parse(request.body);
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL ?? "https://santiagu.cv";

      const result = await createCheckoutSession({
        ...body,
        successUrl: `${baseUrl}/reserva/${body.bookingId}/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/reserva/${body.bookingId}/cancelado`,
      });

      return reply.status(201).send(result);
    }
  );

  // ── GET /payments/:paymentIntentId ─────────────────────
  // Verifica estado de um pagamento
  fastify.get(
    "/payments/:paymentIntentId",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["payments"],
        summary: "Verificar estado do pagamento",
        params: {
          type: "object",
          properties: { paymentIntentId: { type: "string" } },
        },
      },
    },
    async (request, reply) => {
      const { paymentIntentId } = request.params as { paymentIntentId: string };

      if (!paymentIntentId.startsWith("pi_")) {
        return reply.status(400).send({ error: "PaymentIntent ID inválido" });
      }

      const pi = await getPaymentIntent(paymentIntentId);

      return reply.send({
        id: pi.id,
        status: pi.status,
        amount: pi.amount,
        currency: pi.currency,
        metadata: pi.metadata,
        created: pi.created,
      });
    }
  );

  // ── POST /payments/refund ──────────────────────────────
  // Reembolso (apenas admin ou dono da reserva)
  fastify.post(
    "/payments/refund",
    {
      preHandler: [fastify.authenticate, fastify.requireAdmin],
      schema: { tags: ["payments"], summary: "Criar reembolso" },
    },
    async (request, reply) => {
      const body = RefundSchema.parse(request.body);
      const refund = await createRefund(body);

      return reply.status(201).send({
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount,
        currency: refund.currency,
      });
    }
  );

  // ── POST /webhooks/stripe ──────────────────────────────
  // Rota pública (sem JWT) — autenticada pela stripe-signature
  fastify.post(
    "/webhooks/stripe",
    {
      config: { rawBody: true }, // Necessário para verificar assinatura Stripe
    },
    stripeWebhookHandler
  );
}
