import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { ImageService } from "@/lib/images/image-service";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        model: true,
        user: true,
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Auto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: "Error al obtener el auto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    if (car.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permiso para eliminar este vehículo" }, { status: 403 });
    }

    if (car.images.length > 0) {
      await Promise.all(car.images.map((key) => ImageService.delete(key)));
    }

    await prisma.car.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        images: [],
      },
    });

    await prisma.log.create({
      data: {
        action: "DELETE",
        entity: "Car",
        entityId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar el auto" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const existingCar = await prisma.car.findUnique({ where: { id } });

    if (!existingCar) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    if (existingCar.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permiso para editar este vehículo" }, { status: 403 });
    }

    const newImages: string[] = Array.isArray(data.images) ? data.images : [];

    const removedImages = existingCar.images.filter((img) => !newImages.includes(img));

    if (removedImages.length > 0) {
      await Promise.all(removedImages.map((key) => ImageService.delete(key)));
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        title: data.title,
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
        images: newImages,
        tags: Array.isArray(data.tags) ? { set: data.tags.map((id: string) => ({ id })) } : undefined,
      },
    });

    await prisma.log.create({
      data: {
        action: "UPDATE",
        entity: "Car",
        entityId: car.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar el auto" }, { status: 500 });
  }
}
