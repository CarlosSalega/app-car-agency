import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { error: "El nombre de la sucursal es requerido" },
        { status: 400 },
      );
    }

    if (!data.address?.trim()) {
      return NextResponse.json(
        { error: "La dirección es requerida" },
        { status: 400 },
      );
    }

    if (!data.city?.trim()) {
      return NextResponse.json(
        { error: "La ciudad es requerida" },
        { status: 400 },
      );
    }

    if (!data.state?.trim()) {
      return NextResponse.json(
        { error: "La provincia/estado es requerido" },
        { status: 400 },
      );
    }

    const existingLocation = await prisma.location.findUnique({
      where: { name: data.name.trim() },
    });

    if (existingLocation && existingLocation.id !== id) {
      return NextResponse.json(
        { error: "Ya existe una sucursal con este nombre" },
        { status: 409 },
      );
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        zipCode: data.zipCode?.trim() || null,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        latitude: data.latitude ? Number.parseFloat(data.latitude) : null,
        longitude: data.longitude ? Number.parseFloat(data.longitude) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    await prisma.log.create({
      data: {
        action: "UPDATE",
        entity: "Location",
        entityId: location.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      location,
      message: "Sucursal actualizada exitosamente",
    });
  } catch (error) {
    console.error("[SUCURSALES] Error al actualizar la sucursal:", error);
    return NextResponse.json(
      { error: "Error al actualizar la sucursal" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cars: true,
          },
        },
      },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Sucursal no encontrada" },
        { status: 404 },
      );
    }

    if (location._count.cars > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar la sucursal porque tiene autos asociados",
        },
        { status: 400 },
      );
    }

    await prisma.location.delete({
      where: { id },
    });

    await prisma.log.create({
      data: {
        action: "DELETE",
        entity: "Location",
        entityId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sucursal eliminada exitosamente",
    });
  } catch (error) {
    console.error("[SUCURSALES] Error al eliminar la sucursal:", error);
    return NextResponse.json(
      { error: "Error al eliminar la sucursal" },
      { status: 500 },
    );
  }
}
