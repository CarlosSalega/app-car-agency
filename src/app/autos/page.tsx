import { prisma } from "@/lib/db";
import { SearchFilters } from "@/components/search-filters";
import { CarGrid } from "@/components/cars/car-grid";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer";
import MobileFiltersSheet from "@/components/mobile-filters-sheet";

export const dynamic = "force-dynamic";

export default async function AutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const where: any = {
    status: "AVAILABLE",
    deletedAt: null,
  };

  if (params.brand && params.brand !== "all")
    where.brandId = params.brand as string;
  if (params.model && params.model !== "all")
    where.modelId = params.model as string;
  if (params.type && params.type !== "all") where.type = params.type as string;
  if (params.fuel && params.fuel !== "all")
    where.fuelType = params.fuel as string;
  if (params.transmission && params.transmission !== "all")
    where.transmission = params.transmission as string;
  if (params.minYear) where.year = { gte: Number(params.minYear) };
  if (params.maxYear)
    where.year = { ...where.year, lte: Number(params.maxYear) };
  if (params.minPrice) where.price = { gte: Number(params.minPrice) };
  if (params.maxPrice)
    where.price = { ...where.price, lte: Number(params.maxPrice) };
  if (params.search) {
    where.OR = [
      {
        title: {
          contains: params.search as string,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: params.search as string,
          mode: "insensitive",
        },
      },
      {
        brand: {
          name: {
            contains: params.search as string,
            mode: "insensitive",
          },
        },
      },
      {
        model: {
          name: {
            contains: params.search as string,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [cars, total, brands] = await Promise.all([
    prisma.car.findMany({
      where,
      include: {
        brand: true,
        model: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.car.count({ where }),
    prisma.brand.findMany({
      include: {
        models: true,
      },
    }),
    prisma.car.findMany({
      where: {
        status: "AVAILABLE",
        deletedAt: null,
      },
      include: {
        brand: true,
        model: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="grid gap-8 px-2 py-8 md:px-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <SearchFilters brands={brands} />
        </div>
        <CarGrid cars={cars} currentPage={page} totalPages={totalPages} />
      </div>
      <MobileFiltersSheet brands={brands} />
      <Footer />
    </div>
  );
}
