"use client";
import { CreditCard } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface ReserveButtonProps {
  carId: string;
  carTitle: string;
  price: number;
}
export function ReserveButton({ carId, carTitle, price }: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(30);
  useEffect(() => {
    fetch("/api/settings/deposit_percentage")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data?.value) {
          setDepositPercentage(Number.parseFloat(data.value));
        }
      })
      .catch(() => {
        console.error("Error al obtener la configuración de seña");
      });
  }, []);
  const handleReserve = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("¡Reserva simulada exitosa! En producción, esto redirigiría a MercadoPago.");
      setIsProcessing(false);
      setIsOpen(false);
    }, 2000);
  };
  return (
    <>
      <Button className="px-8" onClick={() => setIsOpen(true)}>
        <CreditCard className="mr-2 h-5 w-5" />
        Reservar este auto
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservar vehículo</DialogTitle>
            <DialogDescription>Estás por reservar: {carTitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Monto de reserva</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                }).format(price * (depositPercentage / 100))}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">{depositPercentage}% del valor total</p>
            </div>
            <p className="text-muted-foreground text-sm">
              Al confirmar, serás redirigido a MercadoPago para completar el pago de la reserva.
            </p>
            <Button onClick={handleReserve} disabled={isProcessing} className="w-full">
              {isProcessing ? "Procesando..." : "Confirmar reserva"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
