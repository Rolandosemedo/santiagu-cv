-- ═══════════════════════════════════════════════════════════
-- Funções RPC para o Supabase
-- Executar no SQL Editor após o schema.sql
-- ═══════════════════════════════════════════════════════════

-- ── places_within_radius ──────────────────────────────────
-- Chamado via supabase.rpc('places_within_radius', {...})
-- Devolve lugares dentro de X km de uma coordenada.
CREATE OR REPLACE FUNCTION places_within_radius(
  center_lat  FLOAT,
  center_lng  FLOAT,
  radius_km   FLOAT DEFAULT 10,
  cat_slug    TEXT  DEFAULT NULL,
  row_limit   INT   DEFAULT 20
)
RETURNS TABLE (
  id              UUID,
  name            TEXT,
  slug            TEXT,
  category_slug   TEXT,
  category_label  TEXT,
  category_icon   TEXT,
  category_color  TEXT,
  description     TEXT,
  address         TEXT,
  lat             FLOAT,
  lng             FLOAT,
  rating          NUMERIC,
  review_count    INT,
  cover_url       TEXT,
  verified        BOOLEAN,
  price_level     SMALLINT,
  tags            TEXT[],
  distance_km     FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    p.id,
    p.name,
    p.slug,
    c.slug::TEXT       AS category_slug,
    c.label_pt         AS category_label,
    c.icon             AS category_icon,
    c.color            AS category_color,
    p.description,
    p.address,
    ST_Y(p.location::geometry) AS lat,
    ST_X(p.location::geometry) AS lng,
    p.rating,
    p.review_count,
    ph.url             AS cover_url,
    p.verified,
    p.price_level,
    p.tags,
    ROUND(
      (ST_Distance(
        p.location::geography,
        ST_MakePoint(center_lng, center_lat)::geography
      ) / 1000.0)::NUMERIC, 2
    ) AS distance_km
  FROM places p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN photos ph ON ph.place_id = p.id AND ph.is_cover = TRUE
  WHERE
    p.active = TRUE
    AND ST_DWithin(
      p.location::geography,
      ST_MakePoint(center_lng, center_lat)::geography,
      radius_km * 1000  -- converter km → metros
    )
    AND (cat_slug IS NULL OR c.slug::TEXT = cat_slug)
  ORDER BY distance_km ASC
  LIMIT row_limit;
$$;

-- ── expire_pending_bookings ───────────────────────────────
-- Cron job: expirar reservas pendentes com mais de 15 min
-- Configurar em Supabase → Database → Cron Jobs: a cada 5 minutos
CREATE OR REPLACE FUNCTION expire_pending_bookings()
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
  expired_count INT;
BEGIN
  UPDATE bookings
  SET status = 'expired', updated_at = NOW()
  WHERE
    status = 'pending'
    AND expires_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$;

-- ── get_place_stats ───────────────────────────────────────
-- Stats de um lugar para o painel do owner
CREATE OR REPLACE FUNCTION get_place_stats(p_place_id UUID)
RETURNS JSON LANGUAGE plpgsql STABLE AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_bookings',     COUNT(b.id),
    'confirmed_bookings', COUNT(b.id) FILTER (WHERE b.status = 'confirmed'),
    'total_revenue_cve',  COALESCE(SUM(b.total_cve) FILTER (WHERE b.status = 'confirmed'), 0),
    'avg_rating',         COALESCE(AVG(r.rating), 0),
    'review_count',       COUNT(r.id),
    'favorite_count',     (SELECT COUNT(*) FROM favorites WHERE place_id = p_place_id)
  )
  INTO result
  FROM places p
  LEFT JOIN bookings b ON b.place_id = p.id
  LEFT JOIN reviews  r ON r.place_id = p.id
  WHERE p.id = p_place_id
  GROUP BY p.id;
  
  RETURN result;
END;
$$;
