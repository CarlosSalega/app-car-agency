import { CarType, FuelType, Transmission, Currency, CarStatus } from "@prisma/client";
import { z } from "zod";

const CarTypeEnum = z.nativeEnum(CarType);
const FuelTypeEnum = z.nativeEnum(FuelType);
const TransmissionEnum = z.nativeEnum(Transmission);
const CurrencyEnum = z.nativeEnum(Currency);
const CarStatusEnum = z.nativeEnum(CarStatus);

export const carSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "El título no puede exceder 200 caracteres"),
  brandId: z.string().min(1, "La marca es requerida"),
  modelId: z.string().min(1, "El modelo es requerido"),
  version: z.string().optional(),
  color: z.string().optional(),
  year: z.coerce
    .number()
    .int()
    .min(1900, "El año debe ser mayor o igual a 1900")
    .max(new Date().getFullYear() + 1, "El año debe ser menor o igual a " + (new Date().getFullYear() + 1)),
  kilometers: z.coerce.number().int().min(0, "Los kilómetros deben ser mayor o igual a 0"),
  type: CarTypeEnum,
  fuelType: FuelTypeEnum,
  transmission: TransmissionEnum,
  price: z.coerce.number().positive().min(1, "El precio debe ser mayor a 0"),
  currency: CurrencyEnum,
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  locationId: z.string().optional(),
  images: z
    .array(z.string().min(1, "Cada imagen debe tener un identificador válido"))
    .min(1, "Debes agregar al menos una imagen"),
  tags: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : [val];
    }),
  status: CarStatusEnum,
});

export type CarInput = z.infer<typeof carSchema>;
