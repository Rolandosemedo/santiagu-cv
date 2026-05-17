/**
 * Insere os 8 bares com música ao vivo na categoria "bares".
 * Uso: pnpm --filter @santiagu/api seed:bares-musica
 */

import { supabaseAdmin } from "../config/supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const places = [
  {
    name: "Alkimist",
    slug: "alkimist-praia",
    description:
      "Bar esplanada descontraído na Avenida Jorge Barbosa, junto à Praia de Quebra Canela. Conhecido pelas pizzas artesanais, cocktails de autor e música ao vivo aos fins de semana. Ambiente jovem e cosmopolita, com vista para o oceano e brisa atlântica. Aberto até às 2h — 4h ao fim de semana.",
    address: "Av. Jorge Barbosa / Quebra Canela — Praia",
    lat: 14.9033, lng: -23.5178,
    phone: "+238 356 26 67",
    price_level: 2,
    rating: 4.3, review_count: 148,
    tags: ["Música ao Vivo", "Esplanada", "Pizzas", "Cocktails", "Vista Mar", "Noite", "Quebra Canela"],
  },
  {
    name: "Seven Beach Club",
    slug: "seven-beach-club",
    description:
      "Beach club de referência em Praia, na Avenida Jorge Barbosa com vistas deslumbrantes para o Atlântico. Música ao vivo, DJ sets, cocktails tropicais e carta de mariscos frescos. Funciona de dia como clube de praia e à noite transforma-se num dos pontos mais animados da capital.",
    address: "Av. Jorge Barbosa — Quebra Canela, Praia",
    lat: 14.9029, lng: -23.5181,
    price_level: 2,
    rating: 4.4, review_count: 212,
    tags: ["Música ao Vivo", "Beach Club", "Mariscos", "Cocktails", "Vista Oceano", "DJ", "Quebra Canela"],
  },
  {
    name: "Kebra Cabana",
    slug: "kebra-cabana",
    description:
      "Bar esplanada icónico de Quebra Canela com mais de 40 mil seguidores nas redes sociais. DJ sets e música ao vivo todas as semanas, festas temáticas, catering e organização de eventos privados. Um dos mais animados pontos de encontro da vida nocturna de Praia, com ambiente à beira-mar.",
    address: "Quebra Canela — Praia",
    lat: 14.9038, lng: -23.5172,
    price_level: 2,
    rating: 4.5, review_count: 389,
    tags: ["Música ao Vivo", "DJ Sets", "Esplanada", "Festas Temáticas", "Eventos", "Noite", "Quebra Canela"],
  },
  {
    name: "Café Sofia",
    slug: "cafe-sofia-praia",
    description:
      "Café bar com alma cultural no coração de Praia. Programação regular de música ao vivo — morna, funaná e jazz —, exposições de arte e tertúlias literárias. Ambiente acolhedor durante o dia e animado à noite, com cervejas nacionais, vinhos do Fogo e petiscos cabo-verdianos.",
    address: "Plateau — Praia",
    lat: 14.9197, lng: -23.5075,
    price_level: 1,
    rating: 4.1, review_count: 97,
    tags: ["Música ao Vivo", "Cultural", "Morna", "Jazz", "Arte", "Café", "Plateau"],
  },
  {
    name: "Underground",
    slug: "underground-praia",
    description:
      "Bar noturno com identidade alternativa e contracorrente no panorama de Praia. Música ao vivo de bandas locais e internacionais, rock, reggae, hip-hop e experimentação. Décor industrial, cocktails acessíveis e ambiente sem pretensões — o refúgio dos noctívagos mais eclécticos da capital.",
    address: "Praia",
    lat: 14.9145, lng: -23.5095,
    price_level: 1,
    rating: 4.0, review_count: 73,
    tags: ["Música ao Vivo", "Alternativo", "Rock", "Reggae", "Noite", "Bandas Locais", "Ecléctico"],
  },
  {
    name: "Zero Hours Nightclub",
    slug: "zero-hours-nightclub",
    description:
      "A discoteca mais popular de Praia, com pista de dança para 600 pessoas e som de alta fidelidade. Noites temáticas com kizomba, funaná, kuduro e música internacional. Aberta de quinta a domingo a partir da meia-noite — o destino obrigatório da vida nocturna de Santiago.",
    address: "Achada de Santo António — Praia",
    lat: 14.9185, lng: -23.5110,
    price_level: 2,
    rating: 4.2, review_count: 315,
    tags: ["Música ao Vivo", "Discoteca", "Kizomba", "Funaná", "Kuduro", "Noite", "Dança"],
  },
  {
    name: "Bar José da Rosa",
    slug: "bar-jose-da-rosa",
    description:
      "Taberna marítima histórica na Rua 5 de Julho, com décadas de história na vida nocturna do Plateau. Música ao vivo de músicos locais, vinho do Fogo da Cooperativa do Fogo, grogue artesanal e petiscos de peixe seco. O sítio onde os praenses mais velhos se juntam para cantar morna.",
    address: "Rua 5 de Julho — Plateau, Praia",
    lat: 14.9218, lng: -23.5068,
    price_level: 1,
    rating: 4.3, review_count: 86,
    tags: ["Música ao Vivo", "Morna", "Taberna", "Grogue", "Vinho do Fogo", "Histórico", "Plateau"],
  },
  {
    name: "Mambo Beach Club",
    slug: "mambo-beach-club",
    description:
      "Beach club tropical com ambiente festivo junto à orla de Praia. Música ao vivo durante o dia e DJ sets à noite, com palm trees, espreguiçadeiras e cocktails coloridos. Especialidade em caipirinha de grogue e petiscos de marisco. O sítio certo para uma tarde descontraída com vista para o Atlântico.",
    address: "Quebra Canela — Praia",
    lat: 14.9025, lng: -23.5185,
    price_level: 2,
    rating: 4.2, review_count: 167,
    tags: ["Música ao Vivo", "Beach Club", "Tropical", "DJ Sets", "Cocktails", "Mariscos", "Vista Mar"],
  },
];

async function main() {
  console.log(`\n🎶 A inserir ${places.length} bares com música ao vivo…\n`);

  const { data: cats } = await supabaseAdmin.from("categories").select("id, slug");
  const catId = cats?.find((c: any) => c.slug === "bares")?.id;

  if (!catId) {
    console.error("❌ Categoria 'bares' não encontrada");
    process.exit(1);
  }

  let inserted = 0, updated = 0, failed = 0;

  for (const place of places) {
    const row = {
      name:         place.name,
      slug:         place.slug,
      category_id:  catId,
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
      .select("id")
      .eq("slug", place.slug)
      .single();

    if (existing) {
      const { error } = await supabaseAdmin.from("places").update(row).eq("id", existing.id);
      if (error) { console.error(`  ✗ ${place.name}: ${error.message}`); failed++; }
      else { console.log(`  ↺ ${place.name} — actualizado`); updated++; }
    } else {
      const { error } = await supabaseAdmin.from("places").insert(row);
      if (error) { console.error(`  ✗ ${place.name}: ${error.message}`); failed++; }
      else { console.log(`  ✓ ${place.name} — inserido`); inserted++; }
    }

    await sleep(50);
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ ${inserted} inseridos | ↺ ${updated} actualizados | ✗ ${failed} erros`);
}

main().catch((err) => { console.error("❌ Erro fatal:", err); process.exit(1); });
