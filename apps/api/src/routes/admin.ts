import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../config/supabase";
import { searchGooglePlace, resolvePhotoUrl } from "../services/googlePlaces";

const DELAY_MS = 300;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function enrichOnePlaceById(placeId: string, apiKey: string, force = false) {
  const { data: place, error } = await supabaseAdmin
    .from("places")
    .select("id, name, address")
    .eq("id", placeId)
    .single();

  if (error || !place) return { ok: false, reason: "not_found" };

  const gp = await searchGooglePlace(place.name, place.address, apiKey);
  if (!gp) return { ok: false, reason: "not_found_google", name: place.name };

  const { lat, lng } = gp.location;

  const locPayload: Record<string, unknown> = {
    location: `SRID=4326;POINT(${lng} ${lat})`,
  };
  if (gp.phone) locPayload.phone = gp.phone;

  const { error: updErr } = await supabaseAdmin
    .from("places")
    .update({ ...locPayload, google_place_id: gp.id })
    .eq("id", place.id);

  if (updErr?.message?.includes("google_place_id")) {
    await supabaseAdmin.from("places").update(locPayload).eq("id", place.id);
  }

  let photoUrl: string | null = null;
  if (gp.photoRefs[0]) {
    photoUrl = await resolvePhotoUrl(gp.photoRefs[0], apiKey);
    if (photoUrl) {
      await supabaseAdmin
        .from("photos")
        .update({ is_cover: false })
        .eq("place_id", place.id)
        .eq("is_cover", true);

      const row = { place_id: place.id, url: photoUrl, is_cover: true, sort_order: 0 };
      const { error: pErr } = await supabaseAdmin
        .from("photos")
        .insert({ ...row, source: "google_places" });
      if (pErr?.message?.includes("source")) {
        await supabaseAdmin.from("photos").insert(row);
      }
    }
  }

  return {
    ok: true,
    google_place_id: gp.id,
    lat,
    lng,
    phone: gp.phone,
    photo_updated: !!photoUrl,
  };
}

export async function adminRoutes(fastify: FastifyInstance) {
  // ── POST /api/admin/enrich-places ─────────────────────────────────
  // Enriquece todos os locais de uma categoria via Google Places API.
  // Body: { category?: string, force?: boolean }
  fastify.post(
    "/admin/enrich-places",
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request, reply) => {
      const { category = "restaurantes", force = false } = request.body as {
        category?: string;
        force?: boolean;
      };

      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        return reply.status(500).send({ error: "GOOGLE_PLACES_API_KEY não configurada" });
      }

      const { data: cat } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (!cat) return reply.status(404).send({ error: `Categoria "${category}" não encontrada` });

      const { data: rows } = await supabaseAdmin
        .from("places")
        .select("id, name, address, google_place_id")
        .eq("category_id", cat.id)
        .eq("active", true);

      const results: Record<string, unknown>[] = [];

      for (const place of rows ?? []) {
        const result = await enrichOnePlaceById(place.id, apiKey, force);
        results.push({ place: place.name, ...result });
        await sleep(DELAY_MS);
      }

      return reply.send({
        enriched: results.filter((r) => r.ok).length,
        total: results.length,
        results,
      });
    }
  );

  // ── POST /api/admin/enrich-places/:id ─────────────────────────────
  // Enriquece um único local por ID (útil para testar/forçar).
  fastify.post(
    "/admin/enrich-places/:id",
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { force = false } = (request.body ?? {}) as { force?: boolean };

      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        return reply.status(500).send({ error: "GOOGLE_PLACES_API_KEY não configurada" });
      }

      const result = await enrichOnePlaceById(id, apiKey, force);
      if (!result.ok && result.reason === "not_found") {
        return reply.status(404).send({ error: "Local não encontrado" });
      }

      return reply.send(result);
    }
  );

  // ── GET /api/admin/enrich-status ──────────────────────────────────
  // Resumo: quantos locais têm google_place_id vs total.
  fastify.get(
    "/admin/enrich-status",
    { preHandler: [fastify.authenticate, fastify.requireAdmin] },
    async (_request, reply) => {
      const { data } = await supabaseAdmin
        .from("places")
        .select("category_id, google_place_id, categories(slug)");

      const total = data?.length ?? 0;
      const enriched = data?.filter((p) => p.google_place_id).length ?? 0;
      return reply.send({ total, enriched, missing: total - enriched });
    }
  );
}
