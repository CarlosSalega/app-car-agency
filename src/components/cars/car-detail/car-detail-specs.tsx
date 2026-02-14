import type { Car, Brand, Model } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CarDetailSpecsProps {
  car: Car & {
    brand: Brand;
    model: Model;
  };
}

export function CarDetailSpecs({ car }: CarDetailSpecsProps) {
  const formatKm = (km: number) => {
    return new Intl.NumberFormat("es-AR").format(km);
  };

  const specs = [
    { label: "Marca", value: car.brand.name },
    { label: "Modelo", value: car.model.name },
    { label: "Versión", value: car.version || "N/A" },
    { label: "Año", value: car.year.toString() },
    { label: "Kilometraje", value: `${formatKm(car.kilometers)} km` },
    { label: "Tipo", value: car.type },
    {
      label: "Combustible",
      value: car.fuelType === "GASOLINE" ? "Nafta" : car.fuelType === "DIESEL" ? "Diesel" : car.fuelType,
    },
    {
      label: "Transmisión",
      value: car.transmission === "AUTOMATIC" ? "Automática" : "Manual",
    },
    { label: "Color", value: car.color || "N/A" },
  ];

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle>Ficha Técnica</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="space-y-1">
              <p className="text-muted-foreground text-sm">{spec.label}</p>
              <p className="font-medium">{spec.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
