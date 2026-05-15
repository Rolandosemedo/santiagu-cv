-- ═══════════════════════════════════════════════════════════
-- Santi'Águ.cv — Schema SQL completo
-- Executar no Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════

-- ── 1. Extensões ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- pesquisa fuzzy

-- ── 2. Enumerações ────────────────────────────────────────
CREATE TYPE user_role        AS ENUM ('user', 'business_owner', 'admin');
CREATE TYPE booking_status   AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded', 'expired');
CREATE TYPE event_type       AS ENUM ('concerto', 'festival', 'exposicao', 'outro');
CREATE TYPE category_slug    AS ENUM (
  'restaurantes', 'bares', 'musica-ao-vivo',
  'praias', 'historico', 'hoteis', 'rent-a-car', 'eventos'
);

-- ── 3. Tabela: users ──────────────────────────────────────
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. Tabela: categories ─────────────────────────────────
CREATE TABLE categories (
  id        SERIAL PRIMARY KEY,
  slug      category_slug UNIQUE NOT NULL,
  label_pt  TEXT NOT NULL,
  icon      TEXT NOT NULL,
  color     TEXT NOT NULL
);

INSERT INTO categories (slug, label_pt, icon, color) VALUES
  ('restaurantes',   'Restaurantes',   '🍽️', '#C4622D'),
  ('bares',          'Bares',          '🍹', '#1A8FBF'),
  ('musica-ao-vivo', 'Música ao Vivo', '🎶', '#7C3AED'),
  ('praias',         'Praias',         '🏖️', '#0B5E8A'),
  ('historico',      'Histórico',      '🏛️', '#92400E'),
  ('hoteis',         'Hotéis',         '🏨', '#1D9E75'),
  ('rent-a-car',     'Rent-a-Car',     '🚗', '#374151'),
  ('eventos',        'Eventos',        '🎉', '#DB2777');

-- ── 5. Tabela: places ─────────────────────────────────────
CREATE TABLE places (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  category_id     INTEGER NOT NULL REFERENCES categories(id),
  description     TEXT,
  address         TEXT,
  -- PostGIS point: POINT(longitude latitude)
  location        GEOMETRY(POINT, 4326),
  phone           TEXT,
  website         TEXT,
  opening_hours   JSONB,   -- { "seg": "08:00–22:00", "dom": "Fechado" }
  price_level     SMALLINT CHECK (price_level BETWEEN 1 AND 4),
  rating          NUMERIC(3,2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  verified        BOOLEAN DEFAULT FALSE,
  active          BOOLEAN DEFAULT TRUE,
  owner_id        UUID REFERENCES users(id),
  tags            TEXT[],
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. Tabela: photos ─────────────────────────────────────
CREATE TABLE photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  is_cover    BOOLEAN DEFAULT FALSE,
  sort_order  SMALLINT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 7. Tabela: reviews ────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id),
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, place_id) -- 1 review por utilizador por local
);

-- ── 8. Tabela: events ─────────────────────────────────────
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ,
  price_cve   INTEGER NOT NULL DEFAULT 0,
  capacity    INTEGER,
  sold_count  INTEGER DEFAULT 0,
  type        event_type NOT NULL DEFAULT 'outro',
  image_url   TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 9. Tabela: bookings ───────────────────────────────────
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  place_id        UUID NOT NULL REFERENCES places(id),
  event_id        UUID REFERENCES events(id),
  checkin         DATE,
  checkout        DATE,
  num_persons     SMALLINT DEFAULT 1,
  status          booking_status NOT NULL DEFAULT 'pending',
  total_cve       INTEGER NOT NULL,
  stripe_id       TEXT,              -- PaymentIntent ID
  stripe_session  TEXT,              -- Checkout Session ID (alternativa)
  invoice_number  TEXT,
  invoice_url     TEXT,
  failure_reason  TEXT,
  expires_at      TIMESTAMPTZ,       -- para pending (15 min timeout)
  confirmed_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 10. Tabela: favorites ─────────────────────────────────
CREATE TABLE favorites (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, place_id)
);

-- ═══════════════════════════════════════════════════════════
-- ÍNDICES
-- ═══════════════════════════════════════════════════════════

-- Geoespacial — queries de raio ("mostrar no raio de Xkm")
CREATE INDEX idx_places_location   ON places USING GIST (location);
-- Pesquisa por categoria
CREATE INDEX idx_places_category   ON places (category_id);
-- Pesquisa full-text (trigram) em nome e descrição
CREATE INDEX idx_places_name_trgm  ON places USING GIN (name gin_trgm_ops);
CREATE INDEX idx_places_desc_trgm  ON places USING GIN (description gin_trgm_ops);
-- Listagens activas
CREATE INDEX idx_places_active     ON places (active) WHERE active = TRUE;
-- Reservas por utilizador
CREATE INDEX idx_bookings_user     ON bookings (user_id);
-- Reservas por estado
CREATE INDEX idx_bookings_status   ON bookings (status);
-- Reservas pending a expirar (para o cron job)
CREATE INDEX idx_bookings_expires  ON bookings (expires_at) WHERE status = 'pending';
-- Eventos por data
CREATE INDEX idx_events_starts     ON events (starts_at);
-- Reviews por local (para recalcular rating)
CREATE INDEX idx_reviews_place     ON reviews (place_id);

-- ═══════════════════════════════════════════════════════════
-- FUNÇÕES E TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Recalcula rating do place após insert/update/delete de review
CREATE OR REPLACE FUNCTION recalculate_place_rating()
RETURNS TRIGGER AS $$
DECLARE
  p_id UUID;
BEGIN
  p_id := COALESCE(NEW.place_id, OLD.place_id);
  UPDATE places
  SET
    rating       = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE place_id = p_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE place_id = p_id)
  WHERE id = p_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION recalculate_place_rating();

-- Slug automático a partir do nome
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      TRANSLATE(
        TRIM(name),
        'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
        'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
      ),
      '[^a-z0-9]+', '-', 'g'
    ),
    '-$', ''
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE places    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos    ENABLE ROW LEVEL SECURITY;

-- users: só o próprio se lê; admin vê todos
CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "users_admin" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- places: todos lêem se activo; só owner ou admin edita
CREATE POLICY "places_read" ON places
  FOR SELECT USING (active = TRUE);

CREATE POLICY "places_owner_write" ON places
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "places_admin" ON places
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- reviews: todos lêem; só o autor edita a sua
CREATE POLICY "reviews_read"  ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_write" ON reviews FOR ALL   USING (user_id = auth.uid());

-- bookings: só o próprio utilizador
CREATE POLICY "bookings_self" ON bookings
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "bookings_admin" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- favorites: só o próprio
CREATE POLICY "favorites_self" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- events: todos lêem; só admin/owner escreve
CREATE POLICY "events_read"  ON events FOR SELECT USING (active = TRUE);
CREATE POLICY "events_admin" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'business_owner'))
);

-- photos: todos lêem; só admin/owner escreve
CREATE POLICY "photos_read"  ON photos FOR SELECT USING (TRUE);
CREATE POLICY "photos_admin" ON photos FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'business_owner'))
);

-- ═══════════════════════════════════════════════════════════
-- VIEWS ÚTEIS
-- ═══════════════════════════════════════════════════════════

-- Vista: places com cover photo e categoria
CREATE OR REPLACE VIEW places_with_cover AS
SELECT
  p.*,
  c.slug      AS category_slug,
  c.label_pt  AS category_label,
  c.icon      AS category_icon,
  c.color     AS category_color,
  ph.url      AS cover_url,
  ST_X(p.location::geometry) AS lng,
  ST_Y(p.location::geometry) AS lat
FROM places p
JOIN categories c ON c.id = p.category_id
LEFT JOIN photos ph ON ph.place_id = p.id AND ph.is_cover = TRUE
WHERE p.active = TRUE;

-- Vista: eventos futuros com info do place
CREATE OR REPLACE VIEW upcoming_events AS
SELECT
  e.*,
  p.name   AS place_name,
  p.slug   AS place_slug,
  p.address AS place_address
FROM events e
JOIN places p ON p.id = e.place_id
WHERE e.starts_at > NOW() AND e.active = TRUE
ORDER BY e.starts_at ASC;

-- ═══════════════════════════════════════════════════════════
-- SEED: 50 POIs de Santiago
-- ═══════════════════════════════════════════════════════════

-- Inserir utilizador admin
INSERT INTO users (id, email, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@santiagu.cv', 'Admin Santi''Águ', 'admin');

-- Inserir POIs (amostra — 20 dos 50)
INSERT INTO places (name, slug, category_id, description, address, location, rating, review_count, verified, tags) VALUES

-- Restaurantes
('Restaurante Quintal da Música',    'quintal-da-musica',   1, 'Gastronomia cabo-verdiana com música ao vivo ao fim de semana. Especialidade em cachupa rica.',   'Plateau, Praia',              ST_GeomFromText('POINT(-23.5133 14.9315)', 4326), 4.8, 124, TRUE,  ARRAY['Cachupa','Música ao Vivo','Esplanada']),
('Restaurante Sol Atlantico',        'sol-atlantico',       1, 'Vista para o oceano e pratos de peixe fresco diário. Um dos mais antigos de Praia.',               'Prainha, Praia',              ST_GeomFromText('POINT(-23.5089 14.9278)', 4326), 4.6, 98,  TRUE,  ARRAY['Peixe Fresco','Vista Mar','Almoço']),
('Kebab & Grills Santiago',          'kebab-grills',        1, 'Grelhados e espetadas ao estilo cabo-verdiano. Excelente para grupos.',                           'Achada de Santo António, Praia', ST_GeomFromText('POINT(-23.5071 14.9354)', 4326), 4.3, 67,  FALSE, ARRAY['Grelhados','Espetadas','Grupos']),
('Casa da Morna',                    'casa-da-morna',       1, 'Ambiente tradicional com música de morna ao jantar. Cachupa, lagosta e xerém.',                   'Plateau, Praia',              ST_GeomFromText('POINT(-23.5142 14.9322)', 4326), 4.7, 145, TRUE,  ARRAY['Morna','Lagosta','Cachupa']),
('Restaurante Morabeza',             'restaurante-morabeza',1, 'O verdadeiro sabor de Santiago — pratos tradicionais a preços acessíveis.',                       'Tira Chapeu, Praia',          ST_GeomFromText('POINT(-23.5198 14.9287)', 4326), 4.4, 82,  TRUE,  ARRAY['Tradicional','Acessível','Local']),

-- Bares
('Bar Café Mindelo',                 'cafe-mindelo',        2, 'Cocktails tropicais e ambiente descontraído no coração de Praia.',                                'Plateau, Praia',              ST_GeomFromText('POINT(-23.5121 14.9325)', 4326), 4.5, 63,  FALSE, ARRAY['Cocktails','Esplanada','DJ Noturno']),
('Esplanada do Porto',               'esplanada-porto',     2, 'Bar à beira-mar com sundowners e petiscos. Pôr do sol imperdível.',                               'Porto de Praia',              ST_GeomFromText('POINT(-23.5033 14.9201)', 4326), 4.6, 91,  TRUE,  ARRAY['Sundowner','Vista Mar','Petiscos']),
('Lounge Bar Santiago',              'lounge-bar-santiago', 2, 'O bar mais moderno de Praia — design contemporâneo, cocktails de autor.',                         'Achada de Santo António, Praia', ST_GeomFromText('POINT(-23.5059 14.9368)', 4326), 4.2, 44,  FALSE, ARRAY['Cocktails','Design','Noturno']),

-- Música ao Vivo
('Festival de Batuque de Santiago',  'festival-batuque',    3, 'O maior festival de música tradicional de Santiago. Funaná, batuque e morna.',                   'Assomada, Santa Catarina',    ST_GeomFromText('POINT(-23.6832 15.0964)', 4326), 4.9, 201, TRUE,  ARRAY['Batuque','Funaná','Morna','Festival']),
('Clube Cultural Raíz di Polon',     'raiz-di-polon',       3, 'Noites de funaná e batuque ao vivo toda a sexta. O melhor da música cabo-verdiana.',             'Tira Chapeu, Praia',          ST_GeomFromText('POINT(-23.5211 14.9279)', 4326), 4.8, 178, TRUE,  ARRAY['Funaná','Batuque','Sextas']),

-- Praias
('Praia de Tarrafal',                'praia-tarrafal',      4, 'A praia mais famosa de Santiago — águas cristalinas, areia branca e snorkeling.',                'Tarrafal',                    ST_GeomFromText('POINT(-23.7524 15.2775)', 4326), 4.9, 342, TRUE,  ARRAY['Snorkeling','Mergulho','Bar de Praia','Familiar']),
('Praia Quebra Canela',              'quebra-canela',       4, 'A praia urbana de Praia — fácil acesso, animada ao fim de semana.',                               'Praia Negra, Praia',          ST_GeomFromText('POINT(-23.5178 14.9218)', 4326), 4.3, 156, TRUE,  ARRAY['Urbana','Acessível','Animada']),
('Praia de São Francisco',           'praia-sao-francisco', 4, 'Praia tranquila a sul de Praia, ideal para famílias e mergulho.',                                 'São Francisco, Santiago Sul', ST_GeomFromText('POINT(-23.5332 14.8998)', 4326), 4.6, 112, TRUE,  ARRAY['Tranquila','Familiar','Mergulho']),
('Praia de Santa Clara',             'praia-santa-clara',   4, 'Praia isolada com acesso por estrada de terra — vale muito a pena.',                              'Santa Clara, Tarrafal',       ST_GeomFromText('POINT(-23.7698 15.2543)', 4326), 4.7, 87,  FALSE, ARRAY['Isolada','Virgem','Fotografia']),

-- Histórico
('Cidade Velha — Centro Histórico',  'cidade-velha',        5, 'Primeiro assentamento europeu nos Trópicos. Património Mundial UNESCO desde 2009.',               'Cidade Velha, Santiago',      ST_GeomFromText('POINT(-23.6044 14.9139)', 4326), 4.7, 289, TRUE,  ARRAY['UNESCO','História','Pelourinho','Sé Catedral']),
('Forte Real de São Filipe',         'forte-sao-filipe',    5, 'Fortaleza do século XVI com vista panorâmica sobre Cidade Velha e o oceano.',                    'Cidade Velha, Santiago',      ST_GeomFromText('POINT(-23.6021 14.9112)', 4326), 4.6, 167, TRUE,  ARRAY['Fortaleza','Vista Panorâmica','Século XVI']),
('Museu de Arqueologia',             'museu-arqueologia',   5, 'Colecção de artefactos da época da colonização e pré-história de Santiago.',                     'Cidade Velha, Santiago',      ST_GeomFromText('POINT(-23.6038 14.9145)', 4326), 4.2, 78,  TRUE,  ARRAY['Arqueologia','Colonização','Cultura']),

-- Hotéis
('Hotel Trópico',                    'hotel-tropico',       6, 'Hotel de referência em Praia com piscina, restaurante e vista para o oceano.',                   'Fazenda, Praia',              ST_GeomFromText('POINT(-23.5173 14.9254)', 4326), 4.2, 87,  TRUE,  ARRAY['Piscina','WiFi','Restaurante','Business']),
('Pensão Paraíso',                   'pensao-paraiso',      6, 'Pensão confortável no centro de Praia — ótima relação qualidade/preço.',                         'Plateau, Praia',              ST_GeomFromText('POINT(-23.5147 14.9318)', 4326), 4.0, 54,  TRUE,  ARRAY['Económico','Central','Pequeno-almoço']),

-- Rent-a-Car
('Santiago Car Rental',              'santiago-car-rental', 7, 'Maior frota de rent-a-car em Santiago. Motos, carros e 4x4 para explorar a ilha.',               'Aeroporto Internacional, Praia', ST_GeomFromText('POINT(-23.4933 14.9247)', 4326), 4.4, 73, TRUE, ARRAY['4x4','Moto','Aeroporto','GPS incluído']);

-- Inserir cover photos para os primeiros locais
INSERT INTO photos (place_id, url, is_cover, sort_order) 
SELECT id, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', TRUE, 0
FROM places WHERE slug = 'quintal-da-musica';

INSERT INTO photos (place_id, url, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', TRUE, 0
FROM places WHERE slug = 'praia-tarrafal';

INSERT INTO photos (place_id, url, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800', TRUE, 0
FROM places WHERE slug = 'cidade-velha';

INSERT INTO photos (place_id, url, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', TRUE, 0
FROM places WHERE slug = 'hotel-tropico';

INSERT INTO photos (place_id, url, is_cover, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', TRUE, 0
FROM places WHERE slug = 'festival-batuque';
