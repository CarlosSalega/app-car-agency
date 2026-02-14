"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Error al iniciar sesión");
        setIsLoading(false);
        return;
      }

      toast.success("¡Inicio de sesión exitoso!");
      setIsLoading(false);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error("Error de conexión con el servidor");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="mx-auto w-full max-w-sm py-6">
        <CardHeader>
          <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                <div className="flex h-5 items-center">
                  {errors.email && (
                    <p className="text-destructive animate-in fade-in flex items-center gap-1 text-sm">
                      <AlertCircle className="size-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                <div className="flex h-5 items-center">
                  {errors.password && (
                    <p className="text-destructive animate-in fade-in flex items-center gap-1 text-sm">
                      <AlertCircle className="size-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="text-base">Ingresando...</span>
              ) : (
                <span className="text-base">Ingresar</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
