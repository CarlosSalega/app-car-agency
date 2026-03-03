"use client";

import type { PaginationProps } from "@/components/pagination";
import type { CarWithRelations } from "@/types/cars";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminTable } from "@/components/admin";
import { getCarsColumns, DeleteCarDialog } from "@/components/cars";

export interface CarsTableProps {
  cars: CarWithRelations[];
  pagination?: PaginationProps;
}

export function CarsTable({ cars, pagination }: CarsTableProps) {
  const router = useRouter();

  const [carToDelete, setCarToDelete] = useState<CarWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(carId: string) {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error al eliminar el vehículo");
        return;
      }

      setCarToDelete(null);
      router.refresh();
    } catch {
      alert("Error al eliminar el vehículo");
    } finally {
      setIsDeleting(false);
    }
  }

  const columns = getCarsColumns({
    onDelete: (carId) => {
      const carToRemove = cars.find((car) => car.id === carId);
      if (carToRemove) {
        setCarToDelete(carToRemove);
      }
    },
  });

  return (
    <>
      <AdminTable
        data={cars}
        columns={columns}
        rowKey={(car) => car.id}
        emptyState="No se encontraron vehículos"
        pagination={pagination}
      />

      <DeleteCarDialog
        open={!!carToDelete}
        car={carToDelete}
        onCancel={() => setCarToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
