"use client";

import type { Car } from "@prisma/client";

import { Calendar, Gauge, Fuel, Settings } from "lucide-react";
import Link from "next/link";

import { CarImage } from "@/components/cars";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fuelLabels, transmissionLabels, statusColors } from "@/lib/constants";
import { safeJsonParse, formatPrice, formatKm } from "@/lib/utils";

interface CarCardProps {
  car: Car & {
    brand: { name: string };
    model: { name: string };
  };
}

export function CarCard({ car }: CarCardProps) {
  const {
    title,
    year,
    kilometers,
    fuelType,
    transmission,
    price,
    currency,
    status,
    slug,
    acceptsFinancing,
    financingNotes,
  } = car;

  const images: string[] = Array.isArray(car.images)
    ? car.images
    : safeJsonParse<string[]>((car.images as unknown as string) ?? "", [] as string[]);
  const imageKey = images[0] ?? undefined;

  const transmissionLabel = transmission ? (transmissionLabels[transmission] ?? transmission) : "Sin datos";

  return (
    <Link href={`/autos/${slug}`} className="block">
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        {/* Imagen: square en mobile, 4/3 en sm, 3/2 en lg */}
        <div className="relative aspect-square overflow-hidden sm:aspect-4/3 lg:aspect-3/2">
          <CarImage
            imageKey={imageKey}
            alt={title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 z-20">
            <Badge className={statusColors[status] ?? "bg-muted text-foreground"}>
              {status === "AVAILABLE" ? "Disponible" : String(status ?? "")}
            </Badge>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 p-2 sm:gap-3 sm:p-4">
          {/* Título: siempre 1 línea en mobile */}
          <h3 className="line-clamp-1 text-sm leading-tight font-semibold sm:text-base">{title}</h3>

          {/* Metadata: más chica en mobile */}
          <div className="text-muted-foreground grid grid-cols-2 gap-x-1 gap-y-1 text-[10px] sm:gap-2 sm:text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="size-3 shrink-0 sm:size-4" />
              <span className="truncate">{year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="size-3 shrink-0 sm:size-4" />
              <span className="truncate">{formatKm(kilometers)} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="size-3 shrink-0 sm:size-4" />
              <span className="truncate">{fuelLabels[fuelType] ?? fuelType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="size-3 shrink-0 sm:size-4" />
              <span className="truncate">{transmissionLabel}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 flex flex-col items-start gap-0.5 border-t p-2 sm:gap-1 sm:p-4">
          {/* Precio más chico en mobile */}
          <p className="text-foreground text-sm font-bold sm:text-xl">{formatPrice(price, currency)}</p>
          {acceptsFinancing && financingNotes && (
            <p className="text-badge line-clamp-1 text-[10px] leading-tight font-bold sm:text-sm">{financingNotes}</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
