import { createClient } from "@supabase/supabase-js";

// ─── Server-side client (service role — bypasses RLS) ─────
// Usar APENAS no backend/API. Nunca expor ao frontend.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ─── Anon client (respeita RLS) ───────────────────────────
// Para operações que devem respeitar permissões do utilizador.
export const supabaseAnon = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// ─── Helper: query places por raio geoespacial ────────────
export async function getPlacesNear(
  lat: number,
  lng: number,
  radiusKm: number = 10,
  categorySlug?: string,
  limit: number = 20
) {
  let query = supabaseAdmin
    .from("places_with_cover")
    .select("*")
    .filter(
      "location",
      "not.is",
      null
    );

  // Filtro geoespacial via PostGIS (ST_DWithin)
  // Supabase suporta rpc para queries PostGIS complexas
  const { data, error } = await supabaseAdmin.rpc("places_within_radius", {
    center_lat: lat,
    center_lng: lng,
    radius_km: radiusKm,
    cat_slug: categorySlug ?? null,
    row_limit: limit,
  });

  if (error) throw error;
  return data;
}

// ─── Helper: pesquisa full-text ───────────────────────────
export async function searchPlaces(q: string, limit: number = 20) {
  const { data, error } = await supabaseAdmin
    .from("places_with_cover")
    .select("*")
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(limit);

  if (error) throw error;
  return data;
}
