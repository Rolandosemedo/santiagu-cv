"use client";

import { CATEGORIES, type CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected?: CategorySlug | null;
  onChange: (slug: CategorySlug | null) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
      {/* All */}
      <button
        onClick={() => onChange(null)}
        className={cn(
          "category-pill whitespace-nowrap shrink-0",
          !selected
            ? "bg-ocean text-white border-ocean"
            : "bg-white text-ocean-dark/70 border-ocean/20 hover:border-ocean/40"
        )}
      >
        🌍 Tudo
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => onChange(isActive ? null : cat.slug)}
            className="category-pill whitespace-nowrap shrink-0"
            style={
              isActive
                ? {
                    backgroundColor: cat.color,
                    borderColor: cat.color,
                    color: "white",
                  }
                : {
                    backgroundColor: `${cat.color}10`,
                    borderColor: `${cat.color}30`,
                    color: cat.color,
                  }
            }
          >
            {cat.emoji} {cat.label}
          </button>
        );
      })}
    </div>
  );
}
