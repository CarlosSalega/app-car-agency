"use client";

import type { Brand, Model } from "@prisma/client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { EditButton, DeleteButton } from "./admin/admin-action-buttons";

type BrandWithModels = Brand & {
  models: Model[];
};

interface BrandsConfigProps {
  brands: BrandWithModels[];
  onBrandsChange: (brands: BrandWithModels[]) => void;
}

export function BrandsConfig({ brands, onBrandsChange }: BrandsConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "" });
    setIsOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm({ name: b.name });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta marca?")) return;

    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Error al eliminar la marca");
        return;
      }

      onBrandsChange(brands.filter((b) => b.id !== id));
    } catch (err) {
      alert("Error al eliminar la marca");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing ? `/api/brands/${editing.id}` : "/api/brands";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Error al guardar la marca");
        return;
      }

      if (editing) {
        onBrandsChange(brands.map((b) => (b.id === json.brand.id ? json.brand : b)));
      } else {
        onBrandsChange([json.brand, ...brands]);
      }

      setIsOpen(false);
    } catch (err) {
      alert("Error al guardar la marca");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              Agregar Marca
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Marca" : "Nueva Marca"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Marca</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : editing ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Modelos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground text-center">
                  No hay marcas registradas
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>{brand.models?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditButton onClick={() => openEdit(brand)} />
                      <DeleteButton onClick={() => handleDelete(brand.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
