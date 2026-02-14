import { CarCard } from "@/components/cars/car-card";
import { prisma } from "@/lib/db";

export async function LatestArrivals() {
  const cars = await prisma.car.findMany({
    where: {
      status: "AVAILABLE",
      deletedAt: null,
    },
    include: {
      brand: true,
      model: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <section>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}
