-- ═══════════════════════════════════════════════════════════
-- Migration: integração Google Places API
-- Executar no Supabase SQL Editor ANTES de correr o script
-- de enriquecimento ou o endpoint /api/admin/enrich-places
-- ═══════════════════════════════════════════════════════════


-- ── 1. Coluna google_place_id em places ───────────────────
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS google_place_id TEXT;

CREATE INDEX IF NOT EXISTS idx_places_google_place_id
  ON places (google_place_id)
  WHERE google_place_id IS NOT NULL;


-- ── 2. Coluna source em photos ─────────────────────────────
-- Permite distinguir fotos do Unsplash das fotos do Google Places
ALTER TABLE photos
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';


-- ── 3. Função RPC: update_place_location ──────────────────
-- Actualiza GPS (geometry) + google_place_id + phone num mesmo SELECT
-- O script TypeScript usa esta função para não ter de lidar com
-- serialização WKT/geography no lado do cliente.
CREATE OR REPLACE FUNCTION update_place_location(
  p_id             UUID,
  p_lng            DOUBLE PRECISION,
  p_lat            DOUBLE PRECISION,
  p_google_place_id TEXT,
  p_phone          TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE places
  SET
    location         = ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326),
    google_place_id  = p_google_place_id,
    phone            = COALESCE(p_phone, phone),
    updated_at       = NOW()
  WHERE id = p_id;
END;
$$;

-- Permissão para o service role (usado pelo backend)
GRANT EXECUTE ON FUNCTION update_place_location TO service_role;


-- ── 4. Verificação ────────────────────────────────────────
/*
SELECT
  name,
  google_place_id,
  ST_Y(location::geometry) AS lat,
  ST_X(location::geometry) AS lng
FROM places
WHERE google_place_id IS NOT NULL
ORDER BY name;
*/
