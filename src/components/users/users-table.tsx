"use client";

import type { PaginationProps } from "@/components/pagination";
import type { UserWithCount } from "@/types/users";

import { UserPlus } from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { getUsersColumns } from "@/components/users/users-columns";
import { useUsersTable } from "@/components/users/users-table-actions";

interface UsersTableProps {
  initialUsers: UserWithCount[];
  pagination?: PaginationProps;
}

export function UsersTable({ initialUsers, pagination }: UsersTableProps) {
  const { users, isLoading, editingUser, userToDelete, setEditingUser, setUserToDelete, upsertUser, deactivateUser } =
    useUsersTable(initialUsers);

  const columns = getUsersColumns({
    onEdit: setEditingUser,
    onDelete: setUserToDelete,
  });

  return (
    <>
      <div className="mb-6 flex flex-row-reverse">
        <Button onClick={() => setEditingUser({} as UserWithCount)}>
          <UserPlus className="mr-2 size-4" />
          Agregar Usuario
        </Button>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        emptyState="No hay usuarios"
        pagination={pagination}
      />

      <UserFormDialog
        user={editingUser}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={upsertUser}
      />

      <DeleteUserDialog
        user={userToDelete}
        open={!!userToDelete}
        onCancel={() => setUserToDelete(null)}
        onConfirm={deactivateUser}
      />
    </>
  );
}
