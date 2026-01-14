import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { UsersTable } from "@/components/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAuthSession();

  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { cars: true },
      },
    },
  });

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-6">
        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
