import { CarGrid } from "@/components/cars/car-grid";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header/header";
import MobileFiltersSheet from "@/components/mobile-filters-sheet";
import { SearchFilters } from "@/components/search-filters";
import { getBrandsWithModels } from "@/lib/queries/brands";
import { type CarListFilters, getCarsCount, getCarsList } from "@/lib/queries/cars";

export const revalidate = 300;

function buildFilters(params: { [key: string]: string | string[] | undefined }): CarListFilters {
  const filters: CarListFilters = {};
  if (params.brand && params.brand !== "all") filters.brandId = params.brand as string;
  if (params.model && params.model !== "all") filters.modelId = params.model as string;
  if (params.type && params.type !== "all") filters.type = params.type as string;
  if (params.fuel && params.fuel !== "all") filters.fuelType = params.fuel as string;
  if (params.transmission && params.transmission !== "all") filters.transmission = params.transmission as string;
  if (params.minYear) filters.minYear = Number(params.minYear);
  if (params.maxYear) filters.maxYear = Number(params.maxYear);
  if (params.minPrice) filters.minPrice = Number(params.minPrice);
  if (params.maxPrice) filters.maxPrice = Number(params.maxPrice);
  if (params.search) filters.search = params.search as string;
  return filters;
}

export default async function AutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;
  const filters = buildFilters(params);

  const [cars, total, brands] = await Promise.all([
    getCarsList(filters, skip, limit),
    getCarsCount(filters),
    getBrandsWithModels(),
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
