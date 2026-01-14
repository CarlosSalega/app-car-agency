"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { setIfParam } from "@/lib/utils";

interface SearchFiltersProps {
  brands: Array<{
    id: string;
    name: string;
    models: Array<{ id: string; name: string }>;
  }>;
}

export function SearchFilters({
  brands,
  onApply,
}: SearchFiltersProps & { onApply?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || "",
  );
  const [selectedModel, setSelectedModel] = useState(
    searchParams.get("model") || "",
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "",
  );
  const [selectedFuel, setSelectedFuel] = useState(
    searchParams.get("fuel") || "",
  );
  const [selectedTransmission, setSelectedTransmission] = useState(
    searchParams.get("transmission") || "",
  );
  const [minYear, setMinYear] = useState(searchParams.get("minYear") || "");
  const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const selectedBrandData = brands.find((b) => b.id === selectedBrand);

  const handleFilter = () => {
    const params = new URLSearchParams();

    setIfParam(params, "brand", selectedBrand);
    setIfParam(params, "model", selectedModel);
    setIfParam(params, "type", selectedType);
    setIfParam(params, "fuel", selectedFuel);
    setIfParam(params, "transmission", selectedTransmission);
    setIfParam(params, "minYear", minYear);
    setIfParam(params, "maxYear", maxYear);
    setIfParam(params, "minPrice", minPrice);
    setIfParam(params, "maxPrice", maxPrice);

    const query = params.toString();
    router.push(query ? `/autos/?${query}` : "/autos");
    onApply?.();
  };

  const handleClear = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedType("");
    setSelectedFuel("");
    setSelectedTransmission("");
    setMinYear("");
    setMaxYear("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/autos");
    onApply?.();
  };

  return (
    <div className="bg-card border-border space-y-6 rounded-lg border p-6 shadow-sm lg:sticky lg:top-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="mr-1 size-4" />
          Limpiar
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Marca</Label>
          <Select
            value={selectedBrand}
            onValueChange={(value) => {
              setSelectedBrand(value);
              setSelectedModel("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBrandData && (
          <div>
            <Label>Modelo</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {selectedBrandData.models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Tipo</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="SEDAN">Sedán</SelectItem>
              <SelectItem value="HATCHBACK">Hatchback</SelectItem>
              <SelectItem value="PICKUP">Pickup</SelectItem>
              <SelectItem value="COUPE">Coupé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Combustible</Label>
          <Select value={selectedFuel} onValueChange={setSelectedFuel}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="GASOLINE">Nafta</SelectItem>
              <SelectItem value="DIESEL">Diesel</SelectItem>
              <SelectItem value="ELECTRIC">Eléctrico</SelectItem>
              <SelectItem value="HYBRID">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Transmisión</Label>
          <Select
            value={selectedTransmission}
            onValueChange={setSelectedTransmission}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
              <SelectItem value="AUTOMATIC">Automática</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Año</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Desde"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Hasta"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Precio (ARS)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mínimo"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleFilter} className="w-full">
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
}
