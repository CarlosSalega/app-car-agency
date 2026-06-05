import type { Car } from "@prisma/client";

import { PaginationProps } from "@components/pagination";
import { WithPagination } from "@components/with-pagination";

import { CarCard } from "@/components/cars";

interface CarGridProps {
  cars: (Car & {
    brand: { name: string };
    model: { name: string };
  })[];
  pagination?: PaginationProps;
  currentPage?: number;
  totalPages?: number;
}

export function CarGrid({ cars, pagination, currentPage, totalPages }: CarGridProps) {
  const finalPagination =
    pagination ||
    (currentPage && totalPages
      ? {
          currentPage,
          totalPages,
          baseUrl: "?",
        }
      : undefined);

  if (cars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg">No se encontraron vehículos con los filtros seleccionados.</p>
      </div>
    );
  }

  const gridContent = (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );

  return finalPagination ? (
    <WithPagination
      pagination={finalPagination}
      containerClassName="flex flex-col min-h-[400px]"
      contentClassName="flex-1"
    >
      {gridContent}
    </WithPagination>
  ) : (
    gridContent
  );
}
