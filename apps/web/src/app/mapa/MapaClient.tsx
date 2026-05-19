"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MapView } from "@/components/map/MapView";
import { CATEGORIES } from "@/lib/types";
import type { Place, CategorySlug } from "@/lib/types";

interface MapaClientProps {
  places: Place[];
}

export function MapaClient({ places }: MapaClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategorySlug | null>(null);
  const [selected, setSelected] = useState<Place | null>(null);

  const filtered = activeCategory
    ? places.filter((p) => p.category_slug === activeCategory)
    : places;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-ocean/8 bg-white z-10">
        <Link href="/" className="p-1.5 rounded-xl hover:bg-sand-light transition-colors">
          <ArrowLeft className="w-5 h-5 text-ocean-dark" />
        </Link>
        <span className="font-display font-bold text-ocean-dark text-lg flex-1">
          Mapa de Santiago
        </span>
        <span className="text-sm font-body text-muted">{filtered.length} locais</span>
      </header>

      {/* Category filter */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none border-b border-ocean/8 bg-white">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-colors ${
            activeCategory === null
              ? "bg-ocean-dark text-white"
              : "bg-sand-light text-ocean-dark hover:bg-sand"
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() =>
              setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
            }
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-colors ${
              activeCategory === cat.slug
                ? "text-white"
                : "bg-sand-light text-ocean-dark hover:bg-sand"
            }`}
            style={
              activeCategory === cat.slug
                ? { backgroundColor: cat.color }
                : undefined
            }
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView places={filtered} onPlaceSelect={setSelected} />
      </div>

      {/* Selected place card */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-4 z-20 bg-white rounded-2xl shadow-card-hover p-4 flex gap-3 items-center">
          <img
            src={selected.cover_url}
            alt={selected.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-ocean-dark text-sm truncate">{selected.name}</p>
            <p className="text-xs text-muted truncate">{selected.address}</p>
            <p className="text-xs text-terra font-semibold mt-0.5">
              ⭐ {selected.rating} · {selected.review_count} avaliações
            </p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <Link
              href={`/place/${selected.slug}`}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Ver
            </Link>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-muted hover:text-ocean-dark transition-colors text-center"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
