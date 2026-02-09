export function resolveImageUrl(
  key: string,
  variant: "thumb" | "medium" | "original" = "thumb",
) {
  const base = process.env.NEXT_PUBLIC_IMAGE_CDN;

  return `${base}/${key}-${variant}.webp`;
}
