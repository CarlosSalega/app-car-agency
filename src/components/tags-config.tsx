"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EditButton, DeleteButton } from "./admin/admin-action-buttons";
import { ActiveStatusBadge } from "./status-badges";
import type { Tag } from "@prisma/client";
import { formatTagName } from "@/lib/tag-utils";

interface TagsConfigProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagsConfig({ tags, onTagsChange }: TagsConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      color: "",
      isActive: true,
    });
    setIsOpen(true);
  };

  const openEdit = (t: Tag) => {
    setEditing(t);
    setForm({
      name: formatTagName(t.name),
      description: t.description || "",
      color: t.color || "",
      isActive: t.isActive,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este tag?")) return;

    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Error al eliminar el tag");
        return;
      }

      onTagsChange(tags.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error al eliminar el tag");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing ? `/api/tags/${editing.id}` : "/api/tags";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Error al guardar el tag");
        return;
      }

      if (editing) {
        onTagsChange(tags.map((t) => (t.id === json.tag.id ? json.tag : t)));
      } else {
        onTagsChange([json.tag, ...tags]);
      }

      setIsOpen(false);
    } catch (err) {
      alert("Error al guardar el tag");
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
              Crear Etiqueta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Etiqueta" : "Nueva Etiqueta"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la etiqueta *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ej: Único Dueño"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descripción (opcional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={form.color || "#3b82f6"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        color: e.target.value,
                      })
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        color: e.target.value,
                      })
                    }
                    placeholder="#3b82f6"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isActive: e.target.checked,
                      })
                    }
                    className="size-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Activo
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
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
              <TableHead>Descripción</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground text-center"
                >
                  No hay tags registrados
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    {formatTagName(tag.name)}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      ({tag.name})
                    </span>
                  </TableCell>
                  <TableCell>
                    {tag.description || (
                      <span className="text-muted-foreground">
                        Sin descripción
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {tag.color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="size-6 rounded border"
                          style={{
                            backgroundColor: tag.color,
                          }}
                        />
                        <span className="text-xs">{tag.color}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin color</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ActiveStatusBadge
                      isActive={tag.isActive}
                      activeLabel="Activo"
                      inactiveLabel="Inactivo"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditButton onClick={() => openEdit(tag)} />
                      <DeleteButton onClick={() => handleDelete(tag.id)} />
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
