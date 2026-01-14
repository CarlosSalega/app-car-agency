import { useState, useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { Model } from "@prisma/client";
import type { BrandWithModels } from "@/types/car-form";
import type { CarInput } from "@/lib/validations/car";

interface UseBrandModelsReturn {
  selectedBrandId: string;
  models: Model[];
  handleBrandChange: (
    brandId: string,
    setValue: UseFormSetValue<CarInput>,
  ) => void;
}

export function useBrandModels(
  brands: BrandWithModels[],
  initialBrandId?: string,
): UseBrandModelsReturn {
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrandId || "");
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    if (initialBrandId && brands.length > 0) {
      const brand = brands.find((b) => b.id === initialBrandId);
      if (brand) {
        setModels(brand.models);
      }
    }
  }, [initialBrandId, brands]);

  const handleBrandChange = (
    brandId: string,
    setValue: UseFormSetValue<CarInput>,
  ) => {
    setSelectedBrandId(brandId);
    setValue("brandId", brandId);
    setValue("modelId", "");
    const brand = brands.find((b) => b.id === brandId);
    setModels(brand?.models || []);
  };

  return { selectedBrandId, models, handleBrandChange };
}
