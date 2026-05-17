// Usa a Places API (legacy) — maps.googleapis.com/maps/api/place
// A "Places API (New)" (places.googleapis.com) requer activação separada.

const BASE = "https://maps.googleapis.com/maps/api/place";

export interface GooglePlaceResult {
  id: string;              // place_id
  name: string;
  address: string;
  location: { lat: number; lng: number };
  phone?: string;
  photoRefs: string[];     // photo_reference strings para usar na photo endpoint
}

interface TextSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  photos?: Array<{ photo_reference: string }>;
}

interface DetailsResult {
  formatted_phone_number?: string;
  international_phone_number?: string;
  photos?: Array<{ photo_reference: string }>;
}

export async function searchGooglePlace(
  name: string,
  address: string,
  apiKey: string
): Promise<GooglePlaceResult | null> {
  const query = encodeURIComponent(`${name} ${address} Cabo Verde`);
  const url =
    `${BASE}/textsearch/json?query=${query}` +
    `&key=${apiKey}` +
    `&language=pt` +
    `&location=14.93,-23.51` +   // centro de Santiago
    `&radius=80000`;              // 80 km — cobre toda a ilha

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places textsearch ${res.status}`);

  const data = await res.json() as { status: string; results: TextSearchResult[] };

  if (data.status !== "OK" || !data.results.length) {
    return null;
  }

  const place = data.results[0];

  // Detalhes para telefone e fotos extra
  const details = await fetchPlaceDetails(place.place_id, apiKey);

  const photoRefs = [
    ...(place.photos?.map((p) => p.photo_reference) ?? []),
    ...(details?.photos?.map((p) => p.photo_reference) ?? []),
  ]
    .filter(Boolean)
    .filter((ref, i, arr) => arr.indexOf(ref) === i) // dedup
    .slice(0, 5);

  return {
    id: place.place_id,
    name: place.name,
    address: place.formatted_address,
    location: place.geometry.location,
    phone:
      details?.international_phone_number ??
      details?.formatted_phone_number,
    photoRefs,
  };
}

async function fetchPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<DetailsResult | null> {
  const url =
    `${BASE}/details/json?place_id=${placeId}` +
    `&fields=international_phone_number,formatted_phone_number,photos` +
    `&key=${apiKey}` +
    `&language=pt`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json() as { status: string; result: DetailsResult };
  return data.status === "OK" ? data.result : null;
}

// Resolve photo_reference → URL permanente lh3.googleusercontent.com
// A endpoint faz redirect 302 para a CDN da Google; seguimos o redirect.
export async function resolvePhotoUrl(
  photoRef: string,
  apiKey: string,
  maxWidth = 800
): Promise<string | null> {
  const url =
    `${BASE}/photo?photoreference=${photoRef}` +
    `&maxwidth=${maxWidth}` +
    `&key=${apiKey}`;

  try {
    // redirect: 'manual' dá-nos o header Location com o URL real
    const res = await fetch(url, { redirect: "manual" });
    const location = res.headers.get("location");
    if (location) return location;

    // Fallback: se seguir o redirect automaticamente, devolve o URL final
    if (res.ok) return url; // última opção — inclui a key, mas funciona
    return null;
  } catch {
    return null;
  }
}
