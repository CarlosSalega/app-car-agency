"use client";

import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  open: boolean;
  className?: string;
}

export function HamburgerButton({ open, className }: HamburgerButtonProps) {
  return (
    <div className={cn("relative size-4 shrink-0 text-current", className)}>
      <span
        className={cn(
          "absolute top-0 left-0 h-0.5 w-full origin-center bg-current transition-transform duration-300 ease-in-out",
          open && "translate-y-[7px] rotate-45",
        )}
      />

      <span
        className={cn(
          "absolute top-[7px] left-0 h-0.5 w-full bg-current transition-opacity duration-200",
          open && "opacity-0",
        )}
      />

      <span
        className={cn(
          "absolute bottom-0 left-0 h-0.5 w-full origin-center bg-current transition-transform duration-300 ease-in-out",
          open && "-translate-y-[7px] -rotate-45",
        )}
      />
    </div>
  );
}
