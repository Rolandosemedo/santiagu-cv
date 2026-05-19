import { MapClient } from "./MapClient";
import { fetchPlaces } from "@/lib/api";
export const dynamic = "force-dynamic";
export default async function MapaPage() {
  const { data: places } = await fetchPlaces({ limit: 200 });
  return <MapClient places={places} />;
}
