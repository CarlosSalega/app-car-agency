import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { ImageService } from "@/lib/images/image-service";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "La imagen no debe superar 10MB" },
        { status: 400 },
      );
    }

    const result = await ImageService.upload(file);

    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.url,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key } = body || {};

    if (!key) {
      return NextResponse.json(
        { error: "No se proporcionó key" },
        { status: 400 },
      );
    }

    const carsWithImage = await prisma.car.findMany({
      where: {
        images: {
          has: key,
        },
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

    const result = await ImageService.delete(key);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Error al eliminar la imagen" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
