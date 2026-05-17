/**
 * Insere / actualiza 23 bares e locais de música ao vivo de Santiago.
 * • Places já em bares: upsert silencioso (sem mudanças)
 * • Places em restaurantes: mover para bares
 * • Places novos: inserir
 *
 * Uso: pnpm --filter @santiagu/api seed:bares2
 */

import { supabaseAdmin } from "../config/supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface PlaceInput {
  name: string;
  slug: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  price_level: number;
  rating: number;
  review_count: number;
  tags: string[];
}

const places: PlaceInput[] = [

  // ── PRAIA – Rua Pedonal (Rua 5 de Julho) ────────────────────────────

  {
    name: "Quintal da Música",
    slug: "quintal-da-musica",
    description:
      "O espaço mais emblemático da vida nocturna cultural de Praia, no fim da Rua Pedonal no Plateau. Música ao vivo todas as noites — morna, coladeira e funaná interpretados pelos melhores músicos cabo-verdianos. Esplanada ao ar livre, caipirinhas de grogue e uma atmosfera que é puro Cabo Verde.",
    address: "Rua 5 de Julho (Rua Pedonal) — Plateau, Praia",
    lat: 14.9214, lng: -23.5071,
    phone: "+238 992 99 41",
    price_level: 2, rating: 4.7, review_count: 521,
    tags: ["Música ao Vivo", "Morna", "Funaná", "Coladeira", "Esplanada", "Plateau", "Ícone Cultural"],
  },
  {
    name: "Fogo d'África",
    slug: "fogo-dafrica",
    description:
      "Bar noturno muito popular entre os praenses, com música ao vivo que raramente para antes das 4h da manhã. Ambiente de bairro autêntico, ritmos africanos, funaná e zouk. Um dos segredos mais bem guardados da Rua Pedonal — onde os locais ficam depois de todos os outros fecharem.",
    address: "Rua 5 de Julho — Plateau, Praia",
    lat: 14.9208, lng: -23.5069,
    price_level: 1, rating: 4.2, review_count: 134,
    tags: ["Música ao Vivo", "Noite", "Funaná", "Zouk", "Local", "Plateau", "Até de Madrugada"],
  },
  {
    name: "Bar Bistrô 90",
    slug: "bistro-90",
    description:
      "Bar e restaurante com esplanada na animada Rua Pedonal do Plateau. Cocktails artesanais, petiscos cabo-verdianos e música ao vivo ao fim de semana num ambiente descontraído e acessível. Ponto de encontro do Plateau a qualquer hora do dia.",
    address: "Rua 5 de Julho (Rua Pedonal) — Plateau, Praia",
    lat: 14.9213, lng: -23.5067,
    phone: "+238 938 70 13",
    price_level: 2, rating: 4.2, review_count: 186,
    tags: ["Música ao Vivo", "Esplanada", "Cocktails", "Petiscos", "Plateau", "Rua Pedonal"],
  },

  // ── PRAIA – Quebra Canela / Prainha ──────────────────────────────────

  {
    name: "Alkimist",
    slug: "alkimist-praia",
    description:
      "Bar esplanada descontraído na Avenida Jorge Barbosa, junto à Praia de Quebra Canela. Pizzas artesanais, cocktails de autor e música ao vivo aos fins de semana. Aberto até às 2h — 4h ao fim de semana.",
    address: "Av. Jorge Barbosa / Quebra Canela — Praia",
    lat: 14.9033, lng: -23.5178,
    phone: "+238 356 26 67",
    price_level: 2, rating: 4.3, review_count: 148,
    tags: ["Música ao Vivo", "Esplanada", "Pizzas", "Cocktails", "Vista Mar", "Noite", "Quebra Canela"],
  },
  {
    name: "Seven Beach Club",
    slug: "seven-beach-club",
    description:
      "Beach club de referência em Praia com vistas deslumbrantes para o Atlântico. Música ao vivo, DJ sets, cocktails tropicais e carta de mariscos frescos. Funciona de dia como clube de praia e à noite transforma-se num dos pontos mais animados da capital.",
    address: "Av. Jorge Barbosa — Quebra Canela, Praia",
    lat: 14.9029, lng: -23.5181,
    price_level: 2, rating: 4.4, review_count: 212,
    tags: ["Música ao Vivo", "Beach Club", "Mariscos", "Cocktails", "Vista Oceano", "DJ", "Quebra Canela"],
  },
  {
    name: "Kebra Cabana",
    slug: "kebra-cabana",
    description:
      "Bar esplanada icónico de Quebra Canela com mais de 40 mil seguidores nas redes sociais. DJ sets e música ao vivo todas as semanas, festas temáticas, catering e organização de eventos privados. Um dos mais animados pontos de encontro da vida nocturna de Praia.",
    address: "Quebra Canela — Praia",
    lat: 14.9038, lng: -23.5172,
    price_level: 2, rating: 4.5, review_count: 389,
    tags: ["Música ao Vivo", "DJ Sets", "Esplanada", "Festas Temáticas", "Eventos", "Noite", "Quebra Canela"],
  },
  {
    name: "Linha d'Água",
    slug: "linha-dagua",
    description:
      "Bar e restaurante beira-mar na Prainha, com esplanada sobre as rochas e vistas para o Atlântico. Cocktails tropicais, peixe grelhado do dia e música ao vivo ao fim de semana. Um dos poucos sítios em Praia onde se come com os pés quase na água.",
    address: "Prainha — Praia",
    lat: 14.9036, lng: -23.5152,
    phone: "+238 938 70 09",
    price_level: 2, rating: 4.4, review_count: 167,
    tags: ["Música ao Vivo", "Vista Mar", "Beira-Mar", "Cocktails", "Peixe Grelhado", "Esplanada", "Prainha"],
  },
  {
    name: "Mambo Beach Club",
    slug: "mambo-beach-club",
    description:
      "Beach club tropical com ambiente festivo junto à orla de Praia. Música ao vivo durante o dia e DJ sets à noite, com espreguiçadeiras e cocktails coloridos. Especialidade em caipirinha de grogue e petiscos de marisco.",
    address: "Quebra Canela — Praia",
    lat: 14.9025, lng: -23.5185,
    phone: "+238 594 40 91",
    price_level: 2, rating: 4.2, review_count: 167,
    tags: ["Música ao Vivo", "Beach Club", "Tropical", "DJ Sets", "Cocktails", "Mariscos", "Vista Mar"],
  },

  // ── PRAIA – Outros bairros ───────────────────────────────────────────

  {
    name: "Zero Hours Nightclub",
    slug: "zero-hours-nightclub",
    description:
      "A discoteca mais popular de Praia, com pista de dança para 600 pessoas e som de alta fidelidade. Noites temáticas com kizomba, funaná, kuduro e música internacional. Aberta de quinta a domingo a partir da meia-noite.",
    address: "Achada de Santo António — Praia",
    lat: 14.9183, lng: -23.4993,
    price_level: 2, rating: 4.2, review_count: 315,
    tags: ["Música ao Vivo", "Discoteca", "Kizomba", "Funaná", "Kuduro", "Noite", "Dança"],
  },
  {
    name: "XPTO Nightclub",
    slug: "xpto-nightclub",
    description:
      "Discoteca beachfront com pista de dança aberta para o oceano e ambiente cosmopolita. DJs residentes e convidados internacionais, noites temáticas e eventos especiais. Um dos poucos clubes em Cabo Verde com terraço sobre a praia.",
    address: "Praia",
    lat: 14.9028, lng: -23.5163,
    price_level: 2, rating: 4.0, review_count: 198,
    tags: ["Discoteca", "Beachfront", "DJ Internacional", "Noite", "Terraço", "Vista Oceano"],
  },
  {
    name: "Bomba'H",
    slug: "bombah-praia",
    description:
      "Discoteca muito popular especialmente durante o verão, com noites de zouk, funaná e hip-hop local cabo-verdiano. Ambiente festivo e descontraído, com entrada acessível e pista sempre cheia ao fim de semana. Um dos favoritos da juventude praense.",
    address: "Praia",
    lat: 14.9155, lng: -23.5087,
    price_level: 1, rating: 4.1, review_count: 247,
    tags: ["Discoteca", "Zouk", "Funaná", "Hip-Hop", "Noite", "Jovens", "Verão"],
  },
  {
    name: "Underground",
    slug: "underground-praia",
    description:
      "Bar noturno com identidade alternativa e música ao vivo de bandas locais e internacionais. Rock, reggae, hip-hop e experimentação num ambiente sem pretensões. O refúgio dos noctívagos mais eclécticos da capital.",
    address: "Praia",
    lat: 14.9089, lng: -23.5289,
    price_level: 1, rating: 4.0, review_count: 73,
    tags: ["Música ao Vivo", "Alternativo", "Rock", "Reggae", "Noite", "Bandas Locais", "Ecléctico"],
  },
  {
    name: "Café Sofia",
    slug: "cafe-sofia-praia",
    description:
      "Café bar com alma cultural no Plateau. Programação regular de música ao vivo — morna, funaná e jazz —, exposições e tertúlias literárias. Ambiente acolhedor durante o dia e animado à noite.",
    address: "Plateau — Praia",
    lat: 14.9197, lng: -23.5075,
    price_level: 1, rating: 4.1, review_count: 97,
    tags: ["Música ao Vivo", "Cultural", "Morna", "Jazz", "Arte", "Café", "Plateau"],
  },
  {
    name: "Space Kriola",
    slug: "space-kriola",
    description:
      "Clube dedicado ao zouk, kizomba e aos ritmos cabo-verdianos mais contemporâneos. Noites temáticas com artistas locais, concursos de dança e DJ sets até de manhã. O espaço favorito dos amantes de zouk em Santiago.",
    address: "Praia",
    lat: 14.9168, lng: -23.5102,
    price_level: 2, rating: 4.1, review_count: 156,
    tags: ["Zouk", "Kizomba", "Cabo-verdiano", "Discoteca", "Dança", "DJ Sets", "Noite"],
  },
  {
    name: "Nice Kriola",
    slug: "nice-kriola",
    description:
      "Esplanada panorâmica em Cruz do Papa, Achada de Santo António, com vista privilegiada sobre a Praia de Quebra Canela e o Atlântico. Música ao vivo ao fim de semana, cocktails e petiscos cabo-verdianos num ambiente sofisticado e descontraído.",
    address: "Cruz do Papa — Achada de Santo António, Praia",
    lat: 14.9045, lng: -23.5187,
    phone: "+238 262 08 70",
    price_level: 2, rating: 4.3, review_count: 189,
    tags: ["Música ao Vivo", "Esplanada Panorâmica", "Vista Quebra Canela", "Cocktails", "Vista Mar", "ASA"],
  },

  // ── ASSOMADA ─────────────────────────────────────────────────────────

  {
    name: "Karga Club",
    slug: "karga-club",
    description:
      "Considerado por muitos o melhor nightclub da ilha de Santiago, situado em Assomada, capital do interior. Pista de dança enorme, som potente, noites de funaná, kizomba e zouk que atraem jovens de toda a ilha. Vale a viagem desde Praia.",
    address: "Assomada — Santa Catarina, Santiago",
    lat: 15.0978, lng: -23.6690,
    price_level: 2, rating: 4.6, review_count: 312,
    tags: ["Discoteca", "Funaná", "Kizomba", "Zouk", "Noite", "Assomada", "Melhor da Ilha"],
  },

  // ── TARRAFAL ─────────────────────────────────────────────────────────

  {
    name: "Kabungo Beach Bar",
    slug: "kabungo-beach-bar",
    description:
      "Bar de praia descontraído directamente na areia da Praia do Tarrafal. Espreguiçadeiras, guarda-sóis, drinks frescos e músicas ambiente. O lugar perfeito para passar uma tarde preguiçosa com vista para as águas turquesas do Tarrafal.",
    address: "Praia do Tarrafal — Tarrafal, Santiago",
    lat: 15.2792, lng: -23.7535,
    price_level: 1, rating: 4.3, review_count: 112,
    tags: ["Beach Bar", "Praia", "Espreguiçadeiras", "Drinks", "Tranquilo", "Tarrafal", "Vista Mar"],
  },
  {
    name: "Bar Tarrafal Vibes",
    slug: "bar-tarrafal-vibes",
    description:
      "Bar local com alma genuinamente cabo-verdiana em Tarrafal. Música ao vivo aos fins de semana com músicos da região, grogue artesanal, ponche de cana e convívio entre locais e visitantes. Cultura pura do norte de Santiago.",
    address: "Tarrafal — Santiago",
    lat: 15.2785, lng: -23.7528,
    price_level: 1, rating: 4.2, review_count: 78,
    tags: ["Música ao Vivo", "Local", "Grogue", "Ponche", "Cultural", "Tarrafal", "Fins de Semana"],
  },
  {
    name: "Santiago Lounge Bar",
    slug: "santiago-lounge-bar",
    description:
      "Lounge bar e restaurante em Tarrafal com ambiente sofisticado e vista para o Atlântico. Cocktails criativos, carta de vinhos do Fogo e petiscos internacionais. Ideal para um jantar tranquilo antes de explorar a vida nocturna de Tarrafal.",
    address: "Tarrafal — Santiago",
    lat: 15.2780, lng: -23.7524,
    price_level: 2, rating: 4.2, review_count: 89,
    tags: ["Lounge", "Cocktails", "Vista Mar", "Restaurante", "Vinho do Fogo", "Tarrafal", "Sofisticado"],
  },
  {
    name: "Genesis Beach Bar",
    slug: "genesis-beach-bar",
    description:
      "Bar de praia com ambiente tropical e vistas deslumbrantes para o oceano em Tarrafal. Smoothies de frutas tropicais, cocktails, cervejas frescas e música ambiente. Um oásis de relaxamento na praia mais bonita de Santiago.",
    address: "Tarrafal — Santiago",
    lat: 15.2788, lng: -23.7541,
    price_level: 1, rating: 4.3, review_count: 95,
    tags: ["Beach Bar", "Tropical", "Smoothies", "Vista Oceano", "Relaxamento", "Tarrafal", "Praia"],
  },
  {
    name: "Divecenter Bar",
    slug: "divecenter-tarrafal",
    description:
      "Bar junto ao centro de mergulho de Tarrafal, com vistas deslumbrantes para a costa e convívio entre mergulhadores e viajantes. Cervejas, cocktails e histórias de mergulho à beira-mar. O ponto de encontro da comunidade de mergulho de Santiago.",
    address: "Tarrafal — Santiago",
    lat: 15.2775, lng: -23.7520,
    price_level: 1, rating: 4.1, review_count: 63,
    tags: ["Mergulho", "Costa", "Vista Mar", "Tarrafal", "Beach Bar", "Viajantes", "Comunidade"],
  },

  // ── CIDADE VELHA ─────────────────────────────────────────────────────

  {
    name: "Old City Bar",
    slug: "old-city-bar",
    description:
      "Bar à beira-mar em Cidade Velha, junto às ruínas históricas Património Mundial UNESCO. Peixe fresco do dia grelhado na hora, ponche de cana e ambiente colonial autêntico. Um dos lugares mais únicos para tomar um drink em toda a ilha de Santiago.",
    address: "Cidade Velha (Ribeira Grande de Santiago) — Santiago",
    lat: 14.9152, lng: -23.6048,
    price_level: 1, rating: 4.4, review_count: 87,
    tags: ["Beira-Mar", "Peixe Fresco", "UNESCO", "Ponche", "Histórico", "Cidade Velha", "Autêntico"],
  },
];

async function main() {
  console.log(`\n🎶 A processar ${places.length} bares e locais de música ao vivo…\n`);

  const { data: cats } = await supabaseAdmin.from("categories").select("id, slug");
  const catMap = Object.fromEntries((cats ?? []).map((c: any) => [c.slug, c.id]));
  const baresId = catMap["bares"];

  if (!baresId) {
    console.error("❌ Categoria 'bares' não encontrada");
    process.exit(1);
  }

  let inserted = 0, moved = 0, updated = 0, failed = 0;

  for (const place of places) {
    const row: Record<string, unknown> = {
      name:         place.name,
      slug:         place.slug,
      category_id:  baresId,
      description:  place.description,
      address:      place.address,
      location:     `SRID=4326;POINT(${place.lng} ${place.lat})`,
      price_level:  place.price_level,
      rating:       place.rating,
      review_count: place.review_count,
      verified:     true,
      active:       true,
      tags:         place.tags,
      ...(place.phone ? { phone: place.phone } : {}),
    };

    const { data: existing } = await supabaseAdmin
      .from("places")
      .select("id, category_id")
      .eq("slug", place.slug)
      .single();

    if (existing) {
      const wasInOtherCat = existing.category_id !== baresId;
      const { error } = await supabaseAdmin.from("places").update(row).eq("id", existing.id);
      if (error) {
        console.error(`  ✗ ${place.name}: ${error.message}`);
        failed++;
      } else if (wasInOtherCat) {
        console.log(`  ↪ ${place.name} — movido para bares`);
        moved++;
      } else {
        console.log(`  ↺ ${place.name} — já em bares, actualizado`);
        updated++;
      }
    } else {
      const { error } = await supabaseAdmin.from("places").insert(row);
      if (error) {
        console.error(`  ✗ ${place.name}: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✓ ${place.name} — inserido`);
        inserted++;
      }
    }

    await sleep(50);
  }

  const line = "─".repeat(50);
  console.log(`\n${line}`);
  console.log(`✅ ${inserted} inseridos | ↪ ${moved} movidos para bares | ↺ ${updated} actualizados | ✗ ${failed} erros`);
  console.log(`\nCorre agora: pnpm --filter @santiagu/api enrich -- --category=bares --force`);
}

main().catch((err) => { console.error("❌ Erro fatal:", err); process.exit(1); });
