import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { prismaSafe } from "@/lib/prisma-safe";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache";

export async function getLocations() {
  return unstable_cache(
    async () =>
      prismaSafe(() =>
        prisma.location.findMany({
          orderBy: { name: "asc" },
        }),
      ),
    [CACHE_TAGS.LOCATIONS, "locations"],
    { tags: [CACHE_TAGS.LOCATIONS], revalidate: CACHE_REVALIDATE.STATIC_DATA },
  )();
}
