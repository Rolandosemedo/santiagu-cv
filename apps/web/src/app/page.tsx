export const dynamic = "force-dynamic";

import { HomeClient } from "@/components/HomeClient";
import { fetchPlaces } from "@/lib/api";

export default async function HomePage() {
  const { data: places } = await fetchPlaces({ limit: 6 });
  const topPlaces = places.sort((a, b) => b.rating - a.rating).slice(0, 6);
  return <HomeClient topPlaces={topPlaces} />;
}
