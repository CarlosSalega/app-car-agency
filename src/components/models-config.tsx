"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditButton, DeleteButton } from "./admin/admin-action-buttons";
import type { Brand, Model } from "@prisma/client";
type BrandWithModels = Brand & {
  models: Model[];
};
type ModelWithBrand = Model & {
  brand?: {
    name: string;
  };
};
interface ModelsConfigProps {
  brands: BrandWithModels[];
}
export function ModelsConfig({ brands }: ModelsConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);
  const [form, setForm] = useState({ name: "", brandId: "" });
  const [loading, setLoading] = useState(false);
  const models = brands.flatMap((brand) => brand.models);
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", brandId: brands[0]?.id || "" });
    setIsOpen(true);
  };
  const openEdit = (m: Model) => {
    setEditing(m);
    setForm({ name: m.name, brandId: m.brandId });
    setIsOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este modelo?")) return;
    try {
      const res = await fetch(`/api/models/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Error al eliminar el modelo");
        return;
      }
      window.location.reload();
    } catch (err) {
      alert("Error al eliminar el modelo");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editing ? `/api/models/${editing.id}` : "/api/models";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Error al guardar el modelo");
        return;
      }
      window.location.reload();
    } catch (err) {
      alert("Error al guardar el modelo");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} disabled={brands.length === 0}>
              <Plus className="mr-2 size-4" />
              Agregar Modelo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Modelo" : "Nuevo Modelo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandId">Marca</Label>
                <Select value={form.brandId} onValueChange={(value) => setForm({ ...form, brandId: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Modelo</Label>
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
      {brands.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          Primero debes crear al menos una marca para poder agregar modelos.
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground text-center">
                    No hay modelos registrados
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => {
                  const brand = brands.find((b) => b.id === model.brandId);
                  return (
                    <TableRow key={model.id}>
                      <TableCell>{brand?.name || "N/A"}</TableCell>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <EditButton onClick={() => openEdit(model)} />
                          <DeleteButton onClick={() => handleDelete(model.id)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
