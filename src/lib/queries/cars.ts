import type { CarType, FuelType, Prisma, Transmission } from "@prisma/client";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/db-cache";

export type CarListFilters = {
  brandId?: string;
  modelId?: string;
  type?: string;
  fuelType?: string;
  transmission?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

function buildWhere(filters: CarListFilters): Prisma.CarWhereInput {
  const where: Prisma.CarWhereInput = {
    status: "AVAILABLE",
    deletedAt: null,
  };

  if (filters.brandId) where.brandId = filters.brandId;
  if (filters.modelId) where.modelId = filters.modelId;
  if (filters.type) where.type = filters.type as CarType;
  if (filters.fuelType) where.fuelType = filters.fuelType as FuelType;
  if (filters.transmission) where.transmission = filters.transmission as Transmission;
  if (filters.minYear != null || filters.maxYear != null) {
    where.year = {};
    if (filters.minYear != null) where.year.gte = filters.minYear;
    if (filters.maxYear != null) where.year.lte = filters.maxYear;
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price.gte = filters.minPrice;
    if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { brand: { name: { contains: filters.search, mode: "insensitive" } } },
      { model: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getCarsList(filters: CarListFilters, skip: number, take: number) {
  return unstable_cache(
    async (f: CarListFilters, s: number, t: number) =>
      prisma.car.findMany({
        where: buildWhere(f),
        include: { brand: true, model: true },
        orderBy: { createdAt: "desc" },
        skip: s,
        take: t,
      }),
    [CACHE_TAGS.CARS, "cars-list", JSON.stringify(filters), String(skip), String(take)],
    { tags: [CACHE_TAGS.CARS], revalidate: CACHE_REVALIDATE.CARS_LIST },
  )(filters, skip, take);
}

export async function getCarsCount(filters: CarListFilters) {
  return unstable_cache(
    async (f: CarListFilters) => prisma.car.count({ where: buildWhere(f) }),
    [CACHE_TAGS.CARS, "cars-count", JSON.stringify(filters)],
    { tags: [CACHE_TAGS.CARS], revalidate: CACHE_REVALIDATE.CARS_LIST },
  )(filters);
}

export async function getCarBySlug(slug: string) {
  return unstable_cache(
    async (s: string) =>
      prisma.car.findUnique({
        where: { slug: s },
        include: {
          brand: true,
          model: true,
          location: true,
          tags: true,
        },
      }),
    [CACHE_TAGS.CARS, "car-by-slug", slug],
    { tags: [CACHE_TAGS.CARS], revalidate: CACHE_REVALIDATE.CAR_DETAIL },
  )(slug);
}

export async function getCarSlugs() {
  return unstable_cache(
    async () =>
      prisma.car.findMany({
        where: { status: "AVAILABLE", deletedAt: null },
        select: { slug: true },
      }),
    [CACHE_TAGS.CARS, "car-slugs"],
    { tags: [CACHE_TAGS.CARS], revalidate: CACHE_REVALIDATE.CAR_DETAIL },
  )();
}

export async function getLatestCars(take: number) {
  return unstable_cache(
    async (t: number) =>
      prisma.car.findMany({
        where: { status: "AVAILABLE", deletedAt: null },
        include: { brand: true, model: true },
        orderBy: { createdAt: "desc" },
        take: t,
      }),
    [CACHE_TAGS.CARS, "latest-cars", String(take)],
    { tags: [CACHE_TAGS.CARS], revalidate: CACHE_REVALIDATE.CARS_LIST },
  )(take);
}
