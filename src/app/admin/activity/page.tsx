import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { RecentActivity } from "@/components/recent-activity";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ActivityPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const LOGS_PER_PAGE = 10;

export const dynamic = "force-dynamic";

export default async function ActivityPage(props: ActivityPageProps) {
  const searchParams = await props.searchParams;
  const session = await requireAuthSession();

  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * LOGS_PER_PAGE;

  const totalLogs = await prisma.log.count();
  const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

  const logs = await prisma.log.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    skip,
    take: LOGS_PER_PAGE,
  });

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Actividad del Sistema</h1>
              <p className="text-muted-foreground mt-2">
                Registro completo de todas las actividades en el sistema
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Mostrando {logs.length} de {totalLogs} registros
          </p>
          <p className="text-muted-foreground text-sm">
            Página {currentPage} de {totalPages}
          </p>
        </div>

        <RecentActivity
          logs={logs}
          title="Actividad del Sistema"
          pagination={{
            currentPage,
            totalPages,
            baseUrl: "/admin/activity",
          }}
        />
      </div>
    </div>
  );
}
