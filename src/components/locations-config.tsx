"use client";

import type { Location } from "@prisma/client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { EditButton, DeleteButton } from "./admin/admin-action-buttons";
import { ActiveStatusBadge } from "./status-badges";

interface LocationsConfigProps {
  locations: Location[];
  onLocationsChange: (locations: Location[]) => void;
}

export function LocationsConfig({ locations, onLocationsChange }: LocationsConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      latitude: "",
      longitude: "",
      isActive: true,
    });
    setIsOpen(true);
  };

  const openEdit = (l: Location) => {
    setEditing(l);
    setForm({
      name: l.name,
      address: l.address,
      city: l.city,
      state: l.state,
      zipCode: l.zipCode || "",
      phone: l.phone || "",
      email: l.email || "",
      latitude: l.latitude?.toString() || "",
      longitude: l.longitude?.toString() || "",
      isActive: l.isActive,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta sucursal?")) return;

    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Error al eliminar la sucursal");
        return;
      }

      onLocationsChange(locations.filter((l) => l.id !== id));
    } catch (err) {
      alert("Error al eliminar la sucursal");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing ? `/api/locations/${editing.id}` : "/api/locations";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Error al guardar la sucursal");
        return;
      }

      if (editing) {
        onLocationsChange(locations.map((l) => (l.id === json.location.id ? json.location : l)));
      } else {
        onLocationsChange([json.location, ...locations]);
      }

      setIsOpen(false);
    } catch (err) {
      alert("Error al guardar la sucursal");
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
              Agregar Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Sucursal" : "Nueva Sucursal"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="isActive">Estado</Label>
                  <div className="flex items-center gap-2 pt-2">
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
                      Activa
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Provincia/Estado *</Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        state: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal</Label>
                  <Input
                    id="zipCode"
                    value={form.zipCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        zipCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        latitude: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        longitude: e.target.value,
                      })
                    }
                  />
                </div>
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
              <TableHead>Dirección</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Provincia</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center">
                  No hay sucursales registradas
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.city}</TableCell>
                  <TableCell>{location.state}</TableCell>
                  <TableCell>
                    <ActiveStatusBadge isActive={location.isActive} activeLabel="Activa" inactiveLabel="Inactiva" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditButton onClick={() => openEdit(location)} />
                      <DeleteButton onClick={() => handleDelete(location.id)} />
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
