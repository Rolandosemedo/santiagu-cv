export const dynamic = "force-dynamic";

import { MapaClient } from "./MapaClient";
import { fetchPlaces } from "@/lib/api";

export default async function MapaPage() {
  const { data: places } = await fetchPlaces({ limit: 100 });
  return <MapaClient places={places} />;
}
