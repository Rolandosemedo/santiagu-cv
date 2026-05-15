import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2024-12-18.acacia" as any,
  typescript: true,
  appInfo: { name: "SantiAgu.cv", version: "1.0.0", url: "https://santiagu.cv" },
});

export const CURRENCY = "cve" as const;
export const toCveStripeAmount = (a: number) => Math.round(a);
export const fromStripeAmount = (a: number) => a;
export function formatCVE(amount: number): string {
  return new Intl.NumberFormat("pt-CV", { style: "currency", currency: "CVE", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}
