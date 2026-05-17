/**
 * Insere os locais adicionais por categoria no Supabase.
 * Uso: tsx --env-file=.env src/scripts/seedExtras.ts
 */

import { supabaseAdmin } from "../config/supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface PlaceInput {
  name: string;
  slug: string;
  category: string;
  description: string;
  address: string;
  lng: number;
  lat: number;
  phone?: string;
  price_level: number;
  rating: number;
  review_count: number;
  tags: string[];
}

const places: PlaceInput[] = [
  // ── HOTÉIS ──────────────────────────────────────────────
  {
    name: "Hotel Praia Mar", slug: "hotel-praia-mar", category: "hoteis",
    description: "Hotel de referência em Praia, com vista directa para a Praia de Quebra Canela. Quartos amplos e modernos, piscina exterior, restaurante e bar. Localização privilegiada em Achada de Santo António, a poucos minutos do Plateau e das principais atracções da cidade.",
    address: "Av. Marginal — Achada de Santo António, Praia",
    lng: -23.51189, lat: 14.90516, phone: "+238 261 48 00",
    price_level: 3, rating: 4.2, review_count: 210,
    tags: ["Vista Mar","Piscina","Quebra Canela","Business","ASA"],
  },
  {
    name: "VIP Praia Hotel", slug: "vip-praia-hotel", category: "hoteis",
    description: "Hotel de charme em Achada de Santo António com design contemporâneo e serviço personalizado. Terraço panorâmico com vista sobre a baía de Praia, spa, piscina aquecida e restaurante internacional. Preferido por viajantes de negócios e turismo de qualidade.",
    address: "Av. OUA — Achada de Santo António, Praia",
    lng: -23.50984, lat: 14.93180, phone: "+238 260 31 00",
    price_level: 3, rating: 4.3, review_count: 178,
    tags: ["Spa","Piscina","Panorâmico","Business","ASA","Internacional"],
  },
  {
    name: "Oásis Atlântico Praiamar", slug: "oasis-atlantico-praiamar", category: "hoteis",
    description: "O maior hotel de Cabo Verde em número de quartos, situado no coração do Plateau. Infraestruturas completas: dois restaurantes, bares, piscina, ginásio e salões de eventos. Ponto de encontro da comunidade diplomática e empresarial da capital.",
    address: "Rua Serpa Pinto — Plateau, Praia",
    lng: -23.50760, lat: 14.92310, phone: "+238 261 37 00",
    price_level: 3, rating: 4.0, review_count: 342,
    tags: ["Plateau","Piscina","Eventos","Diplomático","Maior Hotel CV"],
  },
  {
    name: "Hotel Girassol", slug: "hotel-girassol", category: "hoteis",
    description: "Hotel de quatro estrelas em Achada de Santo António, um dos mais modernos de Praia. Quartos espaçosos com ar-condicionado e vista cidade, piscina no rooftop, restaurante cabo-verdiano e bar. Excelente relação qualidade-preço para estadas de negócio e lazer.",
    address: "Av. Cidade de Lisboa — Achada de Santo António, Praia",
    lng: -23.51020, lat: 14.93050, phone: "+238 261 60 00",
    price_level: 2, rating: 4.1, review_count: 156,
    tags: ["4 Estrelas","Rooftop","Piscina","ASA","Moderno","Negócios"],
  },
  {
    name: "Pensão Central", slug: "pensao-central", category: "hoteis",
    description: "A pensão mais antiga do Plateau, com décadas de história e ambiente genuinamente cabo-verdiano. Quartos simples mas confortáveis, pequeno-almoço incluído e localização imbatível no centro histórico de Praia. Ideal para viajantes independentes e mochileiros.",
    address: "Rua Serpa Pinto, 10 — Plateau, Praia",
    lng: -23.50720, lat: 14.92180, phone: "+238 261 15 34",
    price_level: 1, rating: 3.7, review_count: 89,
    tags: ["Económico","Plateau","Histórico","Mochileiros","Pequeno-Almoço"],
  },
  {
    name: "Residencial Sol Atlântico", slug: "residencial-sol-atlantico", category: "hoteis",
    description: "Residencial familiar com vista para o Atlântico, em zona residencial tranquila de Praia. Apartamentos com kitchenette, ideais para estadas longas. Ambiente caseiro, estacionamento gratuito e fácil acesso à Praia de Quebra Canela a pé.",
    address: "Rua Abílio Macedo — Achada de Santo António, Praia",
    lng: -23.51050, lat: 14.90780,
    price_level: 1, rating: 3.8, review_count: 62,
    tags: ["Familiar","Vista Mar","Apartamentos","Kitchenette","Longa Estada"],
  },

  // ── BARES ───────────────────────────────────────────────
  {
    name: "Enki Lounge Bar", slug: "enki-lounge-bar", category: "bares",
    description: "Bar lounge moderno no Plateau, referência da vida nocturna de Praia. Cocktails autorais com rum de Cabo Verde, tapas e ambiente descontraído com música ambiente. Esplanada exterior com vista para o Atlântico. Um dos poucos bares em Praia abertos até tarde.",
    address: "Rua Guerra Mendes — Plateau, Praia",
    lng: -23.50810, lat: 14.92250, phone: "+238 261 19 72",
    price_level: 2, rating: 4.2, review_count: 134,
    tags: ["Cocktails","Lounge","Noite","Plateau","Rum CV","Tapas"],
  },
  {
    name: "Café Royal", slug: "cafe-royal-praia", category: "bares",
    description: "Café e bar histórico do Plateau, ponto de encontro de intelectuais, artistas e políticos cabo-verdianos desde os anos 70. Ambiente descontraído com esplanada na Rua Pedonal, petiscos, café de altitude e cervejas frescas.",
    address: "Rua 5 de Julho (Rua Pedonal) — Plateau, Praia",
    lng: -23.50740, lat: 14.92160,
    price_level: 1, rating: 4.0, review_count: 98,
    tags: ["Histórico","Café","Cultural","Rua Pedonal","Plateau"],
  },
  {
    name: "Bar Esplanada da Gamboa", slug: "bar-esplanada-gamboa", category: "bares",
    description: "Bar de praia descontraído junto à Praia da Gamboa, com cadeiras de madeira e música de funaná ao fim de semana. Especialidade em ponche de cana, grog artesanal e petiscos de peixe fresco. O sítio preferido dos praenses para o fim de tarde.",
    address: "Praia da Gamboa — Plateau, Praia",
    lng: -23.50520, lat: 14.92050,
    price_level: 1, rating: 3.9, review_count: 72,
    tags: ["Praia Bar","Ponche","Grog","Funaná","Vista Porto","Gamboa"],
  },
  {
    name: "Skipper Bar", slug: "skipper-bar", category: "bares",
    description: "Bar náutico junto ao porto de Praia, muito frequentado por velejadores e tripulações em travessia do Atlântico. Ambiente internacional, boa selecção de cervejas importadas e cocktails. Wi-Fi rápido e informações sobre ancoragem.",
    address: "Porto da Praia — Praia",
    lng: -23.50490, lat: 14.91820,
    price_level: 2, rating: 3.8, review_count: 55,
    tags: ["Náutico","Porto","Velejadores","Internacional","Atlântico"],
  },
  {
    name: "Club Atlântico", slug: "club-atlantico", category: "bares",
    description: "Principal clube nocturno de Praia com capacidade para 500 pessoas. Música ao vivo ao fim de semana — funaná, zouk, kizomba e hits internacionais. Pista de dança, bar completo e esplanada exterior. A vida nocturna concentra-se aqui após a meia-noite.",
    address: "Av. Cidade de Lisboa — Achada de Santo António, Praia",
    lng: -23.51100, lat: 14.93020, phone: "+238 261 55 89",
    price_level: 2, rating: 4.1, review_count: 203,
    tags: ["Clube","Noite","Funaná","Zouk","Kizomba","Dança","ASA"],
  },

  // ── PRAIAS ──────────────────────────────────────────────
  {
    name: "Praia de São Francisco", slug: "praia-sao-francisco", category: "praias",
    description: "Praia extensa de areia fina a sul de Praia, com 2 km de extensão e água cristalina. Menos frequentada que Quebra Canela, ideal para quem procura tranquilidade. Ondas moderadas que atraem surfistas e bodyborders.",
    address: "São Francisco — Santiago",
    lng: -23.48750, lat: 14.87200,
    price_level: 1, rating: 4.5, review_count: 145,
    tags: ["Areia Fina","Surf","Tranquila","2km","Sul de Praia","Entrada Livre"],
  },
  {
    name: "Praia do Porto Mosquito", slug: "praia-porto-mosquito", category: "praias",
    description: "Pequena enseada com água turquesa e fundo arenoso, encaixada entre rochas vulcânicas. Uma das praias mais bonitas da zona sul de Santiago. Frequentada principalmente por locais. Excelente para snorkeling.",
    address: "Porto Mosquito — Santiago",
    lng: -23.47600, lat: 14.87950,
    price_level: 1, rating: 4.6, review_count: 98,
    tags: ["Snorkeling","Turquesa","Enseada","Selvagem","Sul Santiago","Entrada Livre"],
  },
  {
    name: "Praia do Xaguate", slug: "praia-do-xaguate", category: "praias",
    description: "Praia de areia escura (basáltica) junto à histórica Cidade Velha, Património Mundial UNESCO. A combinação da paisagem vulcânica, o forte no cimo do rochedo e a aldeia colonial fazem desta praia um dos cenários mais fotogénicos de Cabo Verde.",
    address: "Cidade Velha (Ribeira Grande de Santiago) — Santiago",
    lng: -23.60920, lat: 14.91250,
    price_level: 1, rating: 4.4, review_count: 112,
    tags: ["Areia Negra","UNESCO","Cidade Velha","Fotogénica","Mergulho","Entrada Livre"],
  },
  {
    name: "Praia da Gamboa", slug: "praia-da-gamboa", category: "praias",
    description: "Praia urbana no centro de Praia, junto ao porto e ao Plateau histórico. Pequena mas animada, com barcos de pesca coloridos e vendedores de fruta. Principal ponto de encontro dos praenses ao fim de tarde.",
    address: "Gamboa — Plateau, Praia",
    lng: -23.50350, lat: 14.91890,
    price_level: 1, rating: 3.8, review_count: 87,
    tags: ["Urbana","Barcos de Pesca","Plateau","Animada","Autêntica","Entrada Livre"],
  },
  {
    name: "Praia de Salinhas", slug: "praia-de-salinhas", category: "praias",
    description: "Extensa praia deserta a norte de Praia, rodeada de salinas tradicionais ainda em actividade. Nidificação de tartarugas marinhas entre Junho e Outubro. Sem infraestruturas turísticas — um dos últimos refúgios selvagens próximos da capital.",
    address: "Salinhas — Santiago",
    lng: -23.51050, lat: 14.96200,
    price_level: 1, rating: 4.3, review_count: 63,
    tags: ["Selvagem","Tartarugas","Deserta","Salinas","Natureza","Entrada Livre"],
  },

  // ── HISTÓRICO ───────────────────────────────────────────
  {
    name: "Pelourinho de Cidade Velha", slug: "pelourinho-cidade-velha", category: "historico",
    description: "O pelourinho mais antigo ainda em pé no mundo lusófono fora de Portugal, construído no século XV. Símbolo do sistema colonial português e da resistência africana. Classificado como Património Mundial UNESCO em 2009.",
    address: "Rua Banana — Cidade Velha, Santiago",
    lng: -23.60430, lat: 14.91490,
    price_level: 1, rating: 4.7, review_count: 289,
    tags: ["UNESCO","Pelourinho","Colonial","Séc. XV","Mais Antigo","Cidade Velha"],
  },
  {
    name: "Igreja Nossa Senhora do Rosário", slug: "igreja-nossa-senhora-rosario", category: "historico",
    description: "A mais antiga igreja da África subsariana, construída em 1495 logo após a chegada dos portugueses. Arquitectura românica-manuelina com campanário original. Interior com azulejos históricos e sepulturas de colonos do século XVI.",
    address: "Cidade Velha (Ribeira Grande de Santiago) — Santiago",
    lng: -23.60390, lat: 14.91520,
    price_level: 1, rating: 4.8, review_count: 198,
    tags: ["Igreja","1495","Mais Antiga África","Manuelino","UNESCO","Séc. XV"],
  },
  {
    name: "Museu Etnográfico da Praia", slug: "museu-etnografico-praia", category: "historico",
    description: "Principal museu de Cabo Verde, instalado num edifício colonial de 1873 no Plateau. Colecções permanentes de arqueologia, etnografia e arte cabo-verdiana — instrumentos musicais, têxteis de pano de terra, ourivesaria e objectos do quotidiano.",
    address: "Rua Andrade Corvo — Plateau, Praia",
    lng: -23.50680, lat: 14.92280, phone: "+238 261 17 10",
    price_level: 1, rating: 4.3, review_count: 156,
    tags: ["Museu","Etnografia","Arte CV","Colonial","Plateau","Pano de Terra"],
  },
  {
    name: "Igreja Nossa Senhora da Graça", slug: "igreja-nossa-senhora-graca", category: "historico",
    description: "A catedral de Praia, construída no século XIX no ponto mais alto do Plateau. Arquitectura neoclássica com fachada imponente e torre sineira visível de toda a cidade. Interior com azulejos azuis e brancos e retábulos barrocos.",
    address: "Largo da Sé — Plateau, Praia",
    lng: -23.50590, lat: 14.92350,
    price_level: 1, rating: 4.5, review_count: 124,
    tags: ["Catedral","Séc. XIX","Neoclássico","Plateau","Barroco"],
  },
  {
    name: "Mercado de Sucupira", slug: "mercado-sucupira", category: "historico",
    description: "O maior mercado informal de Cabo Verde, no coração de Praia. Centenas de bancas com produtos locais, tecidos, electrónica, artesanato e especiarias. O melhor lugar para comprar pano de terra, grogue artesanal e cestos de palha.",
    address: "Sucupira — Praia",
    lng: -23.51420, lat: 14.91980,
    price_level: 1, rating: 4.2, review_count: 234,
    tags: ["Mercado","Artesanato","Pano de Terra","Grogue","Especiarias","Cultura"],
  },

  // ── MÚSICA AO VIVO ──────────────────────────────────────
  {
    name: "Centro Cultural do Plateau", slug: "centro-cultural-plateau", category: "musica-ao-vivo",
    description: "Principal espaço cultural de Praia, com programação regular de concertos de morna, funaná, coladeira e batuque. Auditório com capacidade para 300 pessoas, galeria de arte e espaço de ensaio. Sede de vários grupos musicais históricos de Cabo Verde.",
    address: "Rua Serpa Pinto — Plateau, Praia",
    lng: -23.50640, lat: 14.92290, phone: "+238 261 09 90",
    price_level: 1, rating: 4.4, review_count: 178,
    tags: ["Concertos","Morna","Funaná","Batuque","Cultural","Auditório"],
  },
  {
    name: "Korda Kaoberdi", slug: "korda-kaoberdi", category: "musica-ao-vivo",
    description: "Espaço cultural dedicado à música tradicional cabo-verdiana, fundado por artistas locais. Concertos semanais de morna e funaná num ambiente intimista. O nome significa 'Acorda Cabo Verde' em crioulo — um manifesto cultural.",
    address: "Achada de Santo António — Praia",
    lng: -23.50920, lat: 14.92850,
    price_level: 1, rating: 4.6, review_count: 92,
    tags: ["Morna","Funaná","Tradicional","Intimista","Autêntico","Crioulo"],
  },
  {
    name: "Festival Gamboa", slug: "festival-gamboa", category: "musica-ao-vivo",
    description: "O maior festival de música de Cabo Verde, realizado anualmente em Maio na Praia da Gamboa. Três dias de concertos com os maiores nomes da música cabo-verdiana e convidados internacionais. Palco junto ao mar com capacidade para 15.000 pessoas.",
    address: "Praia da Gamboa — Plateau, Praia",
    lng: -23.50380, lat: 14.91920,
    price_level: 2, rating: 4.8, review_count: 412,
    tags: ["Festival","Anual","Maio","Gamboa","Internacional","15000 pessoas"],
  },
  {
    name: "Palácio da Cultura Ildo Lobo", slug: "palacio-cultura-ildo-lobo", category: "musica-ao-vivo",
    description: "O principal teatro nacional de Cabo Verde, com nome do icónico cantor Ildo Lobo. Palco de óperas, teatro, dança contemporânea e os maiores concertos de morna da capital. Arquitectura moderna com 600 lugares e acústica cuidada.",
    address: "Achada de Santo António — Praia",
    lng: -23.51060, lat: 14.92740, phone: "+238 262 28 00",
    price_level: 2, rating: 4.5, review_count: 203,
    tags: ["Teatro Nacional","Ildo Lobo","Ópera","Morna","Dança","600 lugares"],
  },

  // ── RENT-A-CAR ──────────────────────────────────────────
  {
    name: "Hertz Cabo Verde", slug: "hertz-cabo-verde", category: "rent-a-car",
    description: "Representante oficial da Hertz em Cabo Verde, com balcão no Aeroporto Internacional Nelson Mandela da Praia. Frota de viaturas 4x4 e familiares, ideais para explorar Santiago. Reservas online com entrega e recolha no aeroporto.",
    address: "Aeroporto Internacional Nelson Mandela — Praia",
    lng: -23.49350, lat: 14.92450, phone: "+238 262 37 09",
    price_level: 2, rating: 3.9, review_count: 87,
    tags: ["Hertz","Aeroporto","4x4","Internacional","Reservas Online"],
  },
  {
    name: "Avis Cabo Verde", slug: "avis-cabo-verde", category: "rent-a-car",
    description: "Balcão Avis no Aeroporto de Praia com frota variada desde económicos a SUVs. Cobertura de seguro completo, serviço multilingue (PT/EN/FR) e possibilidade de deixar a viatura em pontos diferentes da ilha.",
    address: "Aeroporto Internacional Nelson Mandela — Praia",
    lng: -23.49380, lat: 14.92440, phone: "+238 261 52 03",
    price_level: 2, rating: 4.0, review_count: 64,
    tags: ["Avis","Aeroporto","SUV","Seguro Completo","Multilíngue"],
  },
  {
    name: "Electra Car Aluguer", slug: "electra-car-aluguer", category: "rent-a-car",
    description: "Empresa local de aluguer de viaturas com os preços mais competitivos de Santiago. Especialidade em 4x4 para percursos fora de estrada pelo interior da ilha — Serra da Malagueta, Rui Vaz e Assomada. Entrega gratuita no aeroporto e nos principais hotéis.",
    address: "Av. Cidade de Lisboa — Achada de Santo António, Praia",
    lng: -23.51150, lat: 14.93100, phone: "+238 917 44 28",
    price_level: 1, rating: 4.2, review_count: 112,
    tags: ["Local","Económico","4x4","Serra Malagueta","Off-road","Entrega Hotel"],
  },
];

async function main() {
  console.log(`\n🌍 A inserir ${places.length} locais em ${new Set(places.map(p => p.category)).size} categorias…\n`);

  // Carregar IDs das categorias
  const { data: cats } = await supabaseAdmin.from("categories").select("id, slug");
  const catMap = Object.fromEntries(cats!.map((c: any) => [c.slug, c.id]));

  let inserted = 0, updated = 0, failed = 0;

  for (const place of places) {
    const catId = catMap[place.category];
    if (!catId) {
      console.warn(`  ⚠  Categoria "${place.category}" não encontrada — a saltar ${place.name}`);
      failed++;
      continue;
    }

    const row: Record<string, unknown> = {
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
    };
    if (place.phone) row.phone = place.phone;

    // Upsert por slug
    const { data: existing } = await supabaseAdmin
      .from("places")
      .select("id")
      .eq("slug", place.slug)
      .single();

    if (existing) {
      const { error } = await supabaseAdmin
        .from("places")
        .update(row)
        .eq("id", existing.id);
      if (error) { console.error(`  ✗ ${place.name}: ${error.message}`); failed++; }
      else { console.log(`  ↺ ${place.name} (${place.category}) — actualizado`); updated++; }
    } else {
      const { error } = await supabaseAdmin.from("places").insert(row);
      if (error) { console.error(`  ✗ ${place.name}: ${error.message}`); failed++; }
      else { console.log(`  ✓ ${place.name} (${place.category}) — inserido`); inserted++; }
    }

    await sleep(50);
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ ${inserted} inseridos | ↺ ${updated} actualizados | ✗ ${failed} erros`);
}

main().catch((err) => { console.error("❌ Erro fatal:", err); process.exit(1); });
