"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  className?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl = "?", className = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}`;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        className="hover:bg-primary hover:text-background"
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="size-5" />
          </Link>
        ) : (
          <ChevronLeft className="text-ring size-5" />
        )}
      </Button>

      <span className="text-muted-foreground text-sm">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        className="hover:bg-primary hover:text-background"
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={buildUrl(currentPage + 1)}>
            <ChevronRight className="size-5" />
          </Link>
        ) : (
          <ChevronRight className="text-ring size-5" />
        )}
      </Button>
    </div>
  );
}
