import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/db-cache";

export function revalidateCars() {
  revalidateTag(CACHE_TAGS.CARS);
}

export function revalidateCar(id: string) {
  revalidateTag(CACHE_TAGS.CAR(id));
}

export function revalidateBrands() {
  revalidateTag(CACHE_TAGS.BRANDS);
}

export function revalidateModels() {
  revalidateTag(CACHE_TAGS.MODELS);
}

export function revalidateLocations() {
  revalidateTag(CACHE_TAGS.LOCATIONS);
}

export function revalidateTags() {
  revalidateTag(CACHE_TAGS.TAGS);
}
