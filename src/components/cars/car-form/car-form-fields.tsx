"use client";
import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { CarInput } from "@/lib/validations/car";
import type { Model, Location, Car } from "@prisma/client";
import type { BrandWithModels } from "@/types/car-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/form/form-field";
import { EnumSelect } from "@/components/form/enum-select";
import {
  CAR_TYPE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  CURRENCY_OPTIONS,
  CAR_STATUS_OPTIONS,
} from "@/lib/constants/enum-options";

interface CarFormFieldsProps {
  register: UseFormRegister<CarInput>;
  setValue: UseFormSetValue<CarInput>;
  errors: FieldErrors<CarInput>;
  formData: Partial<CarInput>;
  brands: BrandWithModels[];
  models: Model[];
  locations: Location[];
  selectedBrandId: string;
  onBrandChange: (brandId: string) => void;
}

export function CarFormFields({
  register,
  setValue,
  errors,
  formData,
  brands,
  models,
  locations,
  selectedBrandId,
  onBrandChange,
}: CarFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Título" error={errors.title} required htmlFor="title" className="md:col-span-2">
          <Input id="title" {...register("title")} required />
        </FormField>

        <FormField label="Marca" error={errors.brandId} required>
          <Select value={formData.brandId || ""} onValueChange={onBrandChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Modelo" error={errors.modelId} required>
          <Select
            value={formData.modelId || ""}
            onValueChange={(value) => setValue("modelId", value)}
            required
            disabled={!selectedBrandId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Versión" error={errors.version} htmlFor="version">
          <Input id="version" {...register("version")} />
        </FormField>

        <FormField label="Año" error={errors.year} required htmlFor="year" className="max-w-20">
          <Input id="year" type="number" className="no-spinner" {...register("year")} required />
        </FormField>

        <FormField label="Kilómetros" error={errors.kilometers} required htmlFor="kilometers" className="max-w-30">
          <Input id="kilometers" type="number" {...register("kilometers")} required className="max-w-30" />
        </FormField>

        <FormField label="Color" error={errors.color} htmlFor="color" className="max-w-30">
          <Input id="color" {...register("color")} />
        </FormField>

        <FormField label="Tipo" error={errors.type} required>
          <EnumSelect
            value={formData.type || "SEDAN"}
            onValueChange={(value: Car["type"]) => setValue("type", value)}
            options={CAR_TYPE_OPTIONS}
          />
        </FormField>

        <FormField label="Combustible" error={errors.fuelType} required>
          <EnumSelect
            value={formData.fuelType || "GASOLINE"}
            onValueChange={(value: Car["fuelType"]) => setValue("fuelType", value)}
            options={FUEL_TYPE_OPTIONS}
          />
        </FormField>

        <FormField label="Transmisión" error={errors.transmission} required>
          <EnumSelect
            value={formData.transmission || "MANUAL"}
            onValueChange={(value: Car["transmission"]) => {
              if (value === "MANUAL" || value === "AUTOMATIC") {
                setValue("transmission", value);
              }
            }}
            options={TRANSMISSION_OPTIONS}
          />
        </FormField>

        <FormField label="Precio" error={errors.price} required htmlFor="price" className="max-w-32">
          <Input id="price" type="number" step="0.01" {...register("price")} required />
        </FormField>

        <FormField label="Moneda" error={errors.currency} required>
          <EnumSelect
            value={formData.currency || "ARS"}
            onValueChange={(value: Car["currency"]) => setValue("currency", value)}
            options={CURRENCY_OPTIONS}
          />
        </FormField>

        <FormField label="Ubicación" error={errors.locationId} required>
          <Select value={formData.locationId || ""} onValueChange={(value) => setValue("locationId", value)}>
            <SelectTrigger className="xs:max-w-full max-w-46">
              <SelectValue placeholder="Seleccionar ubicación" className="truncate" />
            </SelectTrigger>

            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name} — {loc.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField label="Descripción" error={errors.description} required htmlFor="description">
        <Textarea id="description" {...register("description")} rows={4} required />
      </FormField>

      <FormField label="Estado" error={errors.status} required>
        <EnumSelect
          value={formData.status || "AVAILABLE"}
          onValueChange={(value: Car["status"]) => setValue("status", value)}
          options={CAR_STATUS_OPTIONS}
        />
      </FormField>
    </>
  );
}
