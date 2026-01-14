"use client";

import type { Car } from "@prisma/client";
import Link from "next/link";
import {
  safeJsonParse,
  formatPrice,
  formatKm,
  getPublicIdFromUrl,
} from "@/lib/utils";
import { fuelLabels, transmissionLabels, statusColors } from "@/lib/constants";
import { Calendar, Gauge, Fuel, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/components/car-image";

interface CarCardProps {
  car: Car & {
    brand: { name: string };
    model: { name: string };
  };
}

export function CarCard({ car }: CarCardProps) {
  const {
    title,
    brand,
    model,
    year,
    kilometers,
    fuelType,
    transmission,
    price,
    currency,
    status,
    slug,
  } = car;

  const images = safeJsonParse<string[]>(car.images as string | null, []);

  const imageUrl = images[0] || "/placeholder.webp";
  const publicId = getPublicIdFromUrl(imageUrl);

  const transmissionLabel = transmission
    ? (transmissionLabels[transmission] ?? transmission)
    : "Sin datos";

  return (
    <Link href={`/autos/${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-muted relative h-56 overflow-hidden rounded-t-xl">
          <CarImage
            publicId={publicId}
            alt={car.title}
            className="size-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className={`${statusColors[status] ?? "bg-gray-600"} text-white`}
            >
              {status === "AVAILABLE" ? "Disponible" : status}
            </Badge>
          </div>
        </div>

        <CardContent className="px-2 pt-0 pb-4 md:px-4">
          <h3 className="mb-1 line-clamp-1 text-base font-semibold">{title}</h3>

          <p className="text-muted-foreground mb-3 text-sm">
            {brand.name} {model.name}
          </p>

          <div className="text-muted-foreground mb-3 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="size-4" />
              <span>{year}</span>
            </div>

            <div className="flex items-center gap-1">
              <Gauge className="size-4" />
              <span>{formatKm(kilometers)} km</span>
            </div>

            <div className="flex items-center gap-1">
              <Fuel className="size-4" />
              <span>{fuelLabels[fuelType] ?? fuelType}</span>
            </div>

            <div className="flex items-center gap-1">
              <Settings className="size-4" />
              <span>{transmissionLabel}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-2 pt-0 pb-4 md:px-4">
          <p className="text-foreground text-base font-bold">
            {formatPrice(price, currency)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
