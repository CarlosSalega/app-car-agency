import { requireAuthSession } from "@/lib/session";
import { AdminHeader } from "@/components/admin/admin-header";
import { CarForm } from "@/components/cars/car-form/car-form";

export default async function NewCarPage() {
  const session = await requireAuthSession();

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-8">
        <CarForm mode="create" />
      </div>
    </div>
  );
}
