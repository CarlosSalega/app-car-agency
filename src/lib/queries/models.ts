import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/db-cache";

export async function getModels(brandId?: string | null) {
  return unstable_cache(
    async (id: string | undefined) =>
      prisma.model.findMany({
        where: id ? { brandId: id } : undefined,
        orderBy: { name: "asc" },
        include: { brand: true },
      }),
    [CACHE_TAGS.MODELS, brandId ?? "all"],
    { tags: [CACHE_TAGS.MODELS], revalidate: CACHE_REVALIDATE.STATIC_DATA },
  )(brandId ?? undefined);
}
