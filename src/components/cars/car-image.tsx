"use client";

import { useEffect, useRef, useState } from "react";
import { ImageSkeleton } from "@/components/ui/image-skeleton";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/constants";

interface CarImageProps {
  imageKey?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  skipSkeleton?: boolean;
}

type ImageState = "loading" | "loaded" | "error";

export function CarImage({
  imageKey,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  skipSkeleton = false,
}: CarImageProps) {
  const [state, setState] = useState<ImageState>(skipSkeleton ? "loaded" : "loading");

  const imgRef = useRef<HTMLImageElement>(null);
  const src = imageKey ? `/api/images/${imageKey}` : FALLBACK_IMAGE;

  useEffect(() => {
    if (skipSkeleton) return;

    setState("loading");

    const img = imgRef.current;
    if (!img) return;

    const onLoad = () => setState("loaded");
    const onError = () => setState("error");

    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);

    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src, skipSkeleton]);

  if (state === "error") {
    return (
      <div className={cn("relative", className)}>
        <img src={FALLBACK_IMAGE} alt={alt} className="size-full object-cover" loading={priority ? "eager" : "lazy"} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {state === "loading" && !skipSkeleton && <ImageSkeleton className="absolute inset-0 z-10" />}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "size-full object-cover transition-opacity duration-300",
          !skipSkeleton && state === "loading" ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
