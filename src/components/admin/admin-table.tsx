"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PaginationProps } from "@/components/pagination";
import { WithPagination } from "@/components/with-pagination";

interface AdminTableProps {
  header: ReactNode;
  body: ReactNode;
  footerColSpan?: number;
  pagination?: PaginationProps;
  className?: string;
}

export function AdminTable({
  header,
  body,
  pagination,
  footerColSpan = 1,
  className,
}: AdminTableProps) {
  return (
    <div className={`h-full rounded-lg border ${className ?? ""}`}>
      <Table>
        <TableHeader className="[&_tr:hover]:bg-transparent">
          {header}
        </TableHeader>

        <TableBody>{body}</TableBody>

        {pagination && (
          <TableFooter className="bg-background [&_tr:hover]:bg-transparent">
            <TableRow>
              <TableCell colSpan={footerColSpan} className="p-0">
                <WithPagination pagination={pagination} />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
