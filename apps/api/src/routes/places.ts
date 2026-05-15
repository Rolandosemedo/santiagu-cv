import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../config/supabase";

export async function placesRoutes(fastify: FastifyInstance) {
  // ── GET /places ────────────────────────────────────────
  fastify.get("/places", async (request, reply) => {
    const {
      category,
      lat,
      lng,
      radius = "10",
      rating,
      q,
      page = "1",
      limit = "20",
    } = request.query as Record<string, string>;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const offset   = (pageNum - 1) * limitNum;

    // Pesquisa geoespacial (com lat/lng)
    if (lat && lng) {
      const { data, error } = await supabaseAdmin.rpc("places_within_radius", {
        center_lat: parseFloat(lat),
        center_lng: parseFloat(lng),
        radius_km:  parseFloat(radius),
        cat_slug:   category ?? null,
        row_limit:  limitNum,
      });

      if (error) throw error;
      return reply.send({ data: data ?? [], total: data?.length ?? 0, page: pageNum, limit: limitNum });
    }

    // Query base na view
    let query = supabaseAdmin
      .from("places_with_cover")
      .select("*", { count: "exact" });

    if (category) query = query.eq("category_slug", category);
    if (rating)   query = query.gte("rating", parseFloat(rating));
    if (q)        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);

    query = query
      .order("rating", { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return reply.send({ data: data ?? [], total: count ?? 0, page: pageNum, limit: limitNum });
  });

  // ── GET /places/:id ────────────────────────────────────
  fastify.get("/places/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data, error } = await supabaseAdmin
      .from("places_with_cover")
      .select(`
        *,
        photos (*),
        reviews (id, rating, comment, created_at, users (name, avatar_url)),
        events (*)
      `)
      .eq("id", id)
      .single();

    if (error || !data) return reply.status(404).send({ error: "Local não encontrado" });

    return reply.send(data);
  });

  // ── GET /places/slug/:slug ────────────────────────────
  fastify.get("/places/slug/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const { data, error } = await supabaseAdmin
      .from("places_with_cover")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return reply.status(404).send({ error: "Local não encontrado" });
    return reply.send(data);
  });

  // ── POST /places ───────────────────────────────────────
  fastify.post(
    "/places",
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request, reply) => {
      const body = request.body as any;

      const { data, error } = await supabaseAdmin
        .from("places")
        .insert({
          ...body,
          location: body.lat && body.lng
            ? `POINT(${body.lng} ${body.lat})`
            : null,
        })
        .select()
        .single();

      if (error) throw error;
      return reply.status(201).send(data);
    }
  );

  // ── PATCH /places/:id ──────────────────────────────────
  fastify.patch(
    "/places/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body   = request.body as any;
      const user   = (request as any).user;

      // Verificar ownership (owner ou admin)
      const { data: place } = await supabaseAdmin
        .from("places")
        .select("owner_id")
        .eq("id", id)
        .single();

      if (!place) return reply.status(404).send({ error: "Local não encontrado" });
      if (place.owner_id !== user.sub && user.role !== "admin") {
        return reply.status(403).send({ error: "Sem permissão" });
      }

      const { data, error } = await supabaseAdmin
        .from("places")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return reply.send(data);
    }
  );

  // ── POST /places/:id/reviews ───────────────────────────
  fastify.post(
    "/places/:id/reviews",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { rating, comment } = request.body as { rating: number; comment?: string };
      const user = (request as any).user;

      if (rating < 1 || rating > 5) {
        return reply.status(400).send({ error: "Rating deve ser entre 1 e 5" });
      }

      const { data, error } = await supabaseAdmin
        .from("reviews")
        .upsert(
          { user_id: user.sub, place_id: id, rating, comment },
          { onConflict: "user_id,place_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return reply.status(201).send(data);
    }
  );

  // ── POST /places/:id/favorite ──────────────────────────
  fastify.post(
    "/places/:id/favorite",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user   = (request as any).user;

      const { error } = await supabaseAdmin
        .from("favorites")
        .upsert({ user_id: user.sub, place_id: id });

      if (error) throw error;
      return reply.send({ favorited: true });
    }
  );

  fastify.delete(
    "/places/:id/favorite",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user   = (request as any).user;

      await supabaseAdmin
        .from("favorites")
        .delete()
        .match({ user_id: user.sub, place_id: id });

      return reply.send({ favorited: false });
    }
  );
}
