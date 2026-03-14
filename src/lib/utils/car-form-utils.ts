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
    year: car.year ?? 0,
    kilometers: car.kilometers ?? 0,
    type: car.type || "SEDAN",
    fuelType: car.fuelType || "GASOLINE",
    transmission: car.transmission || "MANUAL",
    price: car.price ?? 0,
    currency: car.currency || "ARS",
    description: car.description || "",
    locationId: car.locationId ?? undefined,
    images: Array.isArray(car.images) ? car.images : [],
    tags: car.tags ? car.tags.map((t) => t.id) : [],
    status: car.status || "AVAILABLE",
  };
}

export function formValuesToPayload(data: CarInput, selectedTags: string[]): CarPayload {
  return {
    title: data.title,
    brandId: data.brandId,
    modelId: data.modelId,
    version: data.version,
    color: data.color,
    year: data.year,
    kilometers: data.kilometers,
    type: data.type,
    fuelType: data.fuelType,
    transmission: data.transmission,
    price: data.price,
    currency: data.currency,
    description: data.description,
    locationId: data.locationId,
    images: Array.isArray(data.images) ? data.images : [],
    tags: selectedTags.length > 0 ? selectedTags : (data.tags ?? []),
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
    year: 0,
    kilometers: 0,
    price: 0,
    description: "",
    locationId: "",
    tags: [],
  };
}
