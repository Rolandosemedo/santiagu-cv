/**
 * Adiciona cover photos do Unsplash a locais sem cover Google Places.
 * Uso: pnpm --filter @santiagu/api unsplash:covers
 */

import { supabaseAdmin } from "../config/supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


const targets: Array<{ slug: string; url: string }> = [
  {
    slug: "bar-esplanada-gamboa",
    url: "https://images.unsplash.com/photo-1633463588700-522334f75779?w=800&q=80",
  },
  {
    slug: "santiago-lounge-bar",
    url: "https://images.unsplash.com/photo-1621275471769-e6aa344546d5?w=800&q=80",
  },
  {
    slug: "underground-praia",
    url: "https://images.unsplash.com/photo-1708573061065-0194ddf8b20b?w=800&q=80",
  },
];

async function main() {
  console.log("\n🖼  A adicionar covers Unsplash…\n");

  for (const { slug, url } of targets) {
    const { data: place } = await supabaseAdmin
      .from("places")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (!place) {
      console.warn(`  ⚠  Slug "${slug}" não encontrado`);
      continue;
    }

    process.stdout.write(`  ↳ ${place.name}… `);

    await supabaseAdmin
      .from("photos")
      .update({ is_cover: false })
      .eq("place_id", place.id)
      .eq("is_cover", true);

    const row = { place_id: place.id, url, is_cover: true, sort_order: 0 };
    const { error } = await supabaseAdmin
      .from("photos")
      .insert({ ...row, source: "unsplash" });

    if (error?.message?.includes("source")) {
      await supabaseAdmin.from("photos").insert(row);
    } else if (error) {
      console.log(`⚠  ${error.message}`);
      continue;
    }

    console.log("✓");
    await sleep(100);
  }

  console.log("\n✅ Concluído");
}

main().catch((err) => { console.error("❌ Erro fatal:", err); process.exit(1); });
