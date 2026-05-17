"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Map, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import { MapView } from "@/components/map/MapView";
import { Navbar } from "@/components/ui/Navbar";
import { PlaceCard } from "@/components/places/PlaceCard";
import { CategoryFilter } from "@/components/places/CategoryFilter";
import { RatingSlider } from "@/components/places/RatingSlider";
import type { CategorySlug, Place } from "@/lib/types";

type ViewMode = "grid" | "map";

export function ExplorarClient({ initialPlaces }: { initialPlaces: Place[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<CategorySlug | null>(
    (searchParams.get("category") as CategorySlug | null) ?? null
  );
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get("tag"));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function handleCategoryChange(slug: CategorySlug | null) {
    setCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.replace(`/explorar?${params.toString()}`);
  }

  function clearTag() {
    setActiveTag(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.replace(`/explorar?${params.toString()}`);
  }

  const filtered = useMemo(() => {
    return initialPlaces.filter((p) => {
      if (category && p.category_slug !== category) return false;
      if (minRating && p.rating < minRating) return false;
      if (activeTag && !p.tags?.some((t) => t === activeTag)) return false;
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
  }, [query, category, minRating, activeTag, initialPlaces]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Header ─────────────────────────────────────── */}
      <div className="border-b border-ocean/8 bg-white sticky top-16 z-40 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search + controls */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" aria-hidden="true" />
              <label className="sr-only" htmlFor="explorar-search">Pesquisar locais</label>
              <input
                id="explorar-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar locais em Santiago…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-ocean/15 bg-ocean-dark/3
                           text-sm font-body focus:outline-none focus:border-ocean/40 transition-all"
              />
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              aria-pressed={filtersOpen}
              aria-label="Filtros avançados"
              className={`p-2.5 rounded-full border transition-all ${
                filtersOpen || minRating > 0
                  ? "bg-ocean text-white border-ocean"
                  : "border-ocean/15 text-muted hover:border-ocean/40 hover:text-ocean-dark"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* View toggle */}
            <div className="flex bg-ocean/5 rounded-full p-1 gap-1" role="group" aria-label="Vista">
              <button
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                aria-label="Vista em grelha"
                className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-ocean" : "text-muted hover:text-ocean-dark"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                aria-pressed={viewMode === "map"}
                aria-label="Vista em mapa"
                className={`p-2 rounded-full transition-all ${viewMode === "map" ? "bg-white shadow-sm text-ocean" : "text-muted hover:text-ocean-dark"}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category filter */}
          <CategoryFilter selected={category} onChange={handleCategoryChange} />

          {/* Active tag badge */}
          {activeTag && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-muted">Tag:</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-body bg-ocean text-white px-3 py-1 rounded-full">
                {activeTag}
                <button onClick={clearTag} aria-label="Remover filtro de tag" className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Advanced filters panel */}
          {filtersOpen && (
            <div className="border-t border-ocean/8 pt-3">
              <p className="text-xs font-body font-medium text-muted mb-2">
                Avaliação mínima
              </p>
              <RatingSlider value={minRating} onChange={setMinRating} />
            </div>
          )}
        </div>
      </div>

      {/* ── Results ────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-body text-muted">
            <span className="font-display font-bold text-ocean-dark">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "local encontrado" : "locais encontrados"}
            {category && " nesta categoria"}
            {activeTag && ` com a tag "${activeTag}"`}
          </p>
        </div>

        {viewMode === "grid" ? (
          filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((place, i) => (
                <div
                  key={place.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s`, opacity: 0 }}
                >
                  <PlaceCard place={place} variant="grid" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-ocean-dark text-lg mb-2">Nenhum resultado</h3>
              <p className="font-body text-muted text-sm">Tenta ajustar os filtros ou a pesquisa.</p>
            </div>
          )
        ) : (
          <div className="h-[600px] rounded-3xl overflow-hidden shadow-card border border-ocean/8">
            <MapView places={filtered} />
          </div>
        )}
      </main>
    </div>
  );
}
