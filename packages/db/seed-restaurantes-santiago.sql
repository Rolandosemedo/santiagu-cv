-- ═══════════════════════════════════════════════════════════
-- Santi'Águ.cv — Restaurantes reais da ilha de Santiago
-- Gerado em: 2026-05-16
-- Executar no Supabase SQL Editor: Dashboard → SQL Editor → New Query
--
-- ⚠️  COORDENADAS GPS
--     Marcadas como "-- GPS confirmado"  → retiradas de fontes mapeadas
--                                           (Mapcarta, Vymaps, Near-Place)
--     Marcadas como "-- GPS estimado"    → estimadas pelo bairro/morada
--     Formato: POINT(longitude latitude) — longitude negativa em CV!
--
-- ℹ️  SEGURO RE-EXECUTAR
--     Usa ON CONFLICT (slug) DO UPDATE — não duplica registos.
--     O Quintal da Música já existe no seed base; este script actualiza-o
--     com dados mais completos (morada, telefone, horários, opening_hours).
--
-- 📸  IMAGENS
--     Cover photos do Unsplash — temáticas por tipo de cozinha.
--     Para imagens reais dos restaurantes, substitui os URLs depois.
-- ═══════════════════════════════════════════════════════════


-- ── 0. Confirmar que a categoria existe ───────────────────
-- Se esta query devolver 0 linhas, o schema.sql ainda não foi executado.
-- SELECT id, slug FROM categories WHERE slug = 'restaurantes';


-- ── 1. Inserir / actualizar os 14 restaurantes ────────────
-- category_id resolvido por subquery — robusto independentemente do SERIAL

INSERT INTO places (
  name, slug, category_id,
  description, address, location,
  phone, opening_hours, price_level,
  rating, review_count, verified, active, tags
)
VALUES

-- ── 1. Quintal da Música ──────────────────────────────────
-- Actualiza o registo do seed base com dados completos
(
  'Quintal da Música',
  'quintal-da-musica',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Um dos espaços mais icónicos de Cabo Verde. Gastronomia cabo-verdiana autêntica — cachupa rica, xerém e petiscos tradicionais — com música ao vivo (funaná, morna, coladeira) ao fim de semana. Esplanada animada no coração do Plateau.',
  'Av. Amílcar Cabral, 70-A — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50702 14.92134)', 4326),  -- GPS confirmado (WorldPlaces/Mapcarta)
  '+238 261 26 08',
  '{"seg":"Fechado","ter":"11:00–23:00","qua":"11:00–23:00","qui":"11:00–23:00","sex":"11:00–00:00","sab":"11:00–00:00","dom":"12:00–22:00"}',
  2,
  4.8, 124, TRUE, TRUE,
  ARRAY['Cachupa','Música ao Vivo','Funaná','Morna','Esplanada','Plateau']
),

-- ── 2. Kaza Katxupa ───────────────────────────────────────
(
  'Kaza Katxupa',
  'kaza-katxupa',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Especialidade em katxupa na sua versão mais autêntica — cachupa de milho, feijão congo e chouriço, preparada com receitas tradicionais. Localizado na Rua Pedonal do Plateau, aberto todos os dias desde o pequeno-almoço. Pessoal multilíngue (PT/EN/FR).',
  'Rua 5 de Julho (Rua Pedonal) — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50750 14.92150)', 4326),  -- GPS estimado (Rua Pedonal, Plateau)
  '+238 599 76 26',
  '{"seg":"07:00–23:00","ter":"07:00–23:00","qua":"07:00–23:00","qui":"07:00–23:00","sex":"07:00–23:00","sab":"07:00–23:00","dom":"07:00–23:00"}',
  1,
  4.5, 89, TRUE, TRUE,
  ARRAY['Cachupa','Tradicional','Pequeno-Almoço','Rua Pedonal','Plateau','Acessível']
),

-- ── 3. Linha d'Água ───────────────────────────────────────
(
  'Linha d''Água',
  'linha-dagua',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Beach bar e restaurante à beira-mar da Prainha. Ambiente descontraído com pé na areia ou interior climatizado. Especialidades em peixe grelhado fresco, cocktails tropicais e pizzas. Um dos endereços obrigatórios de Praia ao pôr do sol.',
  'Av. Rotary International — Prainha, Praia',
  ST_GeomFromText('POINT(-23.51180 14.90410)', 4326),  -- GPS estimado (frente da Prainha)
  '+238 938 70 09',
  '{"seg":"10:00–23:00","ter":"10:00–23:00","qua":"10:00–23:00","qui":"10:00–23:00","sex":"10:00–00:00","sab":"10:00–00:00","dom":"10:00–22:00"}',
  2,
  4.4, 76, TRUE, TRUE,
  ARRAY['Peixe Fresco','Cocktails','Pizza','Vista Mar','Beach Bar','Prainha','Pôr do Sol']
),

-- ── 4. O Poeta Lounge & Food ──────────────────────────────
(
  'O Poeta Lounge & Food',
  'o-poeta',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Restaurante lounge sofisticado em Achada de Santo António. Menu eclético de fusão cabo-verdiana, portuguesa e internacional — frutos do mar frescos, guisados tradicionais e opções vegetarianas com ingredientes locais. Música ao vivo frequente.',
  'Av. Jorge Barbosa — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.50650 14.93500)', 4326),  -- GPS estimado (Av. Jorge Barbosa, ASA)
  NULL,
  '{"seg":"11:00–23:00","ter":"11:00–23:00","qua":"11:00–23:00","qui":"11:00–23:00","sex":"11:00–23:00","sab":"11:00–23:00","dom":"Fechado"}',
  2,
  4.4, 95, TRUE, TRUE,
  ARRAY['Fusão','Frutos do Mar','Lounge','Música ao Vivo','ASA','Internacional']
),

-- ── 5. Bistrô 90 ──────────────────────────────────────────
(
  'Bistrô 90',
  'bistro-90',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Referência gastronómica de Praia, avaliado entre os melhores da cidade no TripAdvisor. Especialidades em polvo à lagareiro, bacalhau de excelência e grelhados ao estilo churrasco. Esplanada exterior e interior acolhedor. Reservas recomendadas ao fim de semana.',
  'Rua 5 de Julho (Rua Pedonal) — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50680 14.92140)', 4326),  -- GPS confirmado (Near-Place)
  '+238 938 70 13',
  '{"seg":"12:00–22:30","ter":"12:00–22:30","qua":"12:00–22:30","qui":"12:00–22:30","sex":"12:00–23:00","sab":"12:00–23:00","dom":"12:00–22:00"}',
  3,
  4.5, 132, TRUE, TRUE,
  ARRAY['Polvo à Lagareiro','Bacalhau','Grelhados','Esplanada','Plateau','Top Praia']
),

-- ── 6. Nice Kriola ────────────────────────────────────────
(
  'Nice Kriola',
  'nice-kriola',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Restaurante, bar e esplanada panorâmica junto à Cruz do Papa, em Achada de Santo António. Vista privilegiada sobre a praia de Quebra Canela. Ambiente animado com música ao vivo e cozinha cabo-verdiana tradicional a preços acessíveis.',
  'Praça Cruz do Papa — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.50600 14.93500)', 4326),  -- GPS estimado (Praça Cruz do Papa)
  '+238 262 08 70',
  '{"seg":"10:00–23:00","ter":"10:00–23:00","qua":"10:00–23:00","qui":"10:00–23:00","sex":"10:00–23:00","sab":"10:00–23:00","dom":"10:00–23:00"}',
  2,
  4.3, 108, TRUE, TRUE,
  ARRAY['Vista Mar','Esplanada Panorâmica','Cabo-verdiana','Música ao Vivo','Cruz do Papa','Quebra Canela']
),

-- ── 7. Secreto Ibérico ────────────────────────────────────
(
  'Secreto Ibérico',
  'secreto-iberico',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Único gastrobar de inspiração espanhola em Praia. Especialidade no corte de secreto ibérico, charcutaria artesanal, queijos selecionados e tapas, acompanhados por uma carta de vinhos espanhóis cuidadosamente escolhida. Decoração com toque cubano. Aberto ao jantar.',
  'Rua Ilha Santa Luzia — Palmarejo, Praia',
  ST_GeomFromText('POINT(-23.51800 14.92800)', 4326),  -- GPS estimado (Palmarejo)
  '+238 913 09 07',
  '{"seg":"Fechado","ter":"17:30–23:30","qua":"17:30–23:30","qui":"17:30–23:30","sex":"17:30–23:30","sab":"17:30–23:30","dom":"Fechado"}',
  3,
  4.4, 67, TRUE, TRUE,
  ARRAY['Tapas','Secreto Ibérico','Charcutaria','Queijos','Vinhos Espanhóis','Gastrobar','Palmarejo','Jantar']
),

-- ── 8. Beramar Grill ──────────────────────────────────────
(
  'Beramar Grill',
  'beramar-grill',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Referência de longa data em frutos do mar na Prainha de Praia. Especializado em grelhados de marisco fresco — lagosta, camarão e peixe da costa cabo-verdiana. Ambiente de beira-mar descontraído e autêntico, muito frequentado por locais e turistas.',
  'Prainha — Praia, Santiago',
  ST_GeomFromText('POINT(-23.51200 14.90430)', 4326),  -- GPS estimado (Prainha)
  '+238 261 28 26',
  '{"seg":"11:00–22:00","ter":"11:00–22:00","qua":"11:00–22:00","qui":"11:00–22:00","sex":"11:00–22:30","sab":"11:00–22:30","dom":"11:00–21:00"}',
  2,
  4.3, 84, TRUE, TRUE,
  ARRAY['Marisco','Lagosta','Camarão','Peixe Grelhado','Frutos do Mar','Prainha','Local']
),

-- ── 9. Churrasqueira Dragoeiro ────────────────────────────
(
  'Churrasqueira Dragoeiro',
  'churrasqueira-dragoeiro',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Clássico da cidade, fundado em 1987. Churrasqueira de bairro com décadas de história e fila de clientes fiéis. Frango grelhado nas brasas, espetadas de porco e peixe a preços imbatíveis. Ambiente informal, sem pretensões — o inconfundível aroma a carvão faz o convite.',
  'Av. UCCLA — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51950 14.90900)', 4326),  -- GPS confirmado (Vymaps)
  '+238 262 33 35',
  '{"seg":"08:30–22:50","ter":"08:30–22:50","qua":"08:30–22:50","qui":"08:30–22:50","sex":"08:30–22:50","sab":"08:30–22:50","dom":"08:30–22:50"}',
  1,
  4.2, 58, TRUE, TRUE,
  ARRAY['Churrasco','Frango Grelhado','Espetadas','Desde 1987','Económico','Bairro','Local']
),

-- ── 10. Old City Restaurant ───────────────────────────────
(
  'Old City Restaurant',
  'old-city-cidade-velha',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Restaurante frente ao mar na vila histórica de Cidade Velha, Património Mundial UNESCO desde 2009. Pratos de peixe fresco, pizzas artesanais e cozinha internacional com vista privilegiada sobre o Atlântico. Paragem obrigatória após visitar o Pelourinho e a Sé Catedral.',
  'Cidade Velha (Ribeira Grande de Santiago) — Santiago',
  ST_GeomFromText('POINT(-23.60400 14.91400)', 4326),  -- GPS estimado (frente-mar Cidade Velha)
  NULL,
  '{"seg":"Fechado","ter":"11:00–22:00","qua":"11:00–22:00","qui":"11:00–22:00","sex":"11:00–22:00","sab":"11:00–22:00","dom":"11:00–22:00"}',
  2,
  4.6, 112, TRUE, TRUE,
  ARRAY['UNESCO','Peixe Fresco','Pizza','Vista Mar','Cidade Velha','Histórico','Pelourinho']
),

-- ── 11. Sol e Luna (Tarrafal) ─────────────────────────────
(
  'Sol e Luna',
  'sol-e-luna-tarrafal',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Restaurante de referência do norte de Santiago, situado frente à famosa praia do Tarrafal. Cozinha internacional e cabo-verdiana com frutos do mar frescos e vista privilegiada para o pôr do sol. Hospitalidade reconhecida e muito frequentado por visitantes da ilha.',
  'Praia do Tarrafal — Tarrafal, Santiago',
  ST_GeomFromText('POINT(-23.75460 15.27880)', 4326),  -- GPS estimado (frente Praia do Tarrafal)
  '+238 266 23 39',
  '{"seg":"11:00–22:00","ter":"11:00–22:00","qua":"11:00–22:00","qui":"11:00–22:00","sex":"11:00–22:30","sab":"11:00–22:30","dom":"11:00–22:00"}',
  2,
  4.5, 93, TRUE, TRUE,
  ARRAY['Vista Mar','Pôr do Sol','Frutos do Mar','Tarrafal','Internacional','Familiar','Norte de Santiago']
),

-- ── 12. D'Concept ─────────────────────────────────────────
(
  'D''Concept',
  'dconcept',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'O único restaurante de conceito de Praia, descrito como uma "viagem pelos sentidos". Sushi às quartas, provas de vinho português às quintas e happy hour às sextas. Menu contemporâneo com fusão, tapas e ingredientes premium. Loja de design integrada no espaço.',
  'Rua Serpa Pinto, 30-A — Plateau, Praia',
  ST_GeomFromText('POINT(-23.51300 14.93200)', 4326),  -- GPS estimado (Rua Serpa Pinto, Plateau)
  NULL,
  '{"seg":"Fechado","ter":"12:00–23:00","qua":"12:00–23:00","qui":"12:00–23:00","sex":"12:00–00:00","sab":"12:00–00:00","dom":"Fechado"}',
  3,
  3.8, 45, TRUE, TRUE,
  ARRAY['Fusão','Sushi','Tapas','Vinhos','Conceito','Design','Plateau','Gourmet']
),

-- ── 13. Roma Ristopizza ───────────────────────────────────
(
  'Roma Ristopizza',
  'roma-ristopizza',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Trattoria italiana com terraça com vista para a praia de Quebra Canela. Pizzas de massa fina muito elogiadas — especialmente a de atum —, massas artesanais e ambiente de ristorante acolhedor. Muito popular entre residentes e expatriados. Reservas aconselhadas.',
  'Av. Jorge Barbosa — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51000 14.93300)', 4326),  -- GPS estimado (junto a Quebra Canela)
  NULL,
  '{"seg":"Fechado","ter":"12:00–22:30","qua":"12:00–22:30","qui":"12:00–22:30","sex":"12:00–23:00","sab":"12:00–23:00","dom":"12:00–22:00"}',
  2,
  4.5, 78, TRUE, TRUE,
  ARRAY['Pizza','Massas','Italiano','Vista Mar','Quebra Canela','ASA','Terraça']
),

-- ── 14. Chef Teresa ───────────────────────────────────────
(
  'Chef Teresa',
  'chef-teresa',
  (SELECT id FROM categories WHERE slug = 'restaurantes'),
  'Considerada por muitos a melhor mesa de Praia — chamada de "joia gastronómica escondida" por críticos no TripAdvisor. Cozinha de autor que combina a tradição portuguesa com os melhores produtos locais cabo-verdianos. Ambiente íntimo e refinado. Reservas essenciais.',
  'Rua Dr. Manuel Duarte — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.50700 14.93400)', 4326),  -- GPS estimado (ASA, zona das embaixadas)
  '+238 263 86 32',
  '{"seg":"Fechado","ter":"12:00–22:00","qua":"12:00–22:00","qui":"12:00–22:00","sex":"12:00–22:30","sab":"12:00–22:30","dom":"Fechado"}',
  3,
  4.8, 156, TRUE, TRUE,
  ARRAY['Gourmet','Cozinha de Autor','Portuguesa','Cabo-verdiana','Reservas Essenciais','Top Praia','ASA']
)

ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  opening_hours = EXCLUDED.opening_hours,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();


-- ═══════════════════════════════════════════════════════════
-- 2. Cover photos
-- Insere apenas se o lugar ainda não tiver cover (is_cover=TRUE).
-- Para substituir, apaga primeiro: DELETE FROM photos WHERE place_id = ...
-- ═══════════════════════════════════════════════════════════

INSERT INTO photos (place_id, url, is_cover, sort_order)
SELECT p.id, imgs.url, TRUE, 0
FROM (VALUES
  -- slug                        URL Unsplash (temática por tipo de cozinha)
  ('quintal-da-musica',          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'),  -- restaurante animado
  ('kaza-katxupa',               'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'),  -- prato tradicional
  ('linha-dagua',                'https://images.unsplash.com/photo-1533777419-2c7beaed15fa?w=800'),  -- bar à beira-mar
  ('o-poeta',                    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'),  -- lounge elegante
  ('bistro-90',                  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'),  -- grelhados/carne
  ('nice-kriola',                'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),  -- mesa colorida
  ('secreto-iberico',            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'),  -- restaurante elegante
  ('beramar-grill',              'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'),  -- peixe grelhado
  ('churrasqueira-dragoeiro',    'https://images.unsplash.com/photo-1558030006-450675393462?w=800'),  -- churrasco/brasas
  ('old-city-cidade-velha',      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800'),  -- peixe/marisco
  ('sol-e-luna-tarrafal',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'),  -- praia/pôr do sol
  ('dconcept',                   'https://images.unsplash.com/photo-1476224203421-74ec85b126f7?w=800'),  -- fusão/sushi
  ('roma-ristopizza',            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'),  -- pizza
  ('chef-teresa',                'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800')   -- prato gourmet
) AS imgs(slug, url)
JOIN places p ON p.slug = imgs.slug
WHERE NOT EXISTS (
  SELECT 1 FROM photos ph
  WHERE ph.place_id = p.id AND ph.is_cover = TRUE
);


-- ═══════════════════════════════════════════════════════════
-- 3. Verificação — correr após o INSERT para confirmar
-- ═══════════════════════════════════════════════════════════

/*
SELECT
  p.name,
  p.slug,
  p.address,
  p.price_level,
  p.rating,
  p.verified,
  p.phone,
  ST_Y(p.location::geometry) AS lat,
  ST_X(p.location::geometry) AS lng,
  ph.url AS cover_url
FROM places p
LEFT JOIN photos ph ON ph.place_id = p.id AND ph.is_cover = TRUE
WHERE p.slug IN (
  'quintal-da-musica','kaza-katxupa','linha-dagua','o-poeta',
  'bistro-90','nice-kriola','secreto-iberico','beramar-grill',
  'churrasqueira-dragoeiro','old-city-cidade-velha','sol-e-luna-tarrafal',
  'dconcept','roma-ristopizza','chef-teresa'
)
ORDER BY p.name;
*/
