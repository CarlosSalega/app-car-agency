"use client";

import { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { ImageSkeleton } from "@/components/ui/image-skeleton";
import { CarPlaceholderSVG } from "@/components/cars/car-placeholder-svg";
import { cn } from "@/lib/utils";

interface CarImageProps {
  publicId?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  skipSkeleton?: boolean;
}

type ImageState = "loading" | "loaded" | "error";

export function CarImage({
  publicId,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  skipSkeleton = false,
}: CarImageProps) {
  const [state, setState] = useState<ImageState>(
    skipSkeleton ? "loaded" : "loading",
  );
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (skipSkeleton) {
      return;
    }

    setState("loading");
    setHasError(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);

    if (!publicId || publicId === "placeholder") {
      return;
    }

    const checkImage = () => {
      const img = containerRef.current?.querySelector("img");
      if (!img) return false;

      if (img.complete) {
        if (img.naturalHeight === 0 || img.naturalWidth === 0) {
          setState("error");
          setHasError(true);
        } else {
          setState("loaded");
        }
        return true;
      }

      return false;
    };

    timeoutRef.current = setTimeout(() => {
      if (checkImage()) return;

      const img = containerRef.current?.querySelector("img");
      if (!img) return;

      const onLoad = () => {
        setState("loaded");
        cleanup();
      };

      const onError = () => {
        setState("error");
        setHasError(true);
        cleanup();
      };

      const cleanup = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);

      intervalRef.current = setInterval(() => {
        if (checkImage() && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, 200);

      errorTimeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!img.complete || img.naturalHeight === 0) {
          setState("error");
          setHasError(true);
        }
      }, 5000);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [publicId, skipSkeleton]);

  if (!publicId || publicId === "placeholder" || state === "error") {
    return (
      <div className={cn("relative", className)}>
        <img
          src="/placeholder.webp"
          alt={alt}
          className="size-full object-cover"
          loading={priority ? "eager" : "lazy"}
          onError={() => setHasError(true)}
        />
        {hasError && (
          <CarPlaceholderSVG className="absolute inset-0" alt={alt} />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {state === "loading" && !skipSkeleton && (
        <ImageSkeleton className="absolute inset-0 z-10" />
      )}

      <CldImage
        src={publicId}
        alt={alt}
        fill
        crop="fill"
        gravity="auto"
        format="auto"
        quality="auto"
        dpr="auto"
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "size-full object-cover",
          !skipSkeleton && "transition-opacity duration-300",
          state === "loading" && !skipSkeleton ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
