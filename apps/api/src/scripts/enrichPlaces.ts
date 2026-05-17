/**
 * Enriquecimento Google Places (legacy API)
 *
 * Uso:
 *   pnpm --filter @santiagu/api enrich                        # restaurantes
 *   pnpm --filter @santiagu/api enrich -- --category=praias  # categoria específica
 *   pnpm --filter @santiagu/api enrich -- --all              # todas as categorias
 *   pnpm --filter @santiagu/api enrich:force -- --all        # força re-enriquecimento
 */

import { supabaseAdmin } from "../config/supabase";
import { searchGooglePlace, resolvePhotoUrl } from "../services/googlePlaces";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const DELAY_MS = 300; // ~200 req/min — dentro do limite free-tier

const args = process.argv.slice(2);
const categoryArg =
  args.find((a) => a.startsWith("--category="))?.split("=")[1] ?? "restaurantes";
const force = args.includes("--force");
const allCategories = args.includes("--all");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function hasGoogleCover(placeId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("photos")
    .select("url")
    .eq("place_id", placeId)
    .eq("is_cover", true)
    .single();
  const url = data?.url ?? "";
  return url.includes("lh3.googleusercontent.com") || url.includes("maps.googleapis.com");
}

async function enrichPlace(place: { id: string; name: string; address: string }) {
  if (!force && (await hasGoogleCover(place.id))) {
    console.log(`  ↳ ${place.name} — já enriquecido, a saltar`);
    return { skipped: true };
  }

  process.stdout.write(`  ↳ ${place.name} — a pesquisar…`);

  const gp = await searchGooglePlace(place.name, place.address, API_KEY);
  if (!gp) {
    console.log(" ⚠  não encontrado no Google Places");
    return { found: false };
  }

  const { lat, lng } = gp.location;
  console.log(
    `\n     ✓ ${gp.name} | GPS ${lat.toFixed(5)}, ${lng.toFixed(5)}` +
    (gp.phone ? ` | ${gp.phone}` : "") +
    ` | ${gp.photoRefs.length} fotos`
  );

  // ── GPS + phone ────────────────────────────────────────────────────
  const locPayload: Record<string, unknown> = {
    location: `SRID=4326;POINT(${lng} ${lat})`,
  };
  if (gp.phone) locPayload.phone = gp.phone;

  // Tenta gravar também google_place_id se a coluna existir (migration opcional)
  const { error: updErr } = await supabaseAdmin
    .from("places")
    .update({ ...locPayload, google_place_id: gp.id })
    .eq("id", place.id);

  if (updErr?.message?.includes("google_place_id")) {
    await supabaseAdmin.from("places").update(locPayload).eq("id", place.id);
  } else if (updErr) {
    console.warn(`     ⚠  Erro GPS: ${updErr.message}`);
  }

  // ── Fotos ──────────────────────────────────────────────────────────
  if (!gp.photoRefs.length) {
    console.log("     ⚠  sem fotos disponíveis");
    return { found: true, photo: false };
  }

  // Cover
  process.stdout.write("     📸 a resolver cover… ");
  const coverUrl = await resolvePhotoUrl(gp.photoRefs[0], API_KEY);
  if (!coverUrl) {
    console.log("falhou");
    return { found: true, photo: false };
  }
  console.log("ok");

  await supabaseAdmin
    .from("photos")
    .update({ is_cover: false })
    .eq("place_id", place.id)
    .eq("is_cover", true);

  const coverRow = { place_id: place.id, url: coverUrl, is_cover: true, sort_order: 0 };
  const { error: covErr } = await supabaseAdmin
    .from("photos")
    .insert({ ...coverRow, source: "google_places" });
  if (covErr?.message?.includes("source")) {
    await supabaseAdmin.from("photos").insert(coverRow);
  } else if (covErr) {
    console.warn(`     ⚠  Erro cover: ${covErr.message}`);
  }

  // Fotos extra (até 4)
  const extras = gp.photoRefs.slice(1, 5);
  for (let i = 0; i < extras.length; i++) {
    await sleep(DELAY_MS);
    const url = await resolvePhotoUrl(extras[i], API_KEY);
    if (!url) continue;
    const row = { place_id: place.id, url, is_cover: false, sort_order: i + 1 };
    const { error: xErr } = await supabaseAdmin
      .from("photos")
      .insert({ ...row, source: "google_places" });
    if (xErr?.message?.includes("source")) {
      await supabaseAdmin.from("photos").insert(row);
    }
  }

  console.log(`     ✓ ${1 + extras.length} foto(s) gravadas`);
  return { found: true, photo: true };
}

async function enrichCategory(categorySlug: string): Promise<{ enriched: number; skipped: number; failed: number }> {
  const { data: cat } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!cat) {
    console.error(`❌  Categoria "${categorySlug}" não encontrada`);
    return { enriched: 0, skipped: 0, failed: 0 };
  }

  const { data: places, error } = await supabaseAdmin
    .from("places")
    .select("id, name, address")
    .eq("category_id", cat.id)
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("❌  Erro a ler locais:", error.message);
    return { enriched: 0, skipped: 0, failed: 0 };
  }

  console.log(`📍 ${places?.length ?? 0} locais encontrados\n`);

  let enriched = 0, skipped = 0, failed = 0;

  for (const place of places ?? []) {
    const result = await enrichPlace(place as any);
    if (result.skipped) skipped++;
    else if (result.found && result.photo) enriched++;
    else failed++;
    await sleep(DELAY_MS);
  }

  return { enriched, skipped, failed };
}

async function main() {
  if (!API_KEY) {
    console.error("❌  GOOGLE_PLACES_API_KEY não definida no .env");
    process.exit(1);
  }

  const mode = force ? "FORCE (todos)" : "incremental (salta enriquecidos)";

  if (allCategories) {
    console.log(`\n🗺  Enriquecimento Google Places — TODAS AS CATEGORIAS`);
    console.log(`   Mode: ${mode}\n`);

    const { data: cats, error } = await supabaseAdmin
      .from("categories")
      .select("slug")
      .order("slug");

    if (error || !cats?.length) {
      console.error("❌  Erro a ler categorias:", error?.message ?? "nenhuma encontrada");
      process.exit(1);
    }

    console.log(`📂 ${cats.length} categorias encontradas: ${cats.map((c) => c.slug).join(", ")}\n`);

    let totalEnriched = 0, totalSkipped = 0, totalFailed = 0;

    for (const cat of cats) {
      const line = "─".repeat(50);
      console.log(`\n${line}`);
      console.log(`📂 Categoria: ${cat.slug}`);
      console.log(line);

      const { enriched, skipped, failed } = await enrichCategory(cat.slug);
      totalEnriched += enriched;
      totalSkipped += skipped;
      totalFailed += failed;

      console.log(`   Categoria "${cat.slug}": ${enriched} enriquecidos | ${skipped} saltados | ${failed} sem dados`);
    }

    const line = "═".repeat(50);
    console.log(`\n${line}`);
    console.log(`✅ TOTAL — ${totalEnriched} enriquecidos | ${totalSkipped} saltados | ${totalFailed} sem dados`);
    console.log(line);

  } else {
    console.log(`\n🗺  Enriquecimento Google Places — categoria: ${categoryArg}`);
    console.log(`   Mode: ${mode}\n`);

    const { enriched, skipped, failed } = await enrichCategory(categoryArg);

    const line = "─".repeat(50);
    console.log(`\n${line}`);
    console.log(`✅ Concluído — ${enriched} enriquecidos | ${skipped} saltados | ${failed} sem dados`);
  }
}

main().catch((err) => {
  console.error("❌  Erro fatal:", err);
  process.exit(1);
});
