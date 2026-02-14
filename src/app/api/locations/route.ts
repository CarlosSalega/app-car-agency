import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error al obtener las sucursales", error);
    return NextResponse.json({ error: "Error al obtener las sucursales" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const data = await request.json();
    if (!data.name?.trim()) {
      return NextResponse.json({ error: "El nombre de la sucursal es requerido" }, { status: 400 });
    }
    if (!data.address?.trim()) {
      return NextResponse.json({ error: "La dirección es requerida" }, { status: 400 });
    }
    if (!data.city?.trim()) {
      return NextResponse.json({ error: "La ciudad es requerida" }, { status: 400 });
    }
    if (!data.state?.trim()) {
      return NextResponse.json({ error: "La provincia/estado es requerido" }, { status: 400 });
    }
    const existingLocation = await prisma.location.findUnique({
      where: { name: data.name.trim() },
    });
    if (existingLocation) {
      return NextResponse.json({ error: "Ya existe una sucursal con este nombre" }, { status: 409 });
    }
    const location = await prisma.location.create({
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
        createdById: session.user.id,
      },
    });
    await prisma.log.create({
      data: {
        action: "CREATE",
        entity: "Location",
        entityId: location.id,
        userId: session.user.id,
      },
    });
    return NextResponse.json({
      success: true,
      location,
      message: "Sucursal creada exitosamente",
    });
  } catch (error) {
    console.error("[SUCURSALES] Error al crear la sucursal:", error);
    return NextResponse.json({ error: "Error al crear la sucursal" }, { status: 500 });
  }
}
