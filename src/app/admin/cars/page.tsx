import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { CarsTable } from "@/components/cars-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface AdminCarsPageProps {
  searchParams: {
    page?: string;
  };
}

const ITEMS_PER_PAGE = 5;

export const dynamic = "force-dynamic";

export default async function AdminCarsPage({
  searchParams,
}: AdminCarsPageProps) {
  const session = await requireAuthSession();

  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const totalCars = await prisma.car.count({
    where: { deletedAt: null },
  });

  const totalPages = Math.ceil(totalCars / ITEMS_PER_PAGE);

  const cars = await prisma.car.findMany({
    where: { deletedAt: null },
    include: {
      brand: true,
      model: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: ITEMS_PER_PAGE,
  });

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-row-reverse items-center">
          <Button asChild>
            <Link href="/admin/cars/new">
              <Plus className="mr-2 size-4" />
              Agregar Vehículo
            </Link>
          </Button>
        </div>

        <CarsTable
          cars={cars}
          pagination={{
            currentPage: currentPage,
            totalPages: totalPages,
            baseUrl: "/admin/cars",
          }}
        />
      </div>
    </div>
  );
}
