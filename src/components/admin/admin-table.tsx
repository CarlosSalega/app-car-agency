"use client";

import type { ReactNode } from "react";
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { WithPagination } from "@/components/with-pagination";
import type { PaginationProps } from "@/components/pagination";

export interface AdminColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data?: T[];
  columns: AdminColumn<T>[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: string | null;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  pagination?: PaginationProps;
  className?: string;
}

export function AdminTable<T>({
  data = [],
  columns,
  rowKey,
  isLoading,
  error,
  emptyState,
  loadingState,
  errorState,
  pagination,
  className,
}: AdminTableProps<T>) {
  const colSpan = columns.length;

  return (
    <div className={`h-full rounded-lg border ${className ?? ""}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading */}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={colSpan}>{loadingState ?? "Cargando..."}</TableCell>
            </TableRow>
          )}

          {/* Error */}
          {!isLoading && error && (
            <TableRow>
              <TableCell colSpan={colSpan}>{errorState ?? error}</TableCell>
            </TableRow>
          )}

          {/* Empty */}
          {!isLoading && !error && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={colSpan}>{emptyState ?? "Sin resultados"}</TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            !error &&
            data.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>

        {pagination && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={colSpan} className="p-0">
                <WithPagination pagination={pagination} />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
