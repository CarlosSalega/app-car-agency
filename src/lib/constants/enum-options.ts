import { CarType, FuelType, Transmission, Currency, CarStatus } from "@prisma/client";

export const CAR_TYPE_OPTIONS = [
  { value: CarType.SEDAN, label: "Sedán" },
  { value: CarType.SUV, label: "SUV" },
  { value: CarType.HATCHBACK, label: "Hatchback" },
  { value: CarType.PICKUP, label: "Pickup" },
  { value: CarType.COUPE, label: "Coupé" },
] as const;

export const FUEL_TYPE_OPTIONS = [
  { value: FuelType.GASOLINE, label: "Nafta" },
  { value: FuelType.DIESEL, label: "Diesel" },
  { value: FuelType.ELECTRIC, label: "Eléctrico" },
  { value: FuelType.HYBRID, label: "Híbrido" },
  { value: FuelType.CNG, label: "GNC" },
  { value: FuelType.OTHER, label: "Otro" },
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: Transmission.MANUAL, label: "Manual" },
  { value: Transmission.AUTOMATIC, label: "Automática" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: Currency.ARS, label: "ARS" },
  { value: Currency.USD, label: "USD" },
] as const;

export const CAR_STATUS_OPTIONS = [
  { value: CarStatus.AVAILABLE, label: "Disponible" },
  { value: CarStatus.RESERVED, label: "Reservado" },
  { value: CarStatus.SOLD, label: "Vendido" },
  { value: CarStatus.INACTIVE, label: "Inactivo" },
] as const;
