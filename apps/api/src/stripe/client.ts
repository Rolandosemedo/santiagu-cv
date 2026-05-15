import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não definida");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
  appInfo: {
    name: "Santi'Águ.cv",
    version: "1.0.0",
    url: "https://santiagu.cv",
  },
});

// ─── CVE config ──────────────────────────────────────────
// O Escudo Cabo-verdiano (CVE) é uma moeda de unidade zero-decimal
// no Stripe — os valores são enviados em inteiros (sem centavos).
export const CURRENCY = "cve" as const;

/**
 * Converte ECV para unidade Stripe (zero-decimal).
 * 1500 ECV → 1500 (Stripe já trata como inteiro)
 */
export function toCveStripeAmount(amountECV: number): number {
  return Math.round(amountECV);
}

/**
 * Converte de Stripe para ECV display.
 */
export function fromStripeAmount(stripeAmount: number): number {
  return stripeAmount;
}

/**
 * Formata CVE para display (ex: 1.500 ECV)
 */
export function formatCVE(amount: number): string {
  return new Intl.NumberFormat("pt-CV", {
    style: "currency",
    currency: "CVE",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
