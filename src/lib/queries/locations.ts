import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/db-cache";

export async function getLocations() {
  return unstable_cache(
    async () =>
      prisma.location.findMany({
        orderBy: { name: "asc" },
      }),
    [CACHE_TAGS.LOCATIONS, "locations"],
    { tags: [CACHE_TAGS.LOCATIONS], revalidate: CACHE_REVALIDATE.STATIC_DATA },
  )();
}
