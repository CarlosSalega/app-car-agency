import { NextResponse, type NextRequest } from "next/server";
import slugify from "slugify";

import { revalidateTags } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error al obtener los tags", error);
    return NextResponse.json({ error: "Error al obtener los tags" }, { status: 500 });
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
      return NextResponse.json({ error: "El nombre del tag es requerido" }, { status: 400 });
    }
    const slugName = slugify(data.name.trim(), {
      lower: true,
      strict: true,
    });
    const existingTag = await prisma.tag.findUnique({
      where: { name: slugName },
    });
    if (existingTag) {
      return NextResponse.json({ error: "Ya existe un tag con este nombre" }, { status: 409 });
    }
    const tag = await prisma.tag.create({
      data: {
        name: slugName,
        description: data.description?.trim() || null,
        color: data.color?.trim() || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdById: session.user.id,
      },
    });
    await prisma.log.create({
      data: {
        action: "CREATE",
        entity: "Tag",
        entityId: tag.id,
        userId: session.user.id,
      },
    });
    revalidateTags();
    return NextResponse.json({
      success: true,
      tag,
      message: "Tag creado exitosamente",
    });
  } catch (error) {
    console.error("[TAGS] Create tag error:", error);
    return NextResponse.json({ error: "Error al crear el tag" }, { status: 500 });
  }
}
