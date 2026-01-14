"use client";

import { Search } from "lucide-react";

import { HERO_CONTENT } from "@/data/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export function HeaderSearch() {
  const { search } = HERO_CONTENT;

  return (
    <>
      {/* Desktop search */}
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

      {/* Mobile search */}
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
            <Input
              name="search"
              placeholder={search.placeholder}
              autoFocus
              className="truncate"
            />
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
