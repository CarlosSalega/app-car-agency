"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface DeleteCarDialogProps {
  open: boolean;
  car: {
    id: string;
    title: string;
    subtitle?: string;
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

  const handleConfirm = async () => {
    await onConfirm(car.id);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar vehículo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés eliminar este vehículo?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="font-medium">{car.title}</div>

          <div className="text-muted-foreground text-sm">
            {car.brand.name} {car.model.name} · {car.year}
          </div>

          <div className="text-destructive text-sm">
            Esta acción no se puede deshacer.
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>

          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
