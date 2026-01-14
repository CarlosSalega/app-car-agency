"use client";

import type { Car, Brand, Model, User } from "@prisma/client";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { AdminTable } from "@/components/admin/admin-table";
import { ActionButtonsGroup } from "./admin/admin-action-buttons";
import { CarStatusBadge } from "./status-badges";
import { CarImage } from "./cars/car-image";
import { safeJsonParse, getPublicIdFromUrl } from "@/lib/utils";
import type { PaginationProps } from "./pagination";

export interface CarsTableProps {
  cars: (Car & {
    brand: Brand;
    model: Model;
    user: User | null;
  })[];
  pagination?: PaginationProps;
}

export function CarsTable({ cars, pagination }: CarsTableProps) {
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este vehículo?")) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) window.location.reload();
    } catch {
      alert("Error al eliminar el vehículo");
    }
  };

  if (cars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg">
          No se encontraron vehículos.
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      pagination={pagination}
      footerColSpan={7}
      header={
        <TableRow>
          <TableHead>Imagen</TableHead>
          <TableHead>Vehículo</TableHead>
          <TableHead>Año</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado por</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      }
      body={cars.map((car) => {
        const images = safeJsonParse<string[]>(car.images as string | null, []);
        const imageUrl = images[0] || "/placeholder.webp";
        const publicId = getPublicIdFromUrl(imageUrl);

        return (
          <TableRow key={car.id}>
            <TableCell>
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <CarImage
                  publicId={publicId}
                  alt={car.title}
                  className="size-full object-cover"
                  skipSkeleton={false}
                />
              </div>
            </TableCell>

            <TableCell>
              <div>
                <p className="font-medium">{car.title}</p>
                <p className="text-muted-foreground text-sm">
                  {car.brand.name} {car.model.name}
                </p>
              </div>
            </TableCell>

            <TableCell>{car.year}</TableCell>

            <TableCell>{formatPrice(car.price, car.currency)}</TableCell>

            <TableCell>
              <CarStatusBadge status={car.status} />
            </TableCell>

            <TableCell className="text-muted-foreground text-sm">
              {car.user?.name || "N/A"}
            </TableCell>

            <TableCell className="text-right">
              <ActionButtonsGroup
                viewHref={`/autos/${car.slug}`}
                viewOpenInNewTab
                editHref={`/admin/cars/${car.id}/edit`}
                onDelete={() => handleDelete(car.id)}
              />
            </TableCell>
          </TableRow>
        );
      })}
    />
  );
}
