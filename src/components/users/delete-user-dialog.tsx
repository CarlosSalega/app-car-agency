"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { UserWithCount } from "@/types/users";

interface DeleteUserDialogProps {
  open: boolean;
  user: UserWithCount | null;
  onCancel: () => void;
  onConfirm: (user: UserWithCount) => Promise<void>;
}

export function DeleteUserDialog({
  open,
  user,
  onCancel,
  onConfirm,
}: DeleteUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar usuario</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés desactivar{" "}
            <span className="font-medium">{user.name || user.email}</span>
            ?
            <br />
            El usuario no podrá acceder al sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(user)}>
            Desactivar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
