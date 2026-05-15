import type { FastifyRequest, FastifyReply } from "fastify";
import type Stripe from "stripe";
import { stripe } from "../stripe/client";
import { fromStripeAmount } from "../stripe/client";

// ─── Simulated DB + notification stubs ───────────────────
// Na produção, estes imports vêm do packages/db e dos serviços reais.
async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled" | "refunded",
  stripeData?: Record<string, unknown>
) {
  console.log(`[DB] booking ${bookingId} → ${status}`, stripeData);
  // await db.update(bookings).set({ status, ...stripeData }).where(eq(bookings.id, bookingId))
}

async function sendConfirmationEmail(data: {
  email: string;
  bookingId: string;
  placeName: string;
  amountCVE: number;
}) {
  console.log(`[Resend] Enviar confirmação para ${data.email}`, data);
  // await resend.emails.send({ to: data.email, subject: `Reserva confirmada — ${data.placeName}`, ... })
}

async function sendBusinessNotification(data: {
  placeId: string;
  bookingId: string;
  placeName: string;
  amountCVE: number;
}) {
  console.log(`[Expo Push] Notificar negócio ${data.placeId}`, data);
  // await expoPush.send([{ to: businessPushToken, title: "Nova reserva!", body: `${data.placeName} — ${data.amountCVE} ECV` }])
}

async function sendRefundEmail(data: {
  email: string;
  bookingId: string;
  amountCVE: number;
}) {
  console.log(`[Resend] Enviar reembolso para ${data.email}`, data);
}

// ─── Webhook handler ──────────────────────────────────────
export async function stripeWebhookHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sig = request.headers["stripe-signature"] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    request.log.error("STRIPE_WEBHOOK_SECRET não definida");
    return reply.status(500).send({ error: "Webhook secret em falta" });
  }

  let event: Stripe.Event;

  try {
    // rawBody é necessário — registar o plugin fastify-raw-body
    const rawBody = (request as any).rawBody as Buffer;
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    request.log.warn(`Webhook signature inválida: ${err.message}`);
    return reply.status(400).send({ error: `Webhook error: ${err.message}` });
  }

  request.log.info(`Stripe event recebido: ${event.type}`);

  try {
    await handleStripeEvent(event, request);
  } catch (err: any) {
    request.log.error(`Erro a processar evento ${event.type}: ${err.message}`);
    // Retornar 200 para evitar retries desnecessários do Stripe
    // Erros são registados no Sentry / logs
    return reply.status(200).send({ received: true, error: err.message });
  }

  return reply.status(200).send({ received: true });
}

// ─── Event router ─────────────────────────────────────────
async function handleStripeEvent(
  event: Stripe.Event,
  request: FastifyRequest
) {
  switch (event.type) {
    // ── Pagamento bem-sucedido ──────────────────────────
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const { bookingId, placeId, placeName } = pi.metadata;
      const amountCVE = fromStripeAmount(pi.amount);

      if (!bookingId) {
        request.log.warn("payment_intent.succeeded sem bookingId");
        break;
      }

      await updateBookingStatus(bookingId, "confirmed", {
        stripeId: pi.id,
        paidAt: new Date().toISOString(),
        amountCVE,
      });

      // Notificações
      const email = pi.receipt_email ?? pi.customer?.toString();
      if (email) {
        await sendConfirmationEmail({
          email,
          bookingId,
          placeName: placeName ?? "Local",
          amountCVE,
        });
      }

      if (placeId) {
        await sendBusinessNotification({
          placeId,
          bookingId,
          placeName: placeName ?? "Local",
          amountCVE,
        });
      }

      request.log.info(`✅ Reserva ${bookingId} confirmada — ${amountCVE} ECV`);
      break;
    }

    // ── Pagamento falhou ────────────────────────────────
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const { bookingId } = pi.metadata;
      const reason = pi.last_payment_error?.message ?? "Motivo desconhecido";

      if (bookingId) {
        await updateBookingStatus(bookingId, "cancelled", {
          failureReason: reason,
          stripeId: pi.id,
        });
      }

      request.log.warn(`❌ Pagamento falhou para reserva ${bookingId}: ${reason}`);
      break;
    }

    // ── Reembolso criado ────────────────────────────────
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const pi = charge.payment_intent as string;
      const amountRefunded = fromStripeAmount(charge.amount_refunded);

      // Recuperar metadados da PaymentIntent
      const intent = await stripe.paymentIntents.retrieve(pi);
      const { bookingId } = intent.metadata;

      if (bookingId) {
        await updateBookingStatus(bookingId, "refunded", {
          refundedAt: new Date().toISOString(),
          amountRefundedCVE: amountRefunded,
        });

        const email = charge.receipt_email;
        if (email) {
          await sendRefundEmail({ email, bookingId, amountCVE: amountRefunded });
        }
      }

      request.log.info(`💸 Reembolso de ${amountRefunded} ECV para reserva ${bookingId}`);
      break;
    }

    // ── Checkout Session completa ───────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.CheckoutSession;
      const { bookingId } = session.metadata ?? {};
      const amountCVE = fromStripeAmount(session.amount_total ?? 0);

      if (bookingId) {
        await updateBookingStatus(bookingId, "confirmed", {
          stripeSessionId: session.id,
          amountCVE,
        });
      }

      request.log.info(`✅ Checkout session completa para reserva ${bookingId}`);
      break;
    }

    // ── Checkout Session expirada ───────────────────────
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.CheckoutSession;
      const { bookingId } = session.metadata ?? {};

      if (bookingId) {
        await updateBookingStatus(bookingId, "cancelled", {
          expiredAt: new Date().toISOString(),
        });
      }

      request.log.info(`⏱ Checkout session expirou para reserva ${bookingId}`);
      break;
    }

    // ── Dispute (chargeback) ────────────────────────────
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      // Log e notificar admin
      request.log.error(`⚠️ Disputa criada: ${dispute.id} — ${fromStripeAmount(dispute.amount)} ECV`);
      // TODO: notificar admin via Slack/email
      break;
    }

    default:
      request.log.debug(`Evento ignorado: ${event.type}`);
  }
}
