import { redirect } from "next/navigation";
import { requireAuthSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfigTabs } from "@/components/config-tabs";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const session = await requireAuthSession();

  if (session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const [brands, locations, tags, depositSetting] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        models: {
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.location.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.settings.findUnique({
      where: { key: "deposit_percentage" },
    }),
  ]);

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader user={session.user} />

      <div className="container mx-auto px-4 py-6">
        <ConfigTabs
          initialBrands={brands}
          initialLocations={locations}
          initialTags={tags}
          initialDepositPercentage={depositSetting ? Number.parseFloat(depositSetting.value) : 30}
        />
      </div>
    </div>
  );
}
