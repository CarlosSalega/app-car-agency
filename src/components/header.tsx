"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { HEADER_CONTENT } from "@/data/header";
import { HERO_CONTENT } from "@/data/hero";
import { AdminDropdown } from "@/components/admin/admin-dropdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

type User = { name: string | null; email: string; role: string } | null;

export function Header() {
  const { logo, brand, api } = HEADER_CONTENT;
  const { search } = HERO_CONTENT;

  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    let mounted = true;

    fetch(api.authEndpoint)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setUser(data?.user || null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, [api.authEndpoint]);

  return (
    <header className="border-border bg-card/50 border-b backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={logo.className}
          />
          <span className={brand.className}>{brand.text}</span>
        </Link>

        <form
          action="/autos"
          method="GET"
          className="mx-auto hidden max-w-2xl md:block"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                name="search"
                placeholder={search.placeholder}
                className="h-9"
              />
            </div>

            <Button type="submit" className="h-9 px-6">
              <Search className="size-5" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-primary text-background hover:bg-primary hover:text-background md:hidden"
                aria-label="Buscar"
              >
                <Search className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              avoidCollisions
              collisionPadding={12}
              className="max-w-64 lg:hidden"
            >
              <form action="/autos" method="GET">
                <div className="relative">
                  <Input
                    name="search"
                    placeholder={search.placeholder}
                    autoFocus
                    className="truncate"
                  />
                </div>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <AdminDropdown user={user} />
          ) : (
            <Link href="/admin">
              <Button
                variant="outline"
                className="hover:bg-foreground hover:text-background transition-colors duration-300 ease-in-out"
              >
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
