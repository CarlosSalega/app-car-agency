import { FALLBACK_IMAGE } from "@/lib/constants";
import { CLOUDINARY_RESPONSIVE_TRANSFORMS } from "./cloudinary-config";

export function resolveImageUrl(key: string) {
  const base = process.env.NEXT_PUBLIC_IMAGE_CDN;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !base) {
    console.error("Variables de Cloudinary no están definidas");
    return FALLBACK_IMAGE;
  }

  if (process.env.NEXT_PUBLIC_IMAGE_PROVIDER === "cloudinary") {
    const url = `${base.replace("${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}", cloudName)}/${CLOUDINARY_RESPONSIVE_TRANSFORMS}/${key}.webp`;
    return url;
  }

  return `${base}/${key}.webp`;
}
