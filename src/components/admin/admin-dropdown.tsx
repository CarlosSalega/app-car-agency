"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HamburgerButton } from "@/components/ui/hamburger-button";

import { ADMIN_NAVIGATION } from "@/data/admin-navigation";
import { isActiveRoute } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface AdminDropdownProps {
  user: {
    name: string | null;
    email: string;
    role: "ADMIN" | "COLLABORATOR";
  };
}

export function AdminDropdown({ user }: AdminDropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Menú de usuario"
          type="button"
          className="flex size-9 items-center justify-center rounded-md"
        >
          <HamburgerButton open={open} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
            <p className="text-muted-foreground text-xs capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {ADMIN_NAVIGATION.filter(
          (item) =>
            item.showInDropdown &&
            (!item.roles || item.roles.includes(user.role)),
        ).map((item) => {
          const Icon = item.icon;

          if (item.action === "logout") {
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={handleLogout}
                className="focus:text-background"
              >
                {Icon && <Icon className="focus:text-background mr-2 size-4" />}
                {item.label}
              </DropdownMenuItem>
            );
          }

          const active = isActiveRoute(pathname, item.href!);

          return (
            <DropdownMenuItem key={item.id} asChild>
              <Link
                href={item.href!}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // layout base
                  "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none",

                  // hover normal SOLO para no-activos
                  !active &&
                    "data-[highlighted]:bg-primary data-[highlighted]:text-background",

                  // neutralizar highlighted cuando es activo
                  active &&
                    "data-[highlighted]:text-primary data-[highlighted]:bg-transparent",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "mr-2 size-4 shrink-0",

                      // estado base
                      active ? "text-primary" : "text-current",

                      // neutralizar highlighted en activo
                      active && "data-[highlighted]:text-primary",
                    )}
                  />
                )}

                <span
                  className={cn(
                    "inline-block",

                    // activo
                    active &&
                      "text-primary border-primary -mb-1 border-b-2 pb-0.5",

                    // neutralizar highlighted
                    active && "data-[highlighted]:no-border",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
