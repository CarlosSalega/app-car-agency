import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import slugify from "slugify";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json({ error: "El nombre del tag es requerido" }, { status: 400 });
    }

    // Convertir el nombre a slug para almacenamiento
    const slugName = slugify(data.name.trim(), {
      lower: true,
      strict: true,
    });

    // Verificar si ya existe otro tag con ese nombre
    const existingTag = await prisma.tag.findUnique({
      where: { name: slugName },
    });

    if (existingTag && existingTag.id !== id) {
      return NextResponse.json({ error: "Ya existe un tag con este nombre" }, { status: 409 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: slugName,
        description: data.description?.trim() || null,
        color: data.color?.trim() || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    // Log action
    await prisma.log.create({
      data: {
        action: "UPDATE",
        entity: "Tag",
        entityId: tag.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      tag,
      message: "Tag actualizado exitosamente",
    });
  } catch (error) {
    console.error("[TAGS] Update tag error:", error);
    return NextResponse.json({ error: "Error al actualizar el tag" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar si hay autos asociados
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cars: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag no encontrado" }, { status: 404 });
    }

    if (tag._count.cars > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar el tag porque tiene autos asociados",
        },
        { status: 400 },
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    // Log action
    await prisma.log.create({
      data: {
        action: "DELETE",
        entity: "Tag",
        entityId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tag eliminado exitosamente",
    });
  } catch (error) {
    console.error("[TAGS] Delete tag error:", error);
    return NextResponse.json({ error: "Error al eliminar el tag" }, { status: 500 });
  }
}
