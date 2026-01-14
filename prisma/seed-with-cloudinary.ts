import { prisma } from "../src/lib/db";
import {
  PaymentMethod,
  PaymentStatus,
  Role,
  CarType,
  CarStatus,
  Currency,
  FuelType,
  Transmission,
} from "@prisma/client";
import { brands } from "../src/data/brands";
import { modelsByBrand } from "../src/data/modelsByBrand";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function generateSlugBase(
  brand: string,
  model: string,
  version: string,
  year: number,
  km: number,
): string {
  return slugify(`${brand} ${model} ${version} ${year} ${km}`, {
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

    slug = `${base}-${counter}`;
    counter++;
  }
}

function getImagesForCar(brand: string, model: string): string[] {
  const imagesDir = path.join(process.cwd(), "public", "autos");
  const images: string[] = [];
  try {
    const files = fs.readdirSync(imagesDir);
    const brandLower = brand.toLowerCase();
    let modelLower = model.toLowerCase();

    const brandVariations: Record<string, string[]> = {
      nissan: ["nissa", "nissan"],
      volkswagen: ["volkswagen", "vw"],
    };
    const brandSearchTerms = brandVariations[brandLower] || [brandLower];
    let modelSearchTerms: string[];
    let excludeTerms: string[] = [];
    if (modelLower === "corolla cross") {
      modelSearchTerms = ["corollacross", "corolla-cross"];
    } else if (modelLower === "corolla") {
      modelSearchTerms = ["corolla"];
      excludeTerms = ["corollacross", "corolla-cross"];
    } else {
      modelSearchTerms = [
        modelLower,
        modelLower.replace(/\s+/g, ""),
        modelLower.replace(/\s+/g, "-"),
      ];
    }
    const matchingFiles = files.filter((file) => {
      const fileLower = file.toLowerCase();
      const matchesBrand = brandSearchTerms.some((term) =>
        fileLower.includes(term),
      );
      if (!matchesBrand) return false;
      if (excludeTerms.some((term) => fileLower.includes(term))) {
        return false;
      }
      const matchesModel = modelSearchTerms.some((term) =>
        fileLower.includes(term),
      );
      return matchesModel;
    });
    matchingFiles.sort((a, b) => {
      const extractNumber = (str: string): number => {
        const parenMatch = str.match(/\((\d+)\)/);
        if (parenMatch) return parseInt(parenMatch[1], 10);
        const dashMatch = str.match(/-(\d+)\./);
        if (dashMatch) return parseInt(dashMatch[1], 10);
        const numMatch = str.match(/(\d+)/);
        return numMatch ? parseInt(numMatch[1], 10) : 0;
      };
      const numA = extractNumber(a);
      const numB = extractNumber(b);
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
    });
    matchingFiles.forEach((file) => {
      images.push(path.join(imagesDir, file));
    });
  } catch (error) {
    console.warn(
      `No se pudieron leer las imágenes para ${brand} ${model}:`,
      error,
    );
  }
  return images;
}

async function uploadImageToCloudinary(
  filePath: string,
): Promise<string | null> {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: fileName,
      resource_type: "image",
      overwrite: false,
      invalidate: true,
    });

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error subiendo ${filePath}:`, error);
    return null;
  }
}

async function uploadImagesToCloudinary(
  localImagePaths: string[],
): Promise<string[]> {
  if (localImagePaths.length === 0) {
    return ["/placeholder.webp"];
  }

  const uploadPromises = localImagePaths.map((imagePath) =>
    uploadImageToCloudinary(imagePath),
  );

  const results = await Promise.allSettled(uploadPromises);

  const cloudinaryUrls: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled" && result.value) {
      cloudinaryUrls.push(result.value);
    } else {
      console.warn(
        `⚠️  No se pudo subir imagen: ${path.basename(localImagePaths[i])}`,
      );
    }
  }

  if (cloudinaryUrls.length === 0) {
    console.warn(
      "⚠️  No se pudieron subir imágenes a Cloudinary, usando placeholder",
    );
    return ["/placeholder.webp"];
  }

  return cloudinaryUrls;
}

async function main() {
  try {
    const isCloudinaryConfigured =
      !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET;

    if (!isCloudinaryConfigured) {
      console.warn("⚠️  Variables de entorno de Cloudinary no configuradas.");
      console.warn(
        "   El seed continuará pero usará rutas locales en lugar de URLs de Cloudinary.",
      );
      console.warn(
        "   Configura NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET",
      );
    }

    await prisma.$connect();
    await prisma.paymentStatusHistory.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.visit.deleteMany();
    await prisma.car.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.model.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.location.deleteMany();
    await prisma.log.deleteMany();
    await prisma.settings.deleteMany();
    const admin = await prisma.user.upsert({
      where: { email: "admin@agencia.com" },
      update: {},
      create: {
        email: "admin@agencia.com",
        hashedPassword: hashPassword("admin123"),
        name: "Administrador",
        role: Role.ADMIN,
        isActive: true,
      },
    });
    const collaborator = await prisma.user.upsert({
      where: { email: "juan@agencia.com" },
      update: {},
      create: {
        email: "juan@agencia.com",
        hashedPassword: hashPassword("juan123"),
        name: "Juan Pérez",
        role: Role.COLLABORATOR,
        isActive: true,
      },
    });
    const locations = await Promise.all([
      prisma.location.upsert({
        where: { name: "Sucursal Centro" },
        update: {},
        create: {
          name: "Sucursal Centro",
          address: "Av. Corrientes 1234",
          city: "Buenos Aires",
          state: "CABA",
          zipCode: "C1043",
          phone: "+54 11 1234-5678",
          email: "centro@agencia.com",
          latitude: -34.6037,
          longitude: -58.3816,
          isActive: true,
          createdById: admin.id,
        },
      }),
      prisma.location.upsert({
        where: { name: "Sucursal Norte" },
        update: {},
        create: {
          name: "Sucursal Norte",
          address: "Av. Libertador 5678",
          city: "Vicente López",
          state: "Buenos Aires",
          zipCode: "B1636",
          phone: "+54 11 8765-4321",
          email: "norte@agencia.com",
          latitude: -34.5333,
          longitude: -58.4833,
          isActive: true,
          createdById: admin.id,
        },
      }),
      prisma.location.upsert({
        where: { name: "Sucursal Oeste" },
        update: {},
        create: {
          name: "Sucursal Oeste",
          address: "Av. Rivadavia 9876",
          city: "Morón",
          state: "Buenos Aires",
          zipCode: "B1708",
          phone: "+54 11 4567-8901",
          email: "oeste@agencia.com",
          latitude: -34.6505,
          longitude: -58.6196,
          isActive: true,
          createdById: admin.id,
        },
      }),
    ]);
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { name: "nuevo-ingreso" },
        update: {},
        create: {
          name: "nuevo-ingreso",
          description: "Vehículos recién ingresados",
          color: "#10b981",
          isActive: true,
          createdById: admin.id,
        },
      }),
      prisma.tag.upsert({
        where: { name: "oferta-especial" },
        update: {},
        create: {
          name: "oferta-especial",
          description: "Vehículos en oferta especial",
          color: "#ef4444",
          isActive: true,
          createdById: admin.id,
        },
      }),
      prisma.tag.upsert({
        where: { name: "full-equipo" },
        update: {},
        create: {
          name: "full-equipo",
          description: "Vehículos con equipamiento completo",
          color: "#3b82f6",
          isActive: true,
          createdById: admin.id,
        },
      }),
      prisma.tag.upsert({
        where: { name: "unico-dueno" },
        update: {},
        create: {
          name: "unico-dueno",
          description: "Vehículos con un único dueño",
          color: "#8b5cf6",
          isActive: true,
          createdById: admin.id,
        },
      }),
      prisma.tag.upsert({
        where: { name: "service-oficial" },
        update: {},
        create: {
          name: "service-oficial",
          description: "Service realizado en concesionario oficial",
          color: "#f59e0b",
          isActive: true,
          createdById: admin.id,
        },
      }),
    ]);
    const brandMap: Record<string, string> = {};
    const modelMap: Record<string, string> = {};
    for (const brandName of brands) {
      const brand = await prisma.brand.upsert({
        where: { name: brandName },
        update: {},
        create: {
          name: brandName,
          createdById: admin.id,
        },
      });
      brandMap[brandName] = brand.id;
      const models = modelsByBrand[brandName];
      for (const modelName of models) {
        const model = await prisma.model.upsert({
          where: {
            name_brandId: {
              name: modelName,
              brandId: brand.id,
            },
          },
          update: {},
          create: {
            name: modelName,
            brandId: brand.id,
            createdById: admin.id,
          },
        });
        modelMap[`${brandName}-${modelName}`] = model.id;
      }
    }
    const carsData = [
      {
        title: "Peugeot 208 Allure 2021",
        brand: "Peugeot",
        model: "208",
        version: "Allure",
        year: 2021,
        color: "Rojo",
        kilometers: 23000,
        type: CarType.HATCHBACK,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.MANUAL,
        price: 5700000,
        currency: Currency.ARS,
        description:
          "Diseño elegante y moderno, ideal para ciudad. Equipamiento completo con aire acondicionado, dirección asistida y sistema de audio integrado. Único dueño, service oficial.",
      },
      {
        title: "Fiat Cronos 1.3 GSE Precision 2025",
        brand: "Fiat",
        model: "Cronos",
        version: "Precision",
        year: 2025,
        color: "Blanco",
        kilometers: 5000,
        type: CarType.SEDAN,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.MANUAL,
        price: 12000000,
        currency: Currency.ARS,
        description:
          "Sedán moderno con tecnología de punta. Motor 1.3 GSE, excelente consumo y gran espacio interior. Único dueño, service oficial.",
      },
      {
        title: "Toyota Hilux SRV 4x4 2019",
        brand: "Toyota",
        model: "Hilux",
        version: "SRV",
        year: 2019,
        color: "Negro",
        kilometers: 35000,
        type: CarType.PICKUP,
        fuelType: FuelType.DIESEL,
        transmission: Transmission.MANUAL,
        price: 28000000,
        currency: Currency.ARS,
        description:
          "Pickup robusta y confiable. 4x4, ideal para trabajo y aventura. Service oficial, excelente estado general.",
      },
      {
        title: "Ford Ranger XLT 2020",
        brand: "Ford",
        model: "Ranger",
        version: "XLT",
        year: 2020,
        color: "Gris",
        kilometers: 27000,
        type: CarType.PICKUP,
        fuelType: FuelType.DIESEL,
        transmission: Transmission.AUTOMATIC,
        price: 24500000,
        currency: Currency.ARS,
        description:
          "Pickup full equipada con tecnología avanzada. Caja automática, doble cabina, excelente para trabajo y familia.",
      },
      {
        title: "Volkswagen Amarok V6 Highline 2025",
        brand: "Volkswagen",
        model: "Amarok",
        version: "Highline",
        year: 2025,
        color: "Blanco",
        kilometers: 10000,
        type: CarType.PICKUP,
        fuelType: FuelType.DIESEL,
        transmission: Transmission.AUTOMATIC,
        price: 45000000,
        currency: Currency.ARS,
        description:
          "Pickup premium con motor V6. Full equipo, tecnología de última generación, ideal para quien busca lo mejor.",
      },
      {
        title: "Chevrolet Tracker Premier 2025",
        brand: "Chevrolet",
        model: "Tracker",
        version: "Premier",
        year: 2025,
        color: "Azul",
        kilometers: 8000,
        type: CarType.SUV,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.AUTOMATIC,
        price: 18500000,
        currency: Currency.ARS,
        description:
          "SUV compacta y moderna. Full equipo, excelente para ciudad y ruta. Único dueño, service oficial.",
      },
      {
        title: "Chevrolet Cruze LTZ 2023",
        brand: "Chevrolet",
        model: "Cruze",
        version: "LTZ",
        year: 2023,
        color: "Gris",
        kilometers: 15000,
        type: CarType.SEDAN,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.AUTOMATIC,
        price: 16500000,
        currency: Currency.ARS,
        description:
          "Sedán premium con diseño moderno. Full equipo, tecnología avanzada, excelente consumo y confort.",
      },
      {
        title: "Toyota Corolla XEI 2022",
        brand: "Toyota",
        model: "Corolla",
        version: "XEI",
        year: 2022,
        color: "Blanco",
        kilometers: 22000,
        type: CarType.SEDAN,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.AUTOMATIC,
        price: 19500000,
        currency: Currency.ARS,
        description:
          "Sedán confiable y eficiente. Excelente calidad Toyota, service oficial, perfecto estado.",
      },
      {
        title: "Toyota Corolla Cross XRE 2024",
        brand: "Toyota",
        model: "Corolla Cross",
        version: "XRE",
        year: 2024,
        color: "Gris",
        kilometers: 8000,
        type: CarType.SUV,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.AUTOMATIC,
        price: 32000000,
        currency: Currency.ARS,
        description:
          "SUV moderna con tecnología híbrida. Excelente consumo, espacio amplio, ideal para familia.",
      },
      {
        title: "Toyota Yaris XLS 2023",
        brand: "Toyota",
        model: "Yaris",
        version: "XLS",
        year: 2023,
        color: "Rojo",
        kilometers: 12000,
        type: CarType.HATCHBACK,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.MANUAL,
        price: 12500000,
        currency: Currency.ARS,
        description:
          "Hatchback compacto y eficiente. Ideal para ciudad, bajo consumo, excelente maniobrabilidad.",
      },
      {
        title: "Volkswagen Taos Comfortline 2025",
        brand: "Volkswagen",
        model: "Taos",
        version: "Comfortline",
        year: 2025,
        color: "Negro",
        kilometers: 5000,
        type: CarType.SUV,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.AUTOMATIC,
        price: 28500000,
        currency: Currency.ARS,
        description:
          "SUV moderna con diseño alemán. Full equipo, tecnología avanzada, excelente para ciudad y ruta.",
      },
      {
        title: "Renault Sandero Stepway Zen 2023",
        brand: "Renault",
        model: "Sandero",
        version: "Stepway Zen",
        year: 2023,
        color: "Blanco",
        kilometers: 18000,
        type: CarType.HATCHBACK,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.MANUAL,
        price: 9800000,
        currency: Currency.ARS,
        description:
          "Hatchback elevado con estilo. Excelente para ciudad, amplio espacio interior, buen consumo.",
      },
      {
        title: "Renault Kangoo Express 2022",
        brand: "Renault",
        model: "Kangoo",
        version: "Express",
        year: 2022,
        color: "Gris",
        kilometers: 25000,
        type: CarType.PICKUP,
        fuelType: FuelType.GASOLINE,
        transmission: Transmission.MANUAL,
        price: 11500000,
        currency: Currency.ARS,
        description:
          "Utilitario versátil y espacioso. Ideal para trabajo, gran capacidad de carga, confiable.",
      },
      {
        title: "Nissan Frontier SE 2023",
        brand: "Nissan",
        model: "Frontier",
        version: "SE",
        year: 2023,
        color: "Blanco",
        kilometers: 14000,
        type: CarType.PICKUP,
        fuelType: FuelType.DIESEL,
        transmission: Transmission.MANUAL,
        price: 32000000,
        currency: Currency.ARS,
        description:
          "Pickup robusta y confiable. Excelente para trabajo, 4x4, gran capacidad off-road.",
      },
    ];

    console.log("🚗 Creando vehículos...");
    let carsCreated = 0;
    let imagesUploadedCount = 0;
    let imagesFailedCount = 0;

    for (const carData of carsData) {
      try {
        let brandId = brandMap[carData.brand];
        let wasBrandCreated = false;
        if (!brandId) {
          console.log(`📝 Creando marca no encontrada: ${carData.brand}`);
          const newBrand = await prisma.brand.upsert({
            where: { name: carData.brand },
            update: {},
            create: {
              name: carData.brand,
              createdById: admin.id,
            },
          });
          brandId = newBrand.id;
          brandMap[carData.brand] = brandId;
          wasBrandCreated = true;
        }

        const modelKey = `${carData.brand}-${carData.model}`;
        let modelId = modelMap[modelKey];
        let wasModelCreated = false;
        if (!modelId) {
          console.log(
            `📝 Creando modelo no encontrado: ${carData.brand} ${carData.model}`,
          );
          const newModel = await prisma.model.upsert({
            where: {
              name_brandId: {
                name: carData.model,
                brandId: brandId,
              },
            },
            update: {},
            create: {
              name: carData.model,
              brandId: brandId,
              createdById: admin.id,
            },
          });
          modelId = newModel.id;
          modelMap[modelKey] = modelId;
          wasModelCreated = true;
        }

        const localImagePaths = getImagesForCar(carData.brand, carData.model);

        let images: string[];

        if (isCloudinaryConfigured && localImagePaths.length > 0) {
          console.log(
            `📤 Subiendo ${localImagePaths.length} imagen(es) a Cloudinary para ${carData.brand} ${carData.model}...`,
          );
          const cloudinaryUrls =
            await uploadImagesToCloudinary(localImagePaths);
          images = cloudinaryUrls;
          imagesUploadedCount += cloudinaryUrls.filter((url) =>
            url.includes("cloudinary.com"),
          ).length;
          imagesFailedCount += localImagePaths.length - cloudinaryUrls.length;
        } else {
          if (!isCloudinaryConfigured) {
            console.warn(
              `⚠️  Cloudinary no configurado, usando rutas locales para ${carData.brand} ${carData.model}`,
            );
          }
          images =
            localImagePaths.length > 0
              ? localImagePaths.map((p) => `/autos/${path.basename(p)}`)
              : ["/placeholder.webp"];
        }

        if (
          (wasBrandCreated || wasModelCreated) &&
          images.length > 0 &&
          images[0] !== "/placeholder.webp"
        ) {
          console.log(
            `✅ Imágenes procesadas para ${carData.brand} ${carData.model}: ${images.length} imagen(es)`,
          );
        }

        const baseSlug = generateSlugBase(
          carData.brand,
          carData.model,
          carData.version || "",
          carData.year,
          carData.kilometers,
        );
        const uniqueSlug = await generateUniqueSlug(baseSlug);

        if (carData.model === "Corolla Cross") {
          console.log(
            `🔍 Slug generado para ${carData.title}: ${uniqueSlug} (base: ${baseSlug})`,
          );
        }

        const randomLocation =
          locations[Math.floor(Math.random() * locations.length)];

        const randomTagCount = Math.floor(Math.random() * 3) + 1;
        const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
        const selectedTags = shuffledTags.slice(0, randomTagCount);

        const randomUser = Math.random() > 0.5 ? admin.id : collaborator.id;

        await prisma.car.create({
          data: {
            title: carData.title,
            slug: uniqueSlug,
            brandId: brandId,
            modelId: modelId,
            version: carData.version || null,
            year: carData.year,
            color: carData.color || null,
            kilometers: carData.kilometers,
            type: carData.type,
            fuelType: carData.fuelType,
            transmission: carData.transmission,
            price: carData.price,
            currency: carData.currency,
            description: carData.description,
            locationId: randomLocation.id,
            images: JSON.stringify(images),
            tags: {
              connect: selectedTags.map((tag) => ({
                id: tag.id,
              })),
            },
            status: CarStatus.AVAILABLE,
            userId: randomUser,
          },
        });

        carsCreated++;
        console.log(`✅ Auto creado: ${carData.title}`);
      } catch (error) {
        console.error(`❌ Error creando auto ${carData.title}:`, error);
        if (error instanceof Error) {
          console.error(`   Mensaje: ${error.message}`);
          if (error.message.includes("Unique constraint")) {
            console.error(
              `   ⚠️ Conflicto de unicidad detectado. Verificar slug o relaciones únicas.`,
            );
          }
        }
      }
    }

    console.log(
      `✅ ${carsCreated}/${carsData.length} vehículos creados exitosamente`,
    );
    if (isCloudinaryConfigured) {
      console.log(
        `📊 Imágenes: ${imagesUploadedCount} subidas exitosamente, ${imagesFailedCount} fallaron`,
      );
    }

    console.log("💳 Creando pagos de ejemplo...");
    const someCars = await prisma.car.findMany({ take: 5 });
    for (const car of someCars) {
      const depositAmount = car.price * 0.3;

      await prisma.payment.create({
        data: {
          amount: depositAmount,
          method:
            Math.random() > 0.5
              ? PaymentMethod.CASH
              : PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.PENDING,
          carId: car.id,
          userId: collaborator.id,
          statusHistory: {
            create: {
              newStatus: PaymentStatus.PENDING,
              notes: "Pago inicial creado automáticamente en seed",
            },
          },
        },
      });
    }
    console.log(`✅ ${someCars.length} pagos de ejemplo creados`);

    console.log("⚙️ Creando configuración del sistema...");
    await prisma.settings.upsert({
      where: { key: "deposit_percentage" },
      update: {},
      create: {
        key: "deposit_percentage",
        value: "30",
        description:
          "Porcentaje de seña a recibir como parte de pago del valor del vehículo",
      },
    });
    console.log("✅ Configuración de porcentaje de seña creada (30%)");

    console.log("📝 Creando logs de ejemplo...");
    await prisma.log.create({
      data: {
        action: "SEED_EXECUTED",
        entity: "System",
        metadata: JSON.stringify({
          carsCreated,
          usersCreated: 2,
          brandsCreated: Object.keys(brandMap).length,
          modelsCreated: Object.keys(modelMap).length,
          locationsCreated: locations.length,
          tagsCreated: tags.length,
          imagesUploaded: imagesUploadedCount,
          imagesFailed: imagesFailedCount,
        }),
        userId: admin.id,
      },
    });

    console.log("👁️ Creando visitas de ejemplo...");
    for (const car of someCars) {
      await prisma.visit.create({
        data: {
          carId: car.id,
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
    }
    console.log(`✅ ${someCars.length} visitas de ejemplo creadas`);

    console.log("\n🎉 Seed finalizado exitosamente!");
    console.log("=================================");
    console.log("📊 Resumen del seed:");
    console.log(`   👥 Usuarios: 2 (admin + colaborador)`);
    console.log(`   🏢 Sucursales: ${locations.length}`);
    console.log(`   🏷️ Tags: ${tags.length}`);
    console.log(`   🚗 Marcas: ${Object.keys(brandMap).length}`);
    console.log(`   🚗 Modelos: ${Object.keys(modelMap).length}`);
    console.log(`   🚗 Vehículos: ${carsCreated}`);
    console.log(`   💳 Pagos: ${someCars.length}`);
    console.log(`   👁️ Visitas: ${someCars.length}`);
    console.log(`   ⚙️ Configuración: 1 setting`);
    if (isCloudinaryConfigured) {
      console.log(
        `   📸 Imágenes subidas a Cloudinary: ${imagesUploadedCount}`,
      );
      if (imagesFailedCount > 0) {
        console.log(`   ⚠️  Imágenes fallidas: ${imagesFailedCount}`);
      }
    } else {
      console.log(`   ⚠️  Cloudinary no configurado - usando rutas locales`);
    }
    console.log("=================================");
    console.log("🔐 Credenciales para testing:");
    console.log("   Admin: admin@agencia.com / admin123");
    console.log("   Collaborator: juan@agencia.com / juan123");
    console.log("=================================");
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
