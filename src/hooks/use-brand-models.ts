import { useEffect, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { Model } from "@prisma/client";
import type { BrandWithModels } from "@/types/car-form";
import type { CarInput } from "@/lib/validations/car";

interface UseBrandModelsReturn {
  brandId: string;
  models: Model[];
  handleBrandChange: (
    brandId: string,
    setValue: UseFormSetValue<CarInput>,
  ) => void;
}

export function useBrandModels(
  brandOptions: BrandWithModels[],
  defaultBrandId?: string,
): UseBrandModelsReturn {
  const [brandId, setBrandId] = useState(defaultBrandId ?? "");
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    if (!defaultBrandId) return;

    const selectedBrand = brandOptions.find(
      (item) => item.id === defaultBrandId,
    );

    if (selectedBrand) {
      setModels(selectedBrand.models);
    }
  }, [defaultBrandId, brandOptions]);

  const handleBrandChange = (
    brandId: string,
    setValue: UseFormSetValue<CarInput>,
  ) => {
    setBrandId(brandId);
    setValue("brandId", brandId);
    setValue("modelId", "");

    const selectedBrand = brandOptions.find((item) => item.id === brandId);

    setModels(selectedBrand?.models ?? []);
  };

  return {
    brandId,
    models,
    handleBrandChange,
  };
}
