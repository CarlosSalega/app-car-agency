import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { CarForm } from "@/components/cars/car-form/car-form";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuthSession();

  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      brand: true,
      model: true,
      tags: true,
      location: true,
    },
  });

  if (!car) {
    redirect("/admin/cars");
  }

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-8">
        <CarForm car={car} mode="edit" />
      </div>
    </div>
  );
}
