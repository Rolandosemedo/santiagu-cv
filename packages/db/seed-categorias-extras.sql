-- ═══════════════════════════════════════════════════════════
-- Santi'Águ.cv — Locais adicionais por categoria
-- Gerado em: 2026-05-17
-- Executar no Supabase SQL Editor após seed-restaurantes-santiago.sql
-- Seguro re-executar — usa ON CONFLICT (slug) DO UPDATE
-- ═══════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════
-- 1. HOTÉIS
-- ════════════════════════════════════════════════════════════
INSERT INTO places (name, slug, category_id, description, address, location, phone, price_level, rating, review_count, verified, active, tags)
VALUES

(
  'Hotel Praia Mar',
  'hotel-praia-mar',
  (SELECT id FROM categories WHERE slug = 'hoteis'),
  'Hotel de referência em Praia, com vista directa para a Praia de Quebra Canela. Quartos amplos e modernos, piscina exterior, restaurante e bar. Localização privilegiada em Achada de Santo António, a poucos minutos do Plateau e das principais atracções da cidade.',
  'Av. Marginal — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51189 14.90516)', 4326),
  '+238 261 48 00',
  3, 4.2, 210, TRUE, TRUE,
  ARRAY['Vista Mar','Piscina','Quebra Canela','Business','ASA']
),

(
  'VIP Praia Hotel',
  'vip-praia-hotel',
  (SELECT id FROM categories WHERE slug = 'hoteis'),
  'Hotel de charme em Achada de Santo António com design contemporâneo e serviço personalizado. Terraço panorâmico com vista sobre a baía de Praia, spa, piscina aquecida e restaurante internacional. Preferido por viajantes de negócios e turismo de qualidade.',
  'Av. OUA — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.50984 14.93180)', 4326),
  '+238 260 31 00',
  3, 4.3, 178, TRUE, TRUE,
  ARRAY['Spa','Piscina','Panorâmico','Business','ASA','Internacional']
),

(
  'Oásis Atlântico Praiamar',
  'oasis-atlantico-praiamar',
  (SELECT id FROM categories WHERE slug = 'hoteis'),
  'O maior hotel de Cabo Verde em número de quartos, situado no coração do Plateau. Infraestruturas completas: dois restaurantes, bares, piscina, ginásio e salões de eventos. Ponto de encontro da comunidade diplomática e empresarial da capital.',
  'Rua Serpa Pinto — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50760 14.92310)', 4326),
  '+238 261 37 00',
  3, 4.0, 342, TRUE, TRUE,
  ARRAY['Plateau','Piscina','Eventos','Diplomático','Histórico','Maior Hotel CV']
),

(
  'Hotel Girassol',
  'hotel-girassol',
  (SELECT id FROM categories WHERE slug = 'hoteis'),
  'Hotel de quatro estrelas em Achada de Santo António, um dos mais modernos de Praia. Quartos espaçosos com ar-condicionado e vista cidade, piscina no rooftop, restaurante cabo-verdiano e bar. Excelente relação qualidade-preço para estadas de negócio e lazer.',
  'Av. Cidade de Lisboa — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51020 14.93050)', 4326),
  '+238 261 60 00',
  2, 4.1, 156, TRUE, TRUE,
  ARRAY['4 Estrelas','Rooftop','Piscina','ASA','Moderno','Negócios']
),

(
  'Pensão Central',
  'pensao-central',
  (SELECT id FROM categories WHERE slug = 'hoteis'),
  'A pensão mais antiga do Plateau, com décadas de história e ambiente genuinamente cabo-verdiano. Quartos simples mas confortáveis, pequeno-almoço incluído e localização imbatível no centro histórico de Praia. Ideal para viajantes independentes e mochileiros.',
  'Rua Serpa Pinto, 10 — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50720 14.92180)', 4326),
  '+238 261 15 34',
  1, 3.7, 89, TRUE, TRUE,
  ARRAY['Económico','Plateau','Histórico','Mochileiros','Pequeno-Almoço']
),

(
  'Residencial Sol Atlântico',
  'residencial-sol-atlantico',
  (SELECT id FROM categories WHERE slug = 'hoteis'),
  'Residencial familiar com vista para o Atlântico, em zona residencial tranquila de Praia. Apartamentos com kitchenette, ideais para estadas longas. Ambiente caseiro, estacionamento gratuito e fácil acesso à Praia de Quebra Canela a pé.',
  'Rua Abílio Macedo — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51050 14.90780)', 4326),
  NULL,
  1, 3.8, 62, TRUE, TRUE,
  ARRAY['Familiar','Vista Mar','Apartamentos','Kitchenette','Longa Estada']
)

ON CONFLICT (slug) DO UPDATE SET
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();


-- ════════════════════════════════════════════════════════════
-- 2. BARES
-- ════════════════════════════════════════════════════════════
INSERT INTO places (name, slug, category_id, description, address, location, phone, price_level, rating, review_count, verified, active, tags)
VALUES

(
  'Enki Lounge Bar',
  'enki-lounge-bar',
  (SELECT id FROM categories WHERE slug = 'bares'),
  'Bar lounge moderno no Plateau, referência da vida nocturna de Praia. Cocktails autorais com rum de Cabo Verde, tapas e ambiente descontraído com música ambiente. Esplanada exterior com vista para o Atlântico. Um dos poucos bares em Praia abertos até tarde.',
  'Rua Guerra Mendes — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50810 14.92250)', 4326),
  '+238 261 19 72',
  2, 4.2, 134, TRUE, TRUE,
  ARRAY['Cocktails','Lounge','Noite','Plateau','Rum CV','Tapas','Vista Mar']
),

(
  'Café Royal',
  'cafe-royal-praia',
  (SELECT id FROM categories WHERE slug = 'bares'),
  'Café e bar histórico do Plateau, ponto de encontro de intelectuais, artistas e políticos cabo-verdianos desde os anos 70. Ambiente descontraído com esplanada na Rua Pedonal, petiscos, café de altitude e cervejas frescas. Ícone cultural da cidade.',
  'Rua 5 de Julho (Rua Pedonal) — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50740 14.92160)', 4326),
  NULL,
  1, 4.0, 98, TRUE, TRUE,
  ARRAY['Histórico','Café','Cultural','Rua Pedonal','Intelectual','Plateau']
),

(
  'Bar Esplanada da Gamboa',
  'bar-esplanada-gamboa',
  (SELECT id FROM categories WHERE slug = 'bares'),
  'Bar de praia descontraído junto à Praia da Gamboa, com cadeiras de madeira e música de funaná ao fim de semana. Especialidade em ponche de cana, grog artesanal e petiscos de peixe fresco. O sítio preferido dos praenses para o fim de tarde com vista para o porto.',
  'Praia da Gamboa — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50520 14.92050)', 4326),
  NULL,
  1, 3.9, 72, TRUE, TRUE,
  ARRAY['Praia Bar','Ponche','Grog','Funaná','Vista Porto','Gamboa','Autêntico']
),

(
  'Skipper Bar',
  'skipper-bar',
  (SELECT id FROM categories WHERE slug = 'bares'),
  'Bar náutico junto ao porto de Praia, muito frequentado por velejadores e tripulações de passagem na travessia do Atlântico. Ambiente internacional, boa selecção de cervejas importadas e cocktails. Wi-Fi rápido e informações sobre ancoragem.',
  'Porto da Praia — Praia',
  ST_GeomFromText('POINT(-23.50490 14.91820)', 4326),
  NULL,
  2, 3.8, 55, TRUE, TRUE,
  ARRAY['Náutico','Porto','Velejadores','Internacional','Travessia Atlântico','Cerveja']
),

(
  'Club Atlântico',
  'club-atlantico',
  (SELECT id FROM categories WHERE slug = 'bares'),
  'Principal clube nocturno de Praia com capacidade para 500 pessoas. Música ao vivo ao fim de semana — funaná, zouk, kizomba e hits internacionais. Pista de dança, bar completo e esplanada exterior. A vida nocturna de Praia concentra-se aqui após a meia-noite.',
  'Av. Cidade de Lisboa — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51100 14.93020)', 4326),
  '+238 261 55 89',
  2, 4.1, 203, TRUE, TRUE,
  ARRAY['Clube','Noite','Funaná','Zouk','Kizomba','Dança','ASA','Weekend']
)

ON CONFLICT (slug) DO UPDATE SET
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();


-- ════════════════════════════════════════════════════════════
-- 3. PRAIAS
-- ════════════════════════════════════════════════════════════
INSERT INTO places (name, slug, category_id, description, address, location, phone, price_level, rating, review_count, verified, active, tags)
VALUES

(
  'Praia de São Francisco',
  'praia-sao-francisco',
  (SELECT id FROM categories WHERE slug = 'praias'),
  'Praia extensa de areia fina a sul de Praia, com 2 km de extensão e água cristalina. Menos frequentada que Quebra Canela, ideal para quem procura tranquilidade. Ondas moderadas que atraem surfistas e bodyborders. Acesso de carro fácil com parque informal junto à praia.',
  'São Francisco — Santiago',
  ST_GeomFromText('POINT(-23.48750 14.87200)', 4326),
  NULL,
  0, 4.5, 145, TRUE, TRUE,
  ARRAY['Areia Fina','Surf','Tranquila','Extensa','Sul de Praia','Cristalina']
),

(
  'Praia do Porto Mosquito',
  'praia-porto-mosquito',
  (SELECT id FROM categories WHERE slug = 'praias'),
  'Pequena enseada com água turquesa e fundo arenoso, encaixada entre rochas vulcânicas. Uma das praias mais bonitas da zona sul de Santiago. Frequentada principalmente por locais, com alguns restaurantes de peixe fresco nas imediações. Excelente para snorkeling.',
  'Porto Mosquito — Santiago',
  ST_GeomFromText('POINT(-23.47600 14.87950)', 4326),
  NULL,
  0, 4.6, 98, TRUE, TRUE,
  ARRAY['Snorkeling','Turquesa','Enseada','Local','Vulcânica','Sul Santiago']
),

(
  'Praia do Xaguate',
  'praia-do-xaguate',
  (SELECT id FROM categories WHERE slug = 'praias'),
  'Praia de areia escura (basáltica) junto à histórica Cidade Velha, Património Mundial UNESCO. A combinação da paisagem vulcânica, o forte no cimo do rochedo e a aldeia colonial fazem desta praia um dos cenários mais fotogénicos de Cabo Verde. Óptima para mergulho.',
  'Cidade Velha (Ribeira Grande de Santiago) — Santiago',
  ST_GeomFromText('POINT(-23.60920 14.91250)', 4326),
  NULL,
  0, 4.4, 112, TRUE, TRUE,
  ARRAY['Areia Negra','UNESCO','Cidade Velha','Histórica','Fotogénica','Mergulho','Basáltica']
),

(
  'Praia da Gamboa',
  'praia-da-gamboa',
  (SELECT id FROM categories WHERE slug = 'praias'),
  'Praia urbana no centro de Praia, junto ao porto e ao Plateau histórico. Pequena mas animada, com barcos de pesca coloridos e vendedores de fruta. Principal ponto de encontro dos praenses ao fim de tarde. Perfeita para sentir o pulso autêntico da cidade.',
  'Gamboa — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50350 14.91890)', 4326),
  NULL,
  0, 3.8, 87, TRUE, TRUE,
  ARRAY['Urbana','Barca de Pesca','Plateau','Animada','Autêntica','Centro de Praia']
),

(
  'Praia de Salinhas',
  'praia-de-salinhas',
  (SELECT id FROM categories WHERE slug = 'praias'),
  'Extensa praia deserta a norte de Praia, rodeada de salinas tradicionais ainda em actividade. Nidificação de tartarugas marinhas entre Junho e Outubro. Sem infraestruturas turísticas — um dos últimos refúgios selvagens próximos da capital. Recomenda-se vir com água e comida.',
  'Salinhas — Santiago',
  ST_GeomFromText('POINT(-23.51050 14.96200)', 4326),
  NULL,
  0, 4.3, 63, TRUE, TRUE,
  ARRAY['Selvagem','Tartarugas','Deserta','Salinas','Norte de Praia','Natureza']
)

ON CONFLICT (slug) DO UPDATE SET
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();


-- ════════════════════════════════════════════════════════════
-- 4. HISTÓRICO
-- ════════════════════════════════════════════════════════════
INSERT INTO places (name, slug, category_id, description, address, location, phone, price_level, rating, review_count, verified, active, tags)
VALUES

(
  'Pelourinho de Cidade Velha',
  'pelourinho-cidade-velha',
  (SELECT id FROM categories WHERE slug = 'historico'),
  'O pelourinho mais antigo ainda em pé no mundo lusófono fora de Portugal, construído no século XV. Símbolo do sistema colonial português e da resistência africana. Classificado como Património Mundial UNESCO em 2009 juntamente com toda a Cidade Velha (Ribeira Grande de Santiago).',
  'Rua Banana — Cidade Velha, Santiago',
  ST_GeomFromText('POINT(-23.60430 14.91490)', 4326),
  NULL,
  0, 4.7, 289, TRUE, TRUE,
  ARRAY['UNESCO','Pelourinho','Colonial','Séc. XV','Mais Antigo','Património Mundial','Cidade Velha']
),

(
  'Igreja Nossa Senhora do Rosário',
  'igreja-nossa-senhora-rosario',
  (SELECT id FROM categories WHERE slug = 'historico'),
  'A mais antiga igreja da África subsariana, construída em 1495 logo após a chegada dos portugueses à ilha de Santiago. Arquitectura românica-manuelina com campanário original. Interior com azulejos históricos e sepulturas de colonos portugueses do século XVI. Visita essencial em Cidade Velha.',
  'Cidade Velha (Ribeira Grande de Santiago) — Santiago',
  ST_GeomFromText('POINT(-23.60390 14.91520)', 4326),
  NULL,
  0, 4.8, 198, TRUE, TRUE,
  ARRAY['Igreja','1495','Mais Antiga África','Manuelino','UNESCO','Cidade Velha','Séc. XV']
),

(
  'Museu Etnográfico da Praia',
  'museu-etnografico-praia',
  (SELECT id FROM categories WHERE slug = 'historico'),
  'Principal museu de Cabo Verde, instalado num edifício colonial de 1873 no Plateau. Colecções permanentes de arqueologia, etnografia e arte cabo-verdiana — instrumentos musicais tradicionais, têxteis de pano de terra, ourivesaria e objectos do quotidiano. Também alberga exposições temporárias de artistas nacionais.',
  'Rua Andrade Corvo — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50680 14.92280)', 4326),
  '+238 261 17 10',
  1, 4.3, 156, TRUE, TRUE,
  ARRAY['Museu','Etnografia','Arte CV','Colonial','Plateau','Pano de Terra','Cultura']
),

(
  'Igreja Nossa Senhora da Graça',
  'igreja-nossa-senhora-graca',
  (SELECT id FROM categories WHERE slug = 'historico'),
  'A catedral de Praia, construída no século XIX no ponto mais alto do Plateau. Arquitectura neoclássica com fachada imponente e torre sineira visível de toda a cidade. Interior com azulejos azuis e brancos e retábulos barrocos. Centro espiritual e cultural da capital cabo-verdiana.',
  'Largo da Sé — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50590 14.92350)', 4326),
  NULL,
  0, 4.5, 124, TRUE, TRUE,
  ARRAY['Catedral','Séc. XIX','Neoclássico','Plateau','Religioso','Barroco','Vista Cidade']
),

(
  'Mercado de Sucupira',
  'mercado-sucupira',
  (SELECT id FROM categories WHERE slug = 'historico'),
  'O maior mercado informal de Cabo Verde, no coração de Praia. Centenas de bancas com produtos locais, tecidos, electrónica, artesanato e especiarias. O melhor lugar para comprar pano de terra (tecido tradicional), grogue artesanal e cestos de palha. Uma imersão total na vida quotidiana cabo-verdiana.',
  'Sucupira — Praia',
  ST_GeomFromText('POINT(-23.51420 14.91980)', 4326),
  NULL,
  1, 4.2, 234, TRUE, TRUE,
  ARRAY['Mercado','Artesanato','Pano de Terra','Grogue','Especiarias','Cultura','Imersão']
)

ON CONFLICT (slug) DO UPDATE SET
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();


-- ════════════════════════════════════════════════════════════
-- 5. MÚSICA AO VIVO
-- ════════════════════════════════════════════════════════════
INSERT INTO places (name, slug, category_id, description, address, location, phone, price_level, rating, review_count, verified, active, tags)
VALUES

(
  'Centro Cultural do Plateau',
  'centro-cultural-plateau',
  (SELECT id FROM categories WHERE slug = 'musica-ao-vivo'),
  'Principal espaço cultural de Praia, com programação regular de concertos de morna, funaná, coladeira e batuque. Auditório com capacidade para 300 pessoas, galeria de arte e espaço de ensaio. Sede de vários grupos musicais históricos de Cabo Verde e palco de lançamentos de álbuns.',
  'Rua Serpa Pinto — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50640 14.92290)', 4326),
  '+238 261 09 90',
  1, 4.4, 178, TRUE, TRUE,
  ARRAY['Concertos','Morna','Funaná','Batuque','Coladeira','Cultural','Auditório','Plateau']
),

(
  'Korda Kaoberdi',
  'korda-kaoberdi',
  (SELECT id FROM categories WHERE slug = 'musica-ao-vivo'),
  'Espaço cultural dedicado à música tradicional cabo-verdiana, fundado por artistas locais. Concertos semanais de morna e funaná num ambiente intimista. O nome significa "Acorda Cabo Verde" em crioulo — um manifesto cultural. Único em Praia pela autenticidade e proximidade com os artistas.',
  'Achada de Santo António — Praia',
  ST_GeomFromText('POINT(-23.50920 14.92850)', 4326),
  NULL,
  1, 4.6, 92, TRUE, TRUE,
  ARRAY['Morna','Funaná','Tradicional','Intimista','Autêntico','Crioulo','Cultural','ASA']
),

(
  'Festival Gamboa',
  'festival-gamboa',
  (SELECT id FROM categories WHERE slug = 'musica-ao-vivo'),
  'O maior festival de música de Cabo Verde, realizado anualmente em Maio na Praia da Gamboa. Três dias de concertos com os maiores nomes da música cabo-verdiana e convidados internacionais de língua portuguesa. Palco principal junto ao mar com capacidade para 15.000 pessoas. Uma celebração única da cultura crioula.',
  'Praia da Gamboa — Plateau, Praia',
  ST_GeomFromText('POINT(-23.50380 14.91920)', 4326),
  NULL,
  2, 4.8, 412, TRUE, TRUE,
  ARRAY['Festival','Anual','Maio','Gamboa','Internacional','Maior CV','Crioulo','15000 pessoas']
),

(
  'Palácio da Cultura Ildo Lobo',
  'palacio-cultura-ildo-lobo',
  (SELECT id FROM categories WHERE slug = 'musica-ao-vivo'),
  'O principal teatro nacional de Cabo Verde, com nome do icónico cantor Ildo Lobo. Palco de óperas, teatro, dança contemporânea e os maiores concertos de morna da capital. Arquitectura moderna com 600 lugares e acústica cuidada. Programação regular com artistas nacionais e internacionais.',
  'Achada de Santo António — Praia',
  ST_GeomFromText('POINT(-23.51060 14.92740)', 4326),
  '+238 262 28 00',
  2, 4.5, 203, TRUE, TRUE,
  ARRAY['Teatro Nacional','Ildo Lobo','Ópera','Morna','Dança','600 lugares','ASA','Nacional']
)

ON CONFLICT (slug) DO UPDATE SET
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();


-- ════════════════════════════════════════════════════════════
-- 6. RENT-A-CAR
-- ════════════════════════════════════════════════════════════
INSERT INTO places (name, slug, category_id, description, address, location, phone, price_level, rating, review_count, verified, active, tags)
VALUES

(
  'Hertz Cabo Verde',
  'hertz-cabo-verde',
  (SELECT id FROM categories WHERE slug = 'rent-a-car'),
  'Representante oficial da Hertz em Cabo Verde, com balcão no Aeroporto Internacional Nelson Mandela da Praia e escritório no Plateau. Frota de viaturas 4x4 e familiares, ideais para explorar Santiago. Reservas online disponíveis com entrega e recolha no aeroporto.',
  'Aeroporto Internacional Nelson Mandela — Praia',
  ST_GeomFromText('POINT(-23.49350 14.92450)', 4326),
  '+238 262 37 09',
  2, 3.9, 87, TRUE, TRUE,
  ARRAY['Hertz','Aeroporto','4x4','Internacional','Reservas Online','Entrega Aeroporto']
),

(
  'Avis Cabo Verde',
  'avis-cabo-verde',
  (SELECT id FROM categories WHERE slug = 'rent-a-car'),
  'Balcão Avis no Aeroporto de Praia com frota variada desde econômicos a SUVs. Cobertura de seguro completo disponível, serviço multilingue (PT/EN/FR) e possibilidade de deixar a viatura em pontos diferentes da ilha. Descontos para reservas antecipadas.',
  'Aeroporto Internacional Nelson Mandela — Praia',
  ST_GeomFromText('POINT(-23.49380 14.92440)', 4326),
  '+238 261 52 03',
  2, 4.0, 64, TRUE, TRUE,
  ARRAY['Avis','Aeroporto','SUV','Seguro Completo','Multilíngue','Reserva Antecipada']
),

(
  'Electra Car Aluguer',
  'electra-car-aluguer',
  (SELECT id FROM categories WHERE slug = 'rent-a-car'),
  'Empresa local de aluguer de viaturas com os preços mais competitivos de Santiago. Especialidade em 4x4 para percursos fora de estrada pelo interior da ilha — Serra da Malagueta, Rui Vaz e Assomada. Entrega gratuita no aeroporto e nos principais hotéis de Praia.',
  'Av. Cidade de Lisboa — Achada de Santo António, Praia',
  ST_GeomFromText('POINT(-23.51150 14.93100)', 4326),
  '+238 917 44 28',
  1, 4.2, 112, TRUE, TRUE,
  ARRAY['Local','Económico','4x4','Serra Malagueta','Off-road','Entrega Hotel','ASA']
)

ON CONFLICT (slug) DO UPDATE SET
  description   = EXCLUDED.description,
  address       = EXCLUDED.address,
  location      = EXCLUDED.location,
  phone         = EXCLUDED.phone,
  price_level   = EXCLUDED.price_level,
  rating        = EXCLUDED.rating,
  review_count  = EXCLUDED.review_count,
  verified      = EXCLUDED.verified,
  tags          = EXCLUDED.tags,
  updated_at    = NOW();
