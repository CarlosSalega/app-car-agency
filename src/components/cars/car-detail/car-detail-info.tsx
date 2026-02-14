import type { Car, Brand, Model, Location, Tag } from "@prisma/client";

import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatTagName } from "@/lib/tag-utils";

interface CarDetailInfoProps {
  car: Car & {
    brand: Brand;
    model: Model;
    location?: Location | null;
    tags?: Tag[];
  };
}

export function CarDetailInfo({ car }: CarDetailInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: car.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-balance">{car.title}</h1>
        {car.location ? (
          <div className="text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <div>
              <div className="font-medium">{car.location.name}</div>
              <div className="text-muted-foreground text-sm">{car.location.address}</div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={car.status === "AVAILABLE" ? "default" : "secondary"}>
          {car.status === "AVAILABLE" ? "Disponible" : car.status}
        </Badge>

        {car.kilometers === 0 ? (
          <Badge variant="outline">0Km</Badge>
        ) : car.kilometers > 0 && car.kilometers < 50000 ? (
          <Badge variant="secondary">Pocos kilómetros</Badge>
        ) : null}
      </div>

      <div className="border-border border-t border-b py-6">
        <p className="text-foreground text-4xl font-bold">{formatPrice(car.price)}</p>
        <p className="text-muted-foreground mt-1 text-sm">Precio final</p>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-semibold">Descripción</h2>
        <p className="text-muted-foreground leading-relaxed text-pretty">{car.description}</p>
      </div>

      {car.tags && car.tags.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {car.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={tag.color ? "default" : "outline"}
                style={
                  tag.color
                    ? {
                        backgroundColor: tag.color,
                        color: "#ffffff",
                      }
                    : undefined
                }
              >
                {formatTagName(tag.name)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
