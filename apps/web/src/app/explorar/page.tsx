import { fetchPlaces } from "@/lib/api";
import { ExplorarClient } from "./ExplorarClient";

export const dynamic = "force-dynamic";

export default async function ExplorarPage() {
  const { data: places } = await fetchPlaces({ limit: 50 });
  return <ExplorarClient initialPlaces={places} />;
}
