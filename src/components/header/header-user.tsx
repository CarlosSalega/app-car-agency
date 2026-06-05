"use client";

import { Home, Menu, Phone, Car, LogIn } from "lucide-react";
import Link from "next/link";

import { AdminDropdown } from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type HeaderUserProps = {
  user: {
    name: string | null;
    email: string;
    role: "ADMIN" | "COLLABORATOR";
  } | null;
};

export function HeaderUser({ user }: HeaderUserProps) {
  return (
    <div className="flex items-center gap-2">
      {user ? (
        <AdminDropdown user={user} />
      ) : (
        <>
          {/* Mobile: hamburger menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-foreground hover:text-background transition-colors duration-300 ease-in-out"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Menú de navegación</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navegación</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-4 px-4">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="hover:text-foreground/80 flex items-center gap-3 text-lg font-medium transition-colors"
                    >
                      <Home className="size-5" />
                      Inicio
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/autos"
                      className="hover:text-foreground/80 flex items-center gap-3 text-lg font-medium transition-colors"
                    >
                      <Car className="size-5" />
                      Catálogo
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/contacto"
                      className="hover:text-foreground/80 flex items-center gap-3 text-lg font-medium transition-colors"
                    >
                      <Phone className="size-5" />
                      Contacto
                    </Link>
                  </SheetClose>

                  <hr className="my-2" />

                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="hover:text-foreground/80 flex items-center gap-3 text-lg font-medium transition-colors"
                    >
                      <LogIn className="size-5" />
                      Iniciar sesión
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop: login button */}
          <div className="hidden md:flex">
            <Link href="/admin">
              <Button
                variant="outline"
                className="hover:bg-foreground hover:text-background transition-colors duration-300 ease-in-out"
              >
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
