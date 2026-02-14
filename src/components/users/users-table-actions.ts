"use client";

import type { UserWithCount } from "@/types/users";

import { useState } from "react";

export function useUsersTable(initialUsers: UserWithCount[]) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<UserWithCount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserWithCount | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const upsertUser = (user: UserWithCount) => {
    setUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.map((u) => (u.id === user.id ? { ...user, _count: u._count } : u))
        : [{ ...user, _count: { cars: 0 } }, ...prev],
    );
  };

  const deactivateUser = async (user: UserWithCount) => {
    setIsLoading(true);
    await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: false } : u)));
    setUserToDelete(null);
    setIsLoading(false);
  };

  return {
    users,
    isLoading,
    editingUser,
    userToDelete,
    setEditingUser,
    setUserToDelete,
    upsertUser,
    deactivateUser,
  };
}
