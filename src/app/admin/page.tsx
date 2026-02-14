import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivity } from "@/components/recent-activity";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAuthSession();

  const isAdmin = session.user.role === "ADMIN";

  const [totalCars, availableCars, reservedCars, soldCars, totalVisits] = await Promise.all([
    prisma.car.count({ where: { deletedAt: null } }),
    prisma.car.count({
      where: { status: "AVAILABLE", deletedAt: null },
    }),
    prisma.car.count({
      where: { status: "RESERVED", deletedAt: null },
    }),
    prisma.car.count({ where: { status: "SOLD", deletedAt: null } }),
    prisma.visit.count(),
  ]);

  const recentLogs = await prisma.log.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <>
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-6">
        {isAdmin ? (
          <>
            <DashboardStats
              totalCars={totalCars}
              availableCars={availableCars}
              reservedCars={reservedCars}
              soldCars={soldCars}
              totalVisits={totalVisits}
            />

            <div className="mt-8">
              <RecentActivity logs={recentLogs} />
              <div className="mt-4 text-center">
                <Link
                  href="/admin/activity"
                  className="text-primary hover:text-primary/80 inline-flex items-center text-sm transition-colors hover:underline"
                >
                  Ver toda la actividad del sistema
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Bienvenido, {session.user.name}. Usá el menú para gestionar los vehículos.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
