import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createBookingQuote, initiatePayment } from "../services/bookings";

const CreateBookingSchema = z.object({
  placeId:     z.string().uuid(),
  placeName:   z.string().max(200),
  eventId:     z.string().uuid().optional(),
  checkin:     z.string().datetime().optional(),
  checkout:    z.string().datetime().optional(),
  numPersons:  z.number().int().min(1).max(20).optional(),
  extras:      z.array(z.string()).optional(),
});

export async function bookingRoutes(fastify: FastifyInstance) {
  // ── POST /bookings ─────────────────────────────────────
  // Cria quote + PaymentIntent num único passo
  fastify.post(
    "/bookings",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = (request as any).user;
      const body = CreateBookingSchema.parse(request.body);

      // 1. Criar quote (verifica disponibilidade, calcula preço)
      const quote = await createBookingQuote(
        {
          userId: user.sub,
          customerEmail: user.email,
          customerName: user.name ?? "",
          ...body,
        },
        body.placeName
      );

      // 2. Iniciar pagamento Stripe
      const payment = await initiatePayment(quote, {
        userId: user.sub,
        customerEmail: user.email,
        customerName: user.name ?? "",
        ...body,
      });

      // Devolver ao frontend: tudo o que precisam para mostrar o
      // formulário de pagamento (Stripe Elements) e confirmar.
      return reply.status(201).send({
        booking: quote,
        payment: {
          clientSecret: payment.clientSecret,
          paymentIntentId: payment.paymentIntentId,
          amountCVE: payment.amount,
          currency: payment.currency,
        },
      });
    }
  );

  // ── GET /bookings/me ────────────────────────────────────
  // Reservas do utilizador autenticado
  fastify.get(
    "/bookings/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = (request as any).user;
      // TODO: SELECT * FROM bookings WHERE user_id = user.sub ORDER BY created_at DESC
      return reply.send({ data: [], userId: user.sub });
    }
  );

  // ── GET /bookings/:id ───────────────────────────────────
  fastify.get(
    "/bookings/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      // TODO: fetch booking + verificar ownership
      return reply.send({ id, status: "pending" });
    }
  );
}
