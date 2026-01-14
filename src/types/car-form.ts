import type { Car, Brand, Model, Location, Tag } from "@prisma/client";

export interface CarWithRelations extends Car {
  brand: Brand;
  model: Model;
  tags?: Tag[];
  location?: Location | null;
}

export interface BrandWithModels extends Brand {
  models: Model[];
}

export interface CarPayload {
  title: string;
  brandId: string;
  modelId: string;
  version?: string;
  color?: string;
  year: number;
  kilometers: number;
  type: Car["type"];
  fuelType: Car["fuelType"];
  transmission: Car["transmission"];
  price: number;
  currency: Car["currency"];
  description: string;
  locationId: string | null;
  images: string;
  tags: string[];
  status: Car["status"];
}
