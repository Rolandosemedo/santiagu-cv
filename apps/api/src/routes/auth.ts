import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../config/supabase";

export async function authRoutes(fastify: FastifyInstance) {
  // ── POST /auth/register ────────────────────────────────
  fastify.post("/auth/register", async (request, reply) => {
    const { email, password, name } = request.body as {
      email: string;
      password: string;
      name?: string;
    };

    // Criar utilizador no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { name },
    });

    if (authError) {
      return reply.status(400).send({ error: authError.message });
    }

    // Criar registo na tabela users
    await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      email,
      name: name ?? email.split("@")[0],
      role: "user",
    });

    // Gerar JWT próprio
    const token = fastify.jwt.sign({
      sub:   authData.user.id,
      email: authData.user.email,
      name,
      role:  "user",
    });

    return reply.status(201).send({ token, user: { id: authData.user.id, email, name } });
  });

  // ── POST /auth/login ───────────────────────────────────
  fastify.post("/auth/login", async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    // Verificar credenciais via Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    // Buscar role do utilizador
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("name, role")
      .eq("id", data.user.id)
      .single();

    const token = fastify.jwt.sign({
      sub:   data.user.id,
      email: data.user.email!,
      name:  userData?.name ?? "",
      role:  userData?.role ?? "user",
    });

    return reply.send({ token, user: { id: data.user.id, email, name: userData?.name, role: userData?.role } });
  });

  // ── GET /auth/me ───────────────────────────────────────
  fastify.get("/auth/me", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const user = (request as any).user;

    const { data } = await supabaseAdmin
      .from("users")
      .select("id, email, name, avatar_url, role, created_at")
      .eq("id", user.sub)
      .single();

    return reply.send(data);
  });
}
