import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CloudinaryService } from "@/lib/cloudinary-service";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
      return NextResponse.json(
        { error: "Auto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el auto" },
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
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (existingCar && existingCar.images) {
      let existingImages: string[] = [];
      try {
        if (
          typeof existingCar.images === "string" &&
          existingCar.images.trim().startsWith("[")
        ) {
          existingImages = JSON.parse(existingCar.images);
        } else if (typeof existingCar.images === "string") {
          existingImages = existingCar.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } catch (parseError) {
        existingImages = [];
      }

      if (existingImages.length > 0) {
        await CloudinaryService.deleteMultipleImages(existingImages);
      }
    }

    await prisma.car.update({
      where: { id },
      data: { deletedAt: new Date(), images: JSON.stringify([]) },
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
    return NextResponse.json(
      { error: "Error al eliminar el auto" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const requestData = await request.json();

    function normalizeImageUrl(imageInput: unknown): string {
      if (!imageInput) return "";
      const stringValue = String(imageInput).trim();
      try {
        if (/^https?:\/\//.test(stringValue)) {
          const urlObject = new URL(stringValue);
          return `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;
        }
      } catch {
        return stringValue;
      }
      return stringValue;
    }

    let normalizedImages: string[] = [];
    if (Array.isArray(requestData.images)) {
      normalizedImages = requestData.images
        .map((imageUrl: unknown) => normalizeImageUrl(imageUrl))
        .filter(Boolean);
    } else if (typeof requestData.images === "string") {
      const trimmedImages = requestData.images.trim();
      if (trimmedImages.startsWith("[")) {
        try {
          const parsedImages = JSON.parse(trimmedImages);
          normalizedImages = parsedImages
            .map((imageUrl: unknown) => normalizeImageUrl(imageUrl))
            .filter(Boolean);
        } catch {
          normalizedImages = [];
        }
      } else {
        normalizedImages = trimmedImages
          .split(",")
          .map((imageString: string) => normalizeImageUrl(imageString))
          .filter(Boolean);
      }
    }
    const imagesToStore = JSON.stringify(normalizedImages);

    const existingCar = await prisma.car.findUnique({ where: { id } });

    if (!existingCar) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 },
      );
    }

    if (
      existingCar.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "No tienes permiso para editar este vehículo" },
        { status: 403 },
      );
    }

    let existingImages: string[] = [];
    if (existingCar.images) {
      try {
        if (
          typeof existingCar.images === "string" &&
          existingCar.images.trim().startsWith("[")
        ) {
          existingImages = JSON.parse(existingCar.images);
        } else if (typeof existingCar.images === "string") {
          existingImages = existingCar.images
            .split(",")
            .map((imageString) => imageString.trim())
            .filter(Boolean);
        }
      } catch {
        existingImages = [];
      }
    }

    const normalizeUrlForComparison = (imageUrl: string): string => {
      try {
        if (/^https?:\/\//.test(imageUrl)) {
          const urlObject = new URL(imageUrl);
          return `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;
        }
      } catch {
        return String(imageUrl).trim();
      }
      return String(imageUrl).trim();
    };

    const normalizedNewImages = normalizedImages.map(normalizeUrlForComparison);
    const normalizedExistingImages = existingImages.map(
      normalizeUrlForComparison,
    );

    const removedImages = normalizedExistingImages.filter(
      (existingImageUrl) => !normalizedNewImages.includes(existingImageUrl),
    );

    if (removedImages.length > 0) {
      const removedOriginalUrls = existingImages.filter((originalUrl) => {
        const normalizedUrl = normalizeUrlForComparison(originalUrl);
        return removedImages.includes(normalizedUrl);
      });

      const actuallyRemovedUrls = removedOriginalUrls.filter((originalUrl) => {
        const normalizedUrl = normalizeUrlForComparison(originalUrl);
        return (
          !normalizedNewImages.includes(normalizedUrl) &&
          !normalizedImages.some((newImageUrl) => {
            const normalizedNewUrl = normalizeUrlForComparison(newImageUrl);
            return normalizedNewUrl === normalizedUrl;
          })
        );
      });

      const cloudinaryUrlsToDelete = actuallyRemovedUrls.filter(
        (url) => typeof url === "string" && /^https?:\/\//.test(url),
      );

      const validUrlsToDelete = cloudinaryUrlsToDelete.filter((url) => {
        const normalizedUrl = normalizeUrlForComparison(url);
        return normalizedExistingImages.includes(normalizedUrl);
      });

      if (validUrlsToDelete.length > 0) {
        await CloudinaryService.deleteMultipleImages(validUrlsToDelete);
      }
    }

    const updateData: Record<string, unknown> = {
      title: requestData.title,
      brandId: requestData.brandId,
      modelId: requestData.modelId,
      version: requestData.version,
      color: requestData.color,
      year: Number.parseInt(requestData.year),
      kilometers: Number.parseInt(requestData.kilometers),
      type: requestData.type,
      fuelType: requestData.fuelType,
      transmission: requestData.transmission,
      price: Number.parseFloat(requestData.price),
      currency: requestData.currency,
      description: requestData.description,
      locationId: requestData.locationId ?? requestData.location ?? null,
      images: imagesToStore,
      status: requestData.status,
    };

    if (Array.isArray(requestData.tags)) {
      updateData.tags = {
        set: requestData.tags.map((tagId: string) => ({ id: tagId })),
      };
    }

    const car = await prisma.car.update({
      where: { id },
      data: updateData,
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
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json(
      {
        error: "Error al actualizar el auto",
        detalles: errorMessage,
      },
      { status: 500 },
    );
  }
}
