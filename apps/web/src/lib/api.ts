import type { PlacesFilters, PlacesResponse, Place } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Mock data for development ───────────────────────────
export const MOCK_PLACES: Place[] = [
  {
    id: "1",
    name: "Restaurante Quintal da Música",
    category_slug: "restaurantes",
    description: "Gastronomia cabo-verdiana autêntica com música ao vivo ao fim de semana.",
    address: "Plateau, Praia",
    lat: 14.9315,
    lng: -23.5133,
    rating: 4.8,
    review_count: 124,
    cover_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    phone: "+238 261 2345",
    verified: true,
    price_level: 2,
    tags: ["Cachupa", "Música ao Vivo", "Esplanada"],
  },
  {
    id: "2",
    name: "Praia de Tarrafal",
    category_slug: "praias",
    description: "A praia mais famosa de Santiago — águas cristalinas e areia branca.",
    address: "Tarrafal, Santiago",
    lat: 15.2775,
    lng: -23.7524,
    rating: 4.9,
    review_count: 342,
    cover_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    verified: true,
    tags: ["Snorkeling", "Mergulho", "Bar de Praia"],
  },
  {
    id: "3",
    name: "Cidade Velha",
    category_slug: "historico",
    description: "Primeiro assentamento europeu nos Trópicos. Património Mundial UNESCO desde 2009.",
    address: "Cidade Velha, Santiago",
    lat: 14.9139,
    lng: -23.6044,
    rating: 4.7,
    review_count: 289,
    cover_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800",
    verified: true,
    tags: ["UNESCO", "História", "Pelourinho"],
  },
  {
    id: "4",
    name: "Hotel Trópico",
    category_slug: "hoteis",
    description: "Hotel de referência em Praia com piscina e vista para o oceano.",
    address: "Fazenda, Praia",
    lat: 14.9254,
    lng: -23.5173,
    rating: 4.2,
    review_count: 87,
    cover_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    phone: "+238 261 4200",
    verified: true,
    price_level: 3,
    tags: ["Piscina", "WiFi", "Restaurante"],
  },
  {
    id: "5",
    name: "Bar Café Mindelo",
    category_slug: "bares",
    description: "Cocktails tropicais e ambiente descontraído no coração de Praia.",
    address: "Plateau, Praia",
    lat: 14.9325,
    lng: -23.5121,
    rating: 4.5,
    review_count: 63,
    cover_url: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800",
    verified: false,
    price_level: 2,
    tags: ["Cocktails", "Esplanada", "DJ Noturno"],
  },
  {
    id: "6",
    name: "Festival de Batuque",
    category_slug: "musica-ao-vivo",
    description: "O maior festival de música tradicional de Santiago. Não perca.",
    address: "Assomada, Santa Catarina",
    lat: 15.0964,
    lng: -23.6832,
    rating: 4.9,
    review_count: 201,
    cover_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    verified: true,
    tags: ["Batuque", "Funaná", "Morna"],
  },
];

// ─── API functions ────────────────────────────────────────
export async function fetchPlaces(
  filters: PlacesFilters = {}
): Promise<PlacesResponse> {
  // Usar mock data apenas quando a API não está configurada
  if (!process.env.NEXT_PUBLIC_API_URL) {
    let data = [...MOCK_PLACES];

    if (filters.category) {
      data = data.filter((p) => p.category_slug === filters.category);
    }

    if (filters.q) {
      const q = filters.q.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.rating) {
      data = data.filter((p) => p.rating >= filters.rating!);
    }

    return { data, total: data.length, page: 1, limit: 20 };
  }

  // API configurada: chamar sempre, dev ou produção
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v));
  });

  try {
    const res = await fetch(`${API_URL}/api/places?${params}`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (_) {}
  return { data: MOCK_PLACES, total: MOCK_PLACES.length, page: 1, limit: 20 };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function fetchPlace(idOrSlug: string): Promise<Place> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const place = MOCK_PLACES.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!place) throw new Error("Place not found");
    return place;
  }

  const url = UUID_RE.test(idOrSlug)
    ? `${API_URL}/api/places/${idOrSlug}`
    : `${API_URL}/api/places/slug/${idOrSlug}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.ok) return res.json();
  } catch (_) {}
  const place = MOCK_PLACES.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!place) throw new Error("Place not found");
  return place;
}
