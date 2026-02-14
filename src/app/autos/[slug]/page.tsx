import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer";
import { CarDetailGallery } from "@/components/cars/car-detail/car-detail-gallery";
import { CarDetailInfo } from "@/components/cars/car-detail/car-detail-info";
import { CarDetailSpecs } from "@/components/cars/car-detail/car-detail-specs";
import { ReserveButton } from "@/components/reserve-button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const car = await prisma.car.findUnique({
    where: { slug },
    include: {
      brand: true,
      model: true,
      location: true,
    },
  });

  if (!car || car.deletedAt) {
    return {
      title: "Auto no encontrado",
      description: "El vehículo que buscas no está disponible.",
    };
  }

  let images: string[] = [];

  try {
    images = typeof car.images === "string" ? JSON.parse(car.images) : car.images || [];
  } catch {
    images = [];
  }

  const firstImageKey = images[0];

  const firstImage = firstImageKey
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/images/${firstImageKey}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}${FALLBACK_IMAGE}`;

  const title = `${car.title} - ${car.brand.name} ${car.model.name}`;
  const description =
    `${car.title} ${car.year} - ${car.transmission} - ${car.fuelType} - ${car.kilometers.toLocaleString()} km. ${
      car.description || "Vehículo de calidad garantizada."
    }`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: car.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImage],
    },
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const car = await prisma.car.findUnique({
    where: { slug },
    include: {
      brand: true,
      model: true,
      location: true,
      tags: true,
    },
  });

  if (!car || car.deletedAt) {
    notFound();
  }

  let images: string[] = [];

  try {
    images = typeof car.images === "string" ? JSON.parse(car.images) : car.images || [];
  } catch {
    images = [];
  }

  prisma.visit
    .create({
      data: {
        carId: car.id,
      },
    })
    .catch(() => {});

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          <CarDetailGallery id={car.id} images={images} title={car.title} />
          <CarDetailInfo car={car} />
        </div>

        <CarDetailSpecs car={car} />

        <div className="mt-12 flex justify-center">
          <ReserveButton carId={car.id} carTitle={car.title} price={car.price} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
