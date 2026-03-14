import { Prisma } from "@prisma/client";
import type { Brand, Model, CarType, FuelType, Transmission, Currency, CarStatus } from "@prisma/client";

export const carWithRelations = Prisma.validator<Prisma.CarDefaultArgs>()({
  include: {
    brand: true,
    model: true,
    tags: true,
    location: true,
  },
});

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
  type: CarType;
  fuelType: FuelType;
  transmission: Transmission;
  price: number;
  currency: Currency;
  description: string;
  locationId?: string;
  images: string[];
  tags?: string[];
  status: CarStatus;
}

export type CarWithRelations = Prisma.CarGetPayload<typeof carWithRelations>;
export type CreateCarPayload = CarPayload;
export type UpdateCarPayload = Partial<CarPayload>;
