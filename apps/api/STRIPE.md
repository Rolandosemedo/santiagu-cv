# Integração Stripe — Santi'Águ.cv

## Visão geral

O sistema de pagamentos usa **Stripe** com suporte nativo à moeda **CVE (Escudo Cabo-verdiano)**.

```
Utilizador → BookingQuote → PaymentIntent → Stripe Elements → Webhook → Confirmação
```

---

## Setup (passo a passo)

### 1. Criar conta Stripe
1. Vai a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Cria conta e completa o KYC (verificação de identidade)
3. Ativa o modo live quando estiveres pronto para produção

### 2. Obter chaves API
```
Dashboard → Developers → API Keys

STRIPE_SECRET_KEY     = sk_live_...   (nunca expor no frontend!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...   (seguro para o frontend)
```

### 3. Configurar Webhook
```
Dashboard → Developers → Webhooks → Add endpoint

URL: https://api.santiagu.cv/webhooks/stripe

Eventos a subscrever:
  ✅ payment_intent.succeeded
  ✅ payment_intent.payment_failed
  ✅ charge.refunded
  ✅ checkout.session.completed
  ✅ checkout.session.expired
  ✅ charge.dispute.created

Copia o Signing Secret → STRIPE_WEBHOOK_SECRET
```

### 4. Testar localmente com Stripe CLI
```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Fazer forward dos webhooks para localhost
stripe listen --forward-to localhost:3001/webhooks/stripe

# Simular pagamento bem-sucedido
stripe trigger payment_intent.succeeded
```

---

## Fluxo de pagamento

```
1. POST /bookings
   ├── Cria BookingQuote (15 min de validade)
   └── Cria PaymentIntent no Stripe
       └── Devolve { clientSecret, amountCVE }

2. Frontend (Stripe Elements)
   ├── Renderiza formulário de cartão
   └── stripe.confirmPayment({ clientSecret })

3. Stripe → Webhook POST /webhooks/stripe
   └── payment_intent.succeeded
       ├── UPDATE bookings SET status='confirmed'
       ├── Email de confirmação (Resend)
       ├── Push notification ao negócio (Expo)
       └── Gerar fatura PDF
```

---

## Moeda CVE

O CVE é uma moeda **zero-decimal** no Stripe — os valores são enviados como inteiros.

```typescript
// ✅ Correto: 1500 ECV → amount: 1500
// ❌ Errado:  1500 ECV → amount: 150000 (centavos — apenas para EUR/USD)

stripe.paymentIntents.create({
  amount: 1500,      // 1500 ECV exato
  currency: "cve",
})
```

Lista de moedas zero-decimal: https://stripe.com/docs/currencies#zero-decimal

---

## Ficheiros relevantes

| Ficheiro | Responsabilidade |
|---|---|
| `src/stripe/client.ts` | Singleton Stripe + helpers CVE |
| `src/stripe/payments.ts` | PaymentIntent, Checkout Session, Refund |
| `src/webhooks/stripe.ts` | Handler de todos os eventos Stripe |
| `src/routes/payments.ts` | Rotas REST `/payments/*` e `/webhooks/stripe` |
| `src/routes/bookings.ts` | Rotas `/bookings` — orquestra quote + pagamento |
| `src/services/bookings.ts` | Lógica de negócio: disponibilidade, preços, estados |
| `src/services/invoice.ts` | Gerador de faturas PDF em PT com PDFKit |

---

## Comissões Stripe

| Tipo | Custo |
|---|---|
| Cartão nacional | 2.9% + $0.30 |
| Cartão internacional | ~3.9% + $0.30 |
| Reembolso | Sem custo (Stripe devolve a comissão parcialmente) |
| Dispute (chargeback) | $15 por disputa |

**Estimativa:** Para 100 reservas/mês de 3.000 ECV (≈$30):  
→ ~$90 em pagamentos → ~$2.91 de comissão por reserva → **~$291/mês em comissões** a escala.
