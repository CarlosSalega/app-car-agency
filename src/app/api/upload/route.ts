import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { CloudinaryService } from "@/lib/cloudinary-service";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Utiliza la manera correcta para subir archivos" },
    { status: 400 },
  );
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body || {};

    if (!url) {
      return NextResponse.json(
        { error: "No se proporcionó URL" },
        { status: 400 },
      );
    }

    if (!url.includes("cloudinary.com")) {
      return NextResponse.json(
        {
          error: "URL inválida. Solo se pueden eliminar imágenes validas",
        },
        { status: 400 },
      );
    }

    const carsWithImage = await prisma.car.findMany({
      where: {
        OR: [
          { images: { contains: url } },
          { images: { contains: encodeURIComponent(url) } },
        ],
      },
      select: { id: true, userId: true },
    });

    if (carsWithImage.length > 0) {
      const hasPermission = carsWithImage.some(
        (car) =>
          car.userId === session.user.id || session.user.role === "ADMIN",
      );

      if (!hasPermission) {
        return NextResponse.json(
          {
            error:
              "No tienes permiso para eliminar esta imagen. Pertenece a otro vehículo.",
          },
          { status: 403 },
        );
      }
    }

    const result = await CloudinaryService.deleteImage(url);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Error al eliminar la imagen" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
