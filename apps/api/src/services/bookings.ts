// ─── Booking service ─────────────────────────────────────
// Orquestra: validação → bloqueio temporário → pagamento → confirmação

import { createPaymentIntent } from "../stripe/payments";
import { formatCVE } from "../stripe/client";

// ─── Types ────────────────────────────────────────────────
export interface CreateBookingInput {
  userId: string;
  placeId: string;
  eventId?: string;
  checkin?: string;       // ISO date string (hotéis, rent-a-car)
  checkout?: string;
  numPersons?: number;
  extras?: string[];
  customerEmail: string;
  customerName: string;
}

export interface BookingQuote {
  bookingId: string;
  placeId: string;
  placeName: string;
  description: string;
  amountCVE: number;
  breakdown: Array<{ label: string; amountCVE: number }>;
  expiresAt: string;      // ISO — o slot fica reservado por 15 minutos
}

// ─── Pricing stubs (substituir com lógica real por categoria) ──
const PRICE_TABLE: Record<string, number> = {
  // restaurantes: por pessoa
  restaurante_cover: 500,
  // eventos: preço do bilhete
  evento_bilhete: 1500,
  // hotéis: por noite
  hotel_noite: 8000,
  // rent-a-car: por dia
  carro_dia: 5000,
};

function calculateAmount(input: CreateBookingInput, placeName: string): {
  amountCVE: number;
  breakdown: Array<{ label: string; amountCVE: number }>;
} {
  const breakdown: Array<{ label: string; amountCVE: number }> = [];

  if (input.eventId) {
    // Evento — preço fixo por bilhete × pessoas
    const perTicket = PRICE_TABLE.evento_bilhete;
    const pessoas = input.numPersons ?? 1;
    breakdown.push({ label: `${pessoas}x Bilhete — ${placeName}`, amountCVE: perTicket * pessoas });
  } else if (input.checkin && input.checkout) {
    // Hotel / rent-a-car — por noite/dia
    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(input.checkout).getTime() - new Date(input.checkin).getTime()) / 86_400_000
      )
    );
    const perUnit = PRICE_TABLE.hotel_noite;
    breakdown.push({ label: `${nights} noite(s) — ${placeName}`, amountCVE: perUnit * nights });
  } else {
    // Restaurante — cover charge por pessoa
    const pessoas = input.numPersons ?? 2;
    breakdown.push({ label: `${pessoas}x Cover — ${placeName}`, amountCVE: PRICE_TABLE.restaurante_cover * pessoas });
  }

  // Taxa de serviço (5%)
  const subtotal = breakdown.reduce((s, b) => s + b.amountCVE, 0);
  const taxaServico = Math.round(subtotal * 0.05);
  breakdown.push({ label: "Taxa de serviço (5%)", amountCVE: taxaServico });

  return { amountCVE: subtotal + taxaServico, breakdown };
}

// ─── Main service functions ───────────────────────────────

/**
 * 1. Verifica disponibilidade e cria BookingQuote temporário (15min).
 *    Frontend usa os dados do quote para criar o PaymentIntent.
 */
export async function createBookingQuote(
  input: CreateBookingInput,
  placeName: string
): Promise<BookingQuote> {
  // TODO: verificar disponibilidade real no PostgreSQL
  // const available = await checkAvailability(input)
  // if (!available) throw new Error("Slot não disponível")

  const bookingId = crypto.randomUUID();
  const { amountCVE, breakdown } = calculateAmount(input, placeName);

  // TODO: INSERT INTO bookings (status='pending', expires_at=+15min)
  console.log(`[Booking] Quote criado: ${bookingId} — ${formatCVE(amountCVE)}`);

  return {
    bookingId,
    placeId: input.placeId,
    placeName,
    description: `Reserva em ${placeName}`,
    amountCVE,
    breakdown,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}

/**
 * 2. Cria PaymentIntent Stripe com os dados do quote.
 *    Chamado imediatamente após createBookingQuote.
 */
export async function initiatePayment(quote: BookingQuote, input: CreateBookingInput) {
  return createPaymentIntent({
    amountCVE: quote.amountCVE,
    bookingId: quote.bookingId,
    userId: input.userId,
    placeId: quote.placeId,
    placeName: quote.placeName,
    description: quote.description,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
  });
}

/**
 * 3. Confirmar reserva após webhook Stripe (payment_intent.succeeded).
 *    Chamado APENAS a partir do webhook handler — nunca pelo frontend.
 */
export async function confirmBooking(bookingId: string, stripePaymentIntentId: string) {
  // TODO: db.update bookings set status='confirmed', stripe_id=..., confirmed_at=now()
  console.log(`[Booking] ✅ ${bookingId} confirmada via Stripe ${stripePaymentIntentId}`);
}

/**
 * 4. Cancelar reserva (por timeout ou falha de pagamento).
 */
export async function cancelBooking(bookingId: string, reason: string) {
  // TODO: db.update bookings set status='cancelled', cancelled_reason=reason
  // TODO: libertar slot se bloqueado
  console.log(`[Booking] ❌ ${bookingId} cancelada: ${reason}`);
}

/**
 * 5. Expirar reservas pending com mais de 15 minutos (cron job).
 */
export async function expirePendingBookings() {
  // TODO: UPDATE bookings SET status='expired' WHERE status='pending' AND expires_at < NOW()
  console.log("[Booking] Cron: a expirar reservas pendentes…");
}
