import { z } from "zod";
import {
  CarType,
  FuelType,
  Transmission,
  Currency,
  CarStatus,
} from "@prisma/client";

// Create Zod enums from Prisma enum types
const CarTypeEnum = z.nativeEnum(CarType);
const FuelTypeEnum = z.nativeEnum(FuelType);
const TransmissionEnum = z.nativeEnum(Transmission);
const CurrencyEnum = z.nativeEnum(Currency);
const CarStatusEnum = z.nativeEnum(CarStatus);

export const carSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título no puede exceder 200 caracteres"),
  brandId: z.string().min(1, "La marca es requerida"),
  modelId: z.string().min(1, "El modelo es requerido"),
  version: z.string().optional(),
  color: z.string().optional(),
  year: z
    .string()
    .min(1, "El año es requerido")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return (
          !isNaN(num) && num >= 1900 && num <= new Date().getFullYear() + 1
        );
      },
      {
        message: `El año debe ser un número válido entre 1900 y ${
          new Date().getFullYear() + 1
        }`,
      },
    ),
  kilometers: z
    .string()
    .min(1, "Los kilómetros son requeridos")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Los kilómetros deben ser un número válido mayor o igual a 0",
      },
    ),
  type: CarTypeEnum,
  fuelType: FuelTypeEnum,
  transmission: TransmissionEnum,
  price: z
    .string()
    .min(1, "El precio es requerido")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: "El precio debe ser un número válido mayor a 0",
      },
    ),
  currency: CurrencyEnum,
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  locationId: z.string().optional(),
  images: z
    .array(
      z.string().refine(
        (val) => {
          if (val.startsWith("/")) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Cada imagen debe ser una URL válida o una ruta local",
        },
      ),
    )
    .min(1, "Debes agregar al menos una imagen"),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  status: CarStatusEnum,
});

export type CarInput = z.infer<typeof carSchema>;
