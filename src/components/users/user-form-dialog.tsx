"use client";

import { useEffect, useState } from "react";
import type { Role } from "@prisma/client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { UserWithCount } from "@/types/users";

interface UserFormDialogProps {
  open: boolean;
  user: UserWithCount | null;
  onClose: () => void;
  onSuccess: (user: UserWithCount) => void;
}

type FormData = {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
};

const DEFAULT_FORM: FormData = {
  name: "",
  email: "",
  password: "",
  role: "COLLABORATOR",
  isActive: true,
};

export function UserFormDialog({ open, user, onClose, onSuccess }: UserFormDialogProps) {
  const isEditing = Boolean(user?.id);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setFormData(DEFAULT_FORM);
      return;
    }

    setFormData({
      name: user.name ?? "",
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const url = isEditing ? `/api/users/${user!.id}` : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.error ?? "Error al guardar el usuario");
      setIsSubmitting(false);
      return;
    }

    onSuccess(data.user);
    setIsSubmitting(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modificá los datos del usuario" : "Creá un nuevo usuario del sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Contraseña {isEditing && "(dejar vacío para no modificar)"}</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as Role })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="COLLABORATOR">Colaborador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    isActive: value === "active",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
