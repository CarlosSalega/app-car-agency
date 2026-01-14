import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const imagePath = path.join("/");

    if (!imagePath) {
      return NextResponse.json(
        { error: "Ruta de imagen no proporcionada" },
        { status: 400 },
      );
    }

    const cloudinaryUrl = `${CLOUDINARY_BASE_URL}/${imagePath}`;

    const response = await fetch(cloudinaryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 },
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "image/jpeg";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable, stale-while-revalidate=86400",
    );
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("CDN-Cache-Control", "public, max-age=31536000");

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error al obtener imagen:", error);
    return NextResponse.json(
      { error: "Error al obtener la imagen" },
      { status: 500 },
    );
  }
}

