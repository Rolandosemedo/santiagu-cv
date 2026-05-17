/**
 * Actualiza o campo website dos locais no Supabase.
 * Uso: pnpm --filter @santiagu/api add:websites
 */

import { supabaseAdmin } from "../config/supabase";

const websites: Array<{ slug: string; website: string; note: string }> = [
  // Websites oficiais
  { slug: "beramar-grill",    website: "https://projetos.prime.cv/beramar/",       note: "site oficial" },
  { slug: "nice-kriola",      website: "https://nicesgroup.cv/nice-kriola/",        note: "site oficial" },

  // Páginas sociais oficiais (sem website próprio)
  { slug: "quintal-da-musica", website: "https://www.facebook.com/quintaldamusica/", note: "Facebook oficial" },
  { slug: "kaza-katxupa",      website: "https://www.instagram.com/kazakatxupa/",    note: "Instagram oficial" },
  { slug: "linha-dagua",       website: "https://www.facebook.com/linhadaguacv/",    note: "Facebook oficial" },
  { slug: "alkimist-praia",    website: "https://www.instagram.com/alkimist.p/",     note: "Instagram oficial" },
  { slug: "kebra-cabana",      website: "https://www.instagram.com/kebracabana/",    note: "Instagram oficial" },
  { slug: "seven-beach-club",  website: "https://www.instagram.com/sevenbeachclub_cv/", note: "Instagram oficial" },
];

async function main() {
  console.log(`\n🔗 A actualizar websites de ${websites.length} locais…\n`);

  let ok = 0, failed = 0;

  for (const { slug, website, note } of websites) {
    const { data: place } = await supabaseAdmin
      .from("places")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (!place) {
      console.warn(`  ⚠  "${slug}" não encontrado`);
      failed++;
      continue;
    }

    const { error } = await supabaseAdmin
      .from("places")
      .update({ website })
      .eq("id", place.id);

    if (error) {
      console.error(`  ✗ ${place.name}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓ ${place.name.padEnd(30)} ${note}`);
      ok++;
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ ${ok} actualizados | ✗ ${failed} erros`);
}

main().catch((err) => { console.error("❌ Erro fatal:", err); process.exit(1); });
