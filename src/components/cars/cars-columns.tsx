import type { AdminColumn } from "@/components/admin/admin-table";
import { ActionButtonsGroup } from "@/components/admin/admin-action-buttons";
import { CarStatusBadge } from "@/components/status-badges";
import { CarImage } from "@/components/cars/car-image";
import { safeJsonParse, getPublicIdFromUrl } from "@/lib/utils";
import type { CarWithRelations } from "@/types/cars";

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);

interface Params {
  onDelete: (carId: string) => void;
}

export function getCarsColumns({
  onDelete,
}: Params): AdminColumn<CarWithRelations>[] {
  return [
    {
      key: "image",
      header: "Imagen",
      cell: (car) => {
        const images = safeJsonParse<string[]>(car.images as string | null, []);
        const imageUrl = images[0] || "/placeholder.webp";
        const publicId = getPublicIdFromUrl(imageUrl);

        return (
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <CarImage
              publicId={publicId}
              alt={car.title}
              className="size-full object-cover"
              skipSkeleton={false}
            />
          </div>
        );
      },
    },
    {
      key: "vehicle",
      header: "Vehículo",
      cell: (car) => (
        <div>
          <p className="font-medium">{car.title}</p>
          <p className="text-muted-foreground text-sm">
            {car.brand.name} {car.model.name}
          </p>
        </div>
      ),
    },
    {
      key: "year",
      header: "Año",
      cell: (car) => car.year,
    },
    {
      key: "price",
      header: "Precio",
      cell: (car) => formatPrice(car.price, car.currency),
    },
    {
      key: "status",
      header: "Estado",
      cell: (car) => <CarStatusBadge status={car.status} />,
    },
    {
      key: "createdBy",
      header: "Creado por",
      cell: (car) => (
        <span className="text-muted-foreground text-sm">
          {car.user?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="text-right">Acciones</span>,
      className: "text-right",
      cell: (car) => (
        <ActionButtonsGroup
          viewHref={`/autos/${car.slug}`}
          viewOpenInNewTab
          editHref={`/admin/cars/${car.id}/edit`}
          onDelete={() => onDelete(car.id)}
        />
      ),
    },
  ];
}
