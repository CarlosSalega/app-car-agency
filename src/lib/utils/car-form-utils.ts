import type { CarInput } from "@/lib/validations/car";
import type { CarWithRelations, CarPayload } from "@/types/car-form";

export function carToFormValues(car?: CarWithRelations): Partial<CarInput> {
  if (!car) return getDefaultFormValues();

  return {
    title: car.title || "",
    brandId: car.brandId || "",
    modelId: car.modelId || "",
    version: car.version || "",
    color: car.color || "",
    year: car.year?.toString() || "",
    kilometers: car.kilometers?.toString() || "",
    type: car.type || "SEDAN",
    fuelType: car.fuelType || "GASOLINE",
    transmission: car.transmission || "MANUAL",
    price: car.price?.toString() || "",
    currency: car.currency || "ARS",
    description: car.description || "",
    locationId: car.locationId || "",
    images: car.images
      ? typeof car.images === "string"
        ? JSON.parse(car.images)
        : car.images
      : ([] as string[]),
    tags: car.tags
      ? Array.isArray(car.tags)
        ? car.tags.map((t) => t.name).join(",")
        : ""
      : "",
    status: car.status || "AVAILABLE",
  };
}

export function formValuesToPayload(
  data: CarInput,
  selectedTags: string[],
): CarPayload {
  return {
    title: data.title,
    brandId: data.brandId,
    modelId: data.modelId,
    version: data.version,
    color: data.color,
    year: parseInt(data.year, 10),
    kilometers: parseInt(data.kilometers, 10),
    type: data.type,
    fuelType: data.fuelType,
    transmission: data.transmission,
    price: parseFloat(data.price),
    currency: data.currency,
    description: data.description,
    locationId: data.locationId || null,
    images: Array.isArray(data.images)
      ? JSON.stringify(data.images)
      : data.images,
    tags: selectedTags.length > 0 ? selectedTags : parseTagsString(data.tags),
    status: data.status,
  };
}

export function getDefaultFormValues(): Partial<CarInput> {
  return {
    type: "SEDAN",
    fuelType: "GASOLINE",
    transmission: "MANUAL",
    currency: "ARS",
    status: "AVAILABLE",
    images: [],
    title: "",
    brandId: "",
    modelId: "",
    version: "",
    color: "",
    year: "",
    kilometers: "",
    price: "",
    description: "",
    locationId: "",
    tags: "",
  };
}

function parseTagsString(tags?: string | string[]): string[] {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
