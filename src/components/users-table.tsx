"use client";

import type React from "react";
import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AdminTable } from "@/components/admin/admin-table";
import { PaginationProps } from "@/components/pagination";
import { ActionButtonsGroup } from "@/components/admin/admin-action-buttons";
import { UserRoleBadge, ActiveStatusBadge } from "@/components/status-badges";

import type { Role } from "@prisma/client";

export type UserWithCount = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  _count: {
    cars: number;
  };
};

interface UsersTableProps {
  initialUsers: UserWithCount[];
  pagination?: PaginationProps;
  currentPage?: number;
  totalPages?: number;
}

export function UsersTable({
  initialUsers,
  pagination,
  currentPage,
  totalPages,
}: UsersTableProps) {
  const [users, setUsers] = useState<UserWithCount[]>(initialUsers);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCount | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithCount | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COLLABORATOR" as Role,
    isActive: true,
  });

  const finalPagination =
    pagination ||
    (currentPage && totalPages
      ? {
          currentPage,
          totalPages,
          baseUrl: "?",
        }
      : undefined);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "COLLABORATOR",
      isActive: true,
    });
  };

  const openDeleteDialog = (user: UserWithCount) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userToDelete.id ? { ...user, isActive: false } : user,
          ),
        );
        closeDeleteDialog();
      } else {
        const error = await res.json();
        alert(error.error || "Error al desactivar el usuario");
      }
    } catch {
      alert("Error al desactivar el usuario");
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: UserWithCount) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (editingUser) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === data.user.id
                ? { ...data.user, _count: user._count }
                : user,
            ),
          );
        } else {
          const newUser: UserWithCount = {
            ...data.user,
            _count: { cars: 0 },
          };
          setUsers((prev) => [newUser, ...prev]);
        }

        setIsDialogOpen(false);
        setEditingUser(null);
        resetForm();
      } else {
        alert(data.error || "Error al guardar el usuario");
      }
    } catch {
      alert("Error al guardar el usuario");
    }
  };

  const tableHeader = (
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Rol</TableHead>
      <TableHead>Vehículos</TableHead>
      <TableHead>Estado</TableHead>
      <TableHead className="text-right">Acciones</TableHead>
    </TableRow>
  );

  const tableBody = (
    <>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell className="font-medium">{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <UserRoleBadge role={user.role} />
          </TableCell>
          <TableCell>{user._count.cars}</TableCell>
          <TableCell>
            <ActiveStatusBadge isActive={user.isActive} />
          </TableCell>
          <TableCell className="text-right">
            <ActionButtonsGroup
              editOnClick={() => openEditDialog(user)}
              onDelete={() => openDeleteDialog(user)}
              deleteDisabled={!user.isActive}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <>
      <div className="mb-6 flex flex-row-reverse items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <UserPlus className="mr-2 size-4" />
              Agregar Usuario
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Modifica los datos del usuario"
                  : "Crea un nuevo usuario del sistema"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Contraseña {editingUser && "(dejar vacío para no cambiar)"}
                </Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUser}
                />
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as Role })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="COLLABORATOR">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingUser && (
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

              <div className="flex gap-2">
                <Button type="submit">Guardar</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AdminTable
        header={tableHeader}
        body={tableBody}
        pagination={finalPagination}
        footerColSpan={6}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desactivar usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés desactivar{" "}
              <span className="font-medium">
                {userToDelete?.name || userToDelete?.email}
              </span>
              ?
              <br />
              El usuario no podrá acceder al sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Desactivar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
