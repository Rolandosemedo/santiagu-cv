// ─── Category config ─────────────────────────────────────
export const CATEGORIES = [
  { slug: "restaurantes",  label: "Restaurantes",  emoji: "🍽️", color: "#C4622D", image: "/categories/restaurantes.png" },
  { slug: "bares",         label: "Bares",          emoji: "🍹", color: "#1A8FBF", image: "/categories/bares.png" },
  { slug: "musica-ao-vivo",label: "Música ao Vivo", emoji: "🎶", color: "#7C3AED", image: "/categories/musica-ao-vivo.png" },
  { slug: "praias",        label: "Praias",         emoji: "🏖️", color: "#0B5E8A", image: "/categories/praias.png" },
  { slug: "historico",     label: "Histórico",      emoji: "🏛️", color: "#92400E", image: "/categories/historico.png" },
  { slug: "hoteis",        label: "Hotéis",         emoji: "🏨", color: "#1D9E75", image: "/categories/hoteis.png" },
  { slug: "rent-a-car",    label: "Rent-a-Car",     emoji: "🚗", color: "#374151", image: "/categories/rent-a-car.png" },
  { slug: "eventos",       label: "Eventos",        emoji: "🎉", color: "#DB2777", image: "/categories/eventos.png" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

// ─── Place types ─────────────────────────────────────────
export interface Place {
  id: string;
  slug: string;
  name: string;
  category_slug: CategorySlug;
  description: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  review_count: number;
  cover_url: string;
  phone?: string;
  website?: string;
  verified: boolean;
  price_level?: 1 | 2 | 3 | 4; // 1=€ … 4=€€€€
  opening_hours?: Record<string, string>;
  tags?: string[];
  events?: Event[];
}

export interface Event {
  id: string;
  place_id: string;
  title: string;
  starts_at: string;
  price_cve: number;
  capacity: number;
  type: "concerto" | "festival" | "exposicao" | "outro";
}

// ─── API response shapes ──────────────────────────────────
export interface PlacesResponse {
  data: Place[];
  total: number;
  page: number;
  limit: number;
}

export interface PlacesFilters {
  category?: CategorySlug;
  lat?: number;
  lng?: number;
  radius?: number; // km
  rating?: number;
  q?: string;
  page?: number;
  limit?: number;
}
