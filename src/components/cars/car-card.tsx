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
        <div className="relative aspect-4/5 overflow-hidden sm:aspect-4/3 lg:aspect-3/2">
          <CarImage
            imageKey={imageKey}
            alt={title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-2 right-2 z-20">
            <Badge className={`${statusColors[status] ?? "bg-gray-600"} text-white`}>
              {status === "AVAILABLE" ? "Disponible" : String(status ?? "")}
            </Badge>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          <h3 className="line-clamp-2 text-base font-semibold sm:line-clamp-1">{title}</h3>

          <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 shrink-0" />
              <span className="truncate">{year}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Gauge className="size-4 shrink-0" />
              <span className="truncate">{formatKm(kilometers)} km</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Fuel className="size-4 shrink-0" />
              <span className="truncate">{fuelLabels[fuelType] ?? fuelType}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Settings className="size-4 shrink-0" />
              <span className="truncate">{transmissionLabel}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 flex flex-col items-start gap-1 border-t p-3 sm:p-4">
          <p className="text-foreground text-lg font-bold sm:text-xl">{formatPrice(price, currency)} de contado</p>

          {acceptsFinancing && financingNotes && (
            <p className="text-xs leading-tight text-emerald-600">{financingNotes}</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
