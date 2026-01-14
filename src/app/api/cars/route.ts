import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import slugify from "slugify";
function normalizeImageUrl(input: any) {
  if (!input) return "";
  const s = String(input).trim();
  try {
    if (/^https?:\/\//.test(s)) {
      const u = new URL(s);
      return `${u.protocol}//${u.host}${u.pathname}`;
    }
  } catch (e) {}
  return s;
}
function generateSlugBase(
  brandName: string,
  modelName: string,
  version: string,
  year: number,
  km: number,
): string {
  return slugify(`${brandName} ${modelName} ${version} ${year} ${km}`, {
    lower: true,
    strict: true,
  });
}
async function generateUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const exists = await prisma.car.findFirst({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    counter++;
  }
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
      return NextResponse.json(
        { error: "Marca o modelo no encontrados" },
        { status: 400 },
      );
    }
    const baseSlug = generateSlugBase(
      brand.name,
      model.name,
      data.version || "",
      Number.parseInt(data.year),
      Number.parseInt(data.kilometers),
    );
    const uniqueSlug = await generateUniqueSlug(baseSlug);
    let imagesArr: string[] = [];
    if (Array.isArray(data.images)) {
      imagesArr = data.images
        .map((x: any) => normalizeImageUrl(x))
        .filter(Boolean);
    } else if (typeof data.images === "string") {
      const trimmed = data.images.trim();
      if (trimmed.startsWith("[")) {
        try {
          imagesArr = JSON.parse(trimmed)
            .map((x: any) => normalizeImageUrl(x))
            .filter(Boolean);
        } catch (_) {
          imagesArr = [];
        }
      } else {
        imagesArr = trimmed
          .split(",")
          .map((s: string) => normalizeImageUrl(s))
          .filter(Boolean);
      }
    }
    const imagesToStore = JSON.stringify(imagesArr);
    const createData: any = {
      title: data.title,
      slug: uniqueSlug,
      brandId: data.brandId,
      modelId: data.modelId,
      version: data.version,
      color: data.color,
      year: Number.parseInt(data.year),
      kilometers: Number.parseInt(data.kilometers),
      type: data.type,
      fuelType: data.fuelType,
      transmission: data.transmission,
      price: Number.parseFloat(data.price),
      currency: data.currency,
      description: data.description,
      locationId: data.locationId ?? data.location ?? null,
      images: imagesToStore,
      status: data.status,
      userId: session.user.id,
    };
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      createData.tags = {
        connect: data.tags.map((id: string) => ({ id })),
      };
    }
    const car = await prisma.car.create({ data: createData });
    await prisma.log.create({
      data: {
        action: "CREATE",
        entity: "Car",
        entityId: car.id,
        userId: session.user.id,
      },
    });
    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("Error al crear el auto:", error);
    return NextResponse.json(
      { error: "Error al crear el auto" },
      { status: 500 },
    );
  }
}
