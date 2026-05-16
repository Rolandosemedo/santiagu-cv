"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Map, LayoutGrid } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { PlaceCard } from "@/components/places/PlaceCard";
import { CategoryFilter } from "@/components/places/CategoryFilter";
import { MOCK_PLACES } from "@/lib/api";
import type { CategorySlug } from "@/lib/types";

type ViewMode = "grid" | "map";

export default function ExplorarPage() {
    const searchParams = useSearchParams()
    const router = useRouter();

  const [query, setQuery] = useState("");
    const [category, setCategory] = useState<CategorySlug | null>(
          (searchParams.get("category") as CategorySlug) ?? null
        );
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [minRating, setMinRating] = useState(0);

  // Sync category state with URL param
  useEffect(() => {
        const cat = searchParams.get("category") as CategorySlug | null;
        setCategory(cat);
  }, [searchParams]);

  // Update URL when category changes
  function handleCategoryChange(slug: CategorySlug | null) {
        setCategory(slug);
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
                params.set("category", slug);
        } else {
                params.delete("category");
        }
        router.replace(`/explorar?${params.toString()}`);
  }

  const filtered = useMemo(() => {
        return MOCK_PLACES.filter((p) => {
                if (category && p.category_slug !== category) return false;
                if (minRating && p.rating < minRating) return false;
                if (query) {
                          const q = query.toLowerCase();
                          return (
                                      p.name.toLowerCase().includes(q) ||
                                      p.description.toLowerCase().includes(q) ||
                                      p.tags?.some((t) => t.toLowerCase().includes(q))
                                    );
                }
                return true;
        });
  }, [query, category, minRating]);

  return (
        <div className="min-h-screen bg-white">
              <Navbar />
        
            {/* Header */}
              <div className="border-b border-ocean/8 bg-white sticky top-16 z-40 px-4 sm:px-6 py-4">
                      <div className="max-w-7xl mx-auto space-y-3">
                        {/* Search + controls */}
                                <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                                          <input
                                                                            type="text"
                                                                            value={query}
                                                                            onChange={(e) => setQuery(e.target.value)}
                                                                            placeholder="Pesquisar locais em Santiago…"
                                                                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-ocean/15 bg-ocean-dark/3
                                                              text-sm font-body focus:outline-none focus:border-ocean/40 transition-all"
                                                                          />
                                            </div>div>
                                
                                  {/* View toggle */}
                                            <div className="flex bg-ocean/5 rounded-full p-1 gap-1">
                                                          <button
                                                                            onClick={() => setViewMode("grid")}
                                                                            className={`p-2 rounded-full transition-all ${
                                                                                                viewMode === "grid" ? "bg-white shadow-sm text-ocean" : "text-muted hover:text-ocean-dark"
                                                                            }`}
                                                                            title="Grelha"
                                                                          >
                                                                          <LayoutGrid className="w-4 h-4" />
                                                          </button>button>
                                                          <button
                                                                            onClick={() => setViewMode("map")}
                                                                            className={`p-2 rounded-full transition-all ${
                                                                                                viewMode === "map" ? "bg-white shadow-sm text-ocean" : "text-muted hover:text-ocean-dark"
                                                                            }`}
                                                                            title="Mapa"
                                                                          >
                                                                          <Map className="w-4 h-4" />
                                                          </button>button>
                                            </div>div>
                                </div>div>
                      
                        {/* Category filter */}
                                <CategoryFilter selected={category} onChange={handleCategoryChange} />
                      </div>div>
              </div>div>
        
          {/* ── Results ────────────────────────────────────── */}
              <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Count */}
                      <div className="flex items-center justify-between mb-6">
                                <p className="text-sm font-body text-muted">
                                            <span className="font-display font-bold text-ocean-dark">{filtered.length}</span>span>{" "}
                                  {filtered.length === 1 ? "local encontrado" : "locais encontrados"}
                                  {category && " nesta categoria"}
                                </p>p>
                      </div>div>
              
                {viewMode === "grid" ? (
                    filtered.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filtered.map((place, i) => (
                                                    <div
                                                                        key={place.id}
                                                                        className="animate-fade-up"
                                                                        style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s` }}
                                                                      >
                                                                      <PlaceCard place={place} variant="grid" />
                                                    </div>div>
                                                  ))}
                                  </div>div>
                                ) : (
                                  <div className="text-center py-24">
                                                <div className="text-5xl mb-4">🔍</div>div>
                                                <h3 className="font-display font-bold text-ocean-dark text-lg mb-2">Nenhum resultado</h3>h3>
                                                <p className="font-body text-muted text-sm">Tenta ajustar os filtros ou a pesquisa.</p>p>
                                  </div>div>
                                )
                  ) : (
                    <div className="h-[600px] rounded-3xl overflow-hidden shadow-card border border-ocean/8">
                                <div className="w-full h-full bg-sand-light flex items-center justify-center">
                                              <div className="text-center">
                                                              <div className="text-4xl mb-3">🗺️</div>div>
                                                              <p className="font-body text-sm text-muted">
                                                                                Configura{" "}
                                                                                <code className="font-mono text-xs bg-ocean/10 px-1.5 py-0.5 rounded">
                                                                                                    NEXT_PUBLIC_MAPBOX_TOKEN
                                                                                </code>code>{" "}
                                                                                para ativar o mapa.
                                                              </p>p>
                                              </div>div>
                                </div>div>
                    </div>div>
                      )}
              </main>main>
        </div>div>
      );
}
</div>
