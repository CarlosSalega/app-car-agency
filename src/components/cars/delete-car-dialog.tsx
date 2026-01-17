"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteCarDialogProps {
  open: boolean;
  car: {
    id: string;
    title: string;
    year?: number;
    brand: { name: string };
    model: { name: string };
  } | null;
  onCancel: () => void;
  onConfirm: (carId: string) => Promise<void>;
}

export function DeleteCarDialog({
  open,
  car,
  onCancel,
  onConfirm,
}: DeleteCarDialogProps) {
  if (!car) return null;

  return (
    <ConfirmDialog
      open={open}
      title="Eliminar vehículo"
      description="¿Estás seguro de que querés eliminar este vehículo?"
      confirmLabel="Eliminar"
      destructive
      onCancel={onCancel}
      onConfirm={() => onConfirm(car.id)}
    >
      <div className="space-y-2">
        <div className="font-medium">{car.title}</div>

        <div className="text-muted-foreground text-sm">
          {car.brand.name} {car.model.name}
          {car.year && ` · ${car.year}`}
        </div>

        <div className="text-destructive text-sm">
          Esta acción no se puede deshacer.
        </div>
      </div>
    </ConfirmDialog>
  );
}
