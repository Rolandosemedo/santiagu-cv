import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import rawBody from "fastify-raw-body";

// ─── Route plugins ────────────────────────────────────────
import { placesRoutes } from "./routes/places";
import { paymentRoutes } from "./routes/payments";
import { bookingRoutes } from "./routes/bookings";
import { authRoutes } from "./routes/auth";

(async () => {

(async () => {

// ─── Fastify instance ─────────────────────────────────────
const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    transport:
      process.env.NODE_ENV === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
  trustProxy: true, // Railway usa proxy reverso
});

// ─── Plugins ──────────────────────────────────────────────
await app.register(helmet, { contentSecurityPolicy: false });

await app.register(cors, {
  origin: [
    "https://santiagu.cv",
    "https://www.santiagu.cv",
    /\.santiagu\.cv$/,
    // dev
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
  // Webhook do Stripe tem limite próprio
  skipOnError: false,
  keyGenerator: (req) => req.ip,
});

// rawBody necessário para verificar assinatura do Stripe
await app.register(rawBody, {
  field: "rawBody",
  global: false, // só activo nas rotas que precisam
  encoding: "utf8",
  runFirst: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
  sign: { expiresIn: "7d" },
});

// ─── Auth decorator ───────────────────────────────────────
app.decorate("authenticate", async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Não autorizado" });
  }
});

app.decorate("requireAdmin", async function (request: any, reply: any) {
  if (request.user?.role !== "admin") {
    reply.status(403).send({ error: "Acesso negado" });
  }
});

// ─── Health check ─────────────────────────────────────────
app.get("/health", async () => ({
  status: "ok",
  version: "1.0.0",
  env: process.env.NODE_ENV,
  ts: new Date().toISOString(),
}));

// ─── Routes ───────────────────────────────────────────────
await app.register(authRoutes,    { prefix: "/api" });
await app.register(placesRoutes,  { prefix: "/api" });
await app.register(bookingRoutes, { prefix: "/api" });
await app.register(paymentRoutes, { prefix: "/api" });

// ─── Error handler ────────────────────────────────────────
app.setErrorHandler((err, _req, reply) => {
  app.log.error(err);

  if (err.validation) {
    return reply.status(400).send({ error: "Dados inválidos", details: err.validation });
  }

  const status = err.statusCode ?? 500;
  reply.status(status).send({
    error: status >= 500 ? "Erro interno do servidor" : err.message,
  });
});

// ─── Start ────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "3001", 10);

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  app.log.info(`🚀 API a correr em http://0.0.0.0:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
})();
})();
