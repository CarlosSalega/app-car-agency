import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

import { revalidateCar, revalidateCars } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function generateSlugBase(brand: string, model: string, version: string, year: number, km: number) {
  return slugify(`${brand} ${model} ${version} ${year} ${km}`, {
    lower: true,
    strict: true,
  });
}

async function generateUniqueSlug(base: string) {
  let slug = base;
  while (await prisma.car.findFirst({ where: { slug } })) {
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();

    const brand = await prisma.brand.findUnique({
      where: { id: data.brandId },
    });
    const model = await prisma.model.findUnique({
      where: { id: data.modelId },
    });

    if (!brand || !model) {
      return NextResponse.json({ error: "Marca o modelo no encontrados" }, { status: 400 });
    }

    const slug = await generateUniqueSlug(
      generateSlugBase(brand.name, model.name, data.version ?? "", Number(data.year), Number(data.kilometers)),
    );

    const car = await prisma.car.create({
      data: {
        title: data.title,
        slug,
        brandId: data.brandId,
        modelId: data.modelId,
        version: data.version,
        color: data.color,
        year: Number(data.year),
        kilometers: Number(data.kilometers),
        type: data.type,
        fuelType: data.fuelType,
        transmission: data.transmission,
        price: Number(data.price),
        currency: data.currency,
        description: data.description,
        locationId: data.locationId ?? null,
        status: data.status,
        images: Array.isArray(data.images) ? data.images : [],
        userId: session.user.id,
        tags: Array.isArray(data.tags) ? { connect: data.tags.map((id: string) => ({ id })) } : undefined,
      },
    });

    await prisma.log.create({
      data: {
        action: "CREATE",
        entity: "Car",
        entityId: car.id,
        userId: session.user.id,
      },
    });

    revalidateCars();
    revalidateCar(car.id);

    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("Error creating car:", error);

    if (error instanceof Error) {
      if (error.message.includes("unique constraint")) {
        return NextResponse.json(
          {
            error: "Ese slug o patent ya existe. Intenta con valores diferentes.",
          },
          { status: 400 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Error al crear el auto" }, { status: 500 });
  }
}
