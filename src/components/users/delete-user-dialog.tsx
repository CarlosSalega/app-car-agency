"use client";

import type { UserWithCount } from "@/types/users";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteUserDialogProps {
  open: boolean;
  user: UserWithCount | null;
  onCancel: () => void;
  onConfirm: (user: UserWithCount) => Promise<void>;
}

export function DeleteUserDialog({ open, user, onCancel, onConfirm }: DeleteUserDialogProps) {
  if (!user) return null;

  return (
    <ConfirmDialog
      open={open}
      title="Desactivar usuario"
      description={
        <>
          ¿Estás seguro de que querés desactivar <span className="font-medium">{user.name || user.email}</span>?
          <br />
          El usuario no podrá acceder al sistema.
        </>
      }
      confirmLabel="Desactivar"
      destructive
      onCancel={onCancel}
      onConfirm={() => onConfirm(user)}
    />
  );
}
