import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import type { Place } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: Place;
  variant?: "grid" | "list" | "compact";
  className?: string;
}

const PRICE_LABEL: Record<number, string> = {
  1: "€",
  2: "€€",
  3: "€€€",
  4: "€€€€",
};

const CATEGORY_FALLBACK: Record<string, string> = {
  restaurantes: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  praias: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  hoteis: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  bares: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800",
  "musica-ao-vivo": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  historico: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800",
  natureza: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
  compras: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
};

const DEFAULT_COVER = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800";

function getCover(place: Place): string {
  if (place.cover_url) return place.cover_url;
  return CATEGORY_FALLBACK[place.category_slug] ?? DEFAULT_COVER;
}

export function PlaceCard({ place, variant = "grid", className }: PlaceCardProps) {
  const category = CATEGORIES.find((c) => c.slug === place.category_slug);
  const cover = getCover(place);

  if (variant === "compact") {
    return (
      <Link href={`/place/${place.slug}`}>
        <div className={cn("flex gap-3 p-3 rounded-2xl hover:bg-ocean/3 transition-all", className)}>
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <Image src={cover} alt={place.name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm">{category?.emoji}</span>
              <span className="text-xs text-muted font-body">{category?.label}</span>
            </div>
            <h3 className="font-display font-semibold text-sm text-ocean-dark truncate">{place.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-sand text-sand" />
              <span className="text-xs font-body font-medium text-ocean-dark">{place.rating}</span>
              <span className="text-xs text-muted font-body">({place.review_count})</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link href={`/place/${place.slug}`}>
        <div className={cn("card flex gap-4 p-4", className)}>
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
            <Image src={cover} alt={place.name} fill className="object-cover" sizes="96px" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="category-pill"
                style={{
                  backgroundColor: `${category?.color}15`,
                  borderColor: `${category?.color}30`,
                  color: category?.color,
                }}
              >
                {category?.emoji} {category?.label}
              </span>
              {place.verified && <BadgeCheck className="w-4 h-4 text-verde" />}
            </div>
            <h3 className="font-display font-bold text-base text-ocean-dark truncate mb-1">{place.name}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-sand text-sand" />
                <span className="text-sm font-display font-semibold text-ocean-dark">{place.rating}</span>
                <span className="text-xs text-muted font-body">({place.review_count})</span>
              </div>
              <div className="flex items-center gap-1 text-muted">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-body truncate">{place.address}</span>
              </div>
              {place.price_level && (
                <span className="text-xs font-body text-muted ml-auto">{PRICE_LABEL[place.price_level]}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default: grid
  return (
    <Link href={`/place/${place.slug}`} className="group">
      <div className={cn("card", className)}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={cover}
            alt={place.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/40 via-transparent to-transparent" />

          <span
            className="absolute top-3 left-3 category-pill text-white backdrop-blur-sm"
            style={{ backgroundColor: `${category?.color}CC`, borderColor: "transparent" }}
          >
            {category?.emoji} {category?.label}
          </span>

          {place.verified && (
            <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <BadgeCheck className="w-4 h-4 text-verde" />
            </span>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-sand text-sand" />
            <span className="text-xs font-display font-bold text-ocean-dark">{place.rating}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display font-bold text-ocean-dark text-base mb-1 truncate group-hover:text-ocean transition-colors">
            {place.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-body truncate max-w-[140px]">{place.address}</span>
            </div>
            {place.price_level && (
              <span className="text-xs font-body font-medium text-muted">{PRICE_LABEL[place.price_level]}</span>
            )}
          </div>

          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {place.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs font-body bg-sand-light text-ocean-dark px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
