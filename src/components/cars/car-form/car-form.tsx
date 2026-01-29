"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";
import { carSchema, type CarInput } from "@/lib/validations/car";
import {
  carToFormValues,
  formValuesToPayload,
} from "@/lib/utils/car-form-utils";
import { useCarFormData } from "@/hooks/use-car-form-data";
import { useBrandModels } from "@/hooks/use-brand-models";
import { useImageCleanup } from "@/hooks/use-image-cleanup";
import { useTagSelection } from "@/hooks/use-tag-selection";
import { CarFormFields } from "@/components/cars/car-form/car-form-fields";
import { TagSelector } from "@/components/form/tag-selector";
import { FormActions } from "@/components/form/form-actions";
import { FormField } from "@/components/form/form-field";
import { CarFormSkeleton } from "@/components/cars/car-form/car-form-skeleton";
import type { CarWithRelations } from "@/types/car-form";
import { Plus, Edit } from "lucide-react";

interface CarFormProps {
  car?: CarWithRelations;
  mode: "create" | "edit";
}

export function CarForm({ car, mode }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { brands, locations, tags, loading: dataLoading } = useCarFormData();

  const initialFormValues = useMemo(() => carToFormValues(car), [car]);
  const initialImages = useMemo(
    () =>
      Array.isArray(initialFormValues.images) ? initialFormValues.images : [],
    [initialFormValues.images],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CarInput>({
    resolver: zodResolver(carSchema),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const formData = watch();

  const { brandId, models, handleBrandChange } = useBrandModels(
    brands,
    car?.brandId,
  );

  const { tempUploaded, setTempUploaded, cleanupUsedImages } =
    useImageCleanup();

  const { selectedTags, addTag, removeTag } = useTagSelection(
    tags,
    car?.tags,
    setValue,
  );

  const onSubmit = async (data: CarInput) => {
    setLoading(true);
    try {
      const url = mode === "create" ? "/api/cars" : `/api/cars/${car?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const payload = formValuesToPayload(data, selectedTags);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const finalImages = Array.isArray(data.images) ? data.images : [];

        cleanupUsedImages(finalImages);
        router.push("/admin/cars");
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(
          errorData.error ||
            errorData.details?.[0] ||
            "Error al guardar el vehículo",
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error al guardar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <CarFormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mx-auto max-w-2xl px-2 py-6 md:px-4">
        <CardHeader className="px-2">
          <CardTitle className="text-primary flex items-center gap-2 underline">
            {mode === "create" ? (
              <Plus className="size-5" />
            ) : (
              <Edit className="size-5" />
            )}
            {mode === "create" ? "Nuevo Vehículo" : "Editar Vehículo"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-2">
          <CarFormFields
            register={register}
            setValue={setValue}
            errors={errors}
            formData={formData}
            brands={brands}
            models={models}
            locations={locations}
            selectedBrandId={brandId}
            onBrandChange={(brandId) => handleBrandChange(brandId, setValue)}
          />

          <FormField label="Imágenes" error={errors.images} required>
            <ImageUpload
              value={Array.isArray(formData.images) ? formData.images : []}
              onChange={(urls) => {
                const prev = Array.isArray(formData.images)
                  ? formData.images
                  : [];
                const newOnes = urls.filter(
                  (url) => !prev.includes(url) && !initialImages.includes(url),
                );
                if (newOnes.length) {
                  setTempUploaded((temp) => {
                    const existingSet = new Set(temp);
                    const uniqueNewOnes = newOnes.filter(
                      (url) => !existingSet.has(url),
                    );
                    return uniqueNewOnes.length > 0
                      ? [...temp, ...uniqueNewOnes]
                      : temp;
                  });
                }
                setValue("images", urls);
              }}
            />
          </FormField>

          <FormField label="Tags">
            <TagSelector
              tags={tags}
              selectedTags={selectedTags}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
          </FormField>

          <FormActions
            loading={loading}
            mode={mode}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </form>
  );
}
