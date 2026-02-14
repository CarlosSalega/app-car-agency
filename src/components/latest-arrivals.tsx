import { CarCard } from "@/components/cars/car-card";
import { getLatestCars } from "@/lib/queries/cars";

export async function LatestArrivals() {
  const cars = await getLatestCars(6);

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
