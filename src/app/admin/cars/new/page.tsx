import { AdminHeader } from "@/components/admin";
import { CarForm } from "@/components/cars";
import { requireAuthSession } from "@/lib/auth";

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
