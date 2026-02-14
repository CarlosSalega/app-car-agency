"use client";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
function Toast({
  message,
  type = "error",
  isVisible,
}: {
  message: string;
  type?: "error" | "success";
  isVisible: boolean;
}) {
  if (!isVisible) return null;
  return (
    <div className="animate-in slide-in-from-right fixed top-4 right-4 z-50">
      <div
        className={`rounded-md p-4 shadow-lg ${
          type === "error" ? "bg-destructive text-destructive-foreground" : "bg-green-600 text-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
}

interface DepositConfigProps {
  initialPercentage: number;
}
export function DepositConfig({ initialPercentage }: DepositConfigProps) {
  const [percentage, setPercentage] = useState(initialPercentage.toString());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
    isVisible: boolean;
  } | null>(null);
  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type, isVisible: true });
  };
  useEffect(() => {
    if (toast?.isVisible && !loading) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, loading]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const numValue = Number.parseFloat(percentage);
    if (isNaN(numValue)) {
      showToast("El porcentaje debe ser un número válido", "error");
      setLoading(false);
      return;
    }
    if (numValue < 0 || numValue > 100) {
      showToast("El porcentaje debe estar entre 0 y 100", "error");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/settings/deposit_percentage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: numValue,
          description: "Porcentaje de seña a recibir como parte de pago del valor del vehículo",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        let errorMessage = json.error || "Error desconocido";
        if (res.status === 401) {
          errorMessage = "No tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente.";
        } else if (res.status === 400) {
          errorMessage = json.error || "Los datos enviados no son válidos. Por favor, verifica el porcentaje.";
        } else if (res.status === 404) {
          errorMessage = "La configuración no pudo ser encontrada. Por favor, intenta nuevamente.";
        } else if (res.status === 500) {
          errorMessage = "Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.";
        }
        showToast(errorMessage, "error");
        setTimeout(() => setLoading(false), 1500);
        return;
      }
      showToast(`El porcentaje de seña se ha actualizado exitosamente a ${numValue}%`, "success");
      setTimeout(() => setLoading(false), 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      showToast(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.",
        "error",
      );
      console.error("Error al guardar la configuración:", errorMessage);
      setTimeout(() => setLoading(false), 1500);
    }
  };
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />}
      <Card className="max-w-2xl py-6">
        <CardHeader>
          <CardTitle>Porcentaje de Seña</CardTitle>
          <CardDescription>
            Configura el porcentaje de seña (depósito inicial) que se recibirá como parte de pago del valor del
            vehículo. Este porcentaje se aplicará al calcular el monto de la seña cuando un cliente reserve un vehículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="percentage">Porcentaje de Seña (%)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="max-w-[200px]"
                  required
                />
                <span className="text-muted-foreground text-sm">% del valor del vehículo</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Ejemplo: Si el valor del vehículo es $10,000 y el porcentaje es 30%, la seña sería de $3,000.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
