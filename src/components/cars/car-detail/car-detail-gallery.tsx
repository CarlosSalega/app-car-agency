"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getPublicIdFromUrl } from "@/lib/utils";
import { CarImage } from "@/components/cars/car-image";

interface CarDetailGalleryProps {
  images: string[];
  title: string;
  id?: string | number;
}

const MAX_THUMBNAILS = 4;

export function CarDetailGallery({ images, title }: CarDetailGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeImages = images.length > 0 ? images : ["/placeholder.webp"];

  const mainImageUrl = safeImages[currentIndex];
  const mainPublicId = getPublicIdFromUrl(mainImageUrl);

  const thumbnails = useMemo(
    () => safeImages.slice(0, MAX_THUMBNAILS),
    [safeImages],
  );

  const remainingCount = Math.max(0, safeImages.length - MAX_THUMBNAILS);

  const next = () => setCurrentIndex((i) => (i + 1) % safeImages.length);

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + safeImages.length) % safeImages.length);

  if (!safeImages.length) return null;

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg">
            <CarImage
              publicId={mainPublicId}
              alt={`${title} - Imagen principal`}
              priority
              skipSkeleton
              className="size-full object-cover"
            />

            {safeImages.length > 1 && (
              <>
                <Button
                  size="icon"
                  className="absolute top-1/2 left-2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="bg-background rounded-lg p-2 sm:max-w-2xl">
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>

          <CarImage
            publicId={mainPublicId}
            alt={`${title} - Fullscreen`}
            skipSkeleton
            className="h-[90vh] w-full object-cover"
          />
          {safeImages.length > 1 && (
            <>
              <Button
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronLeft />
              </Button>
              <Button
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbnails.map((img, index) => {
            const isLastWithOverlay =
              index === MAX_THUMBNAILS - 1 && remainingCount > 0;

            return (
              <button
                key={img}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-1 transition ${
                  index === currentIndex
                    ? "ring-primary"
                    : "ring-muted hover:ring-muted-foreground/40"
                }`}
              >
                <CarImage
                  publicId={getPublicIdFromUrl(img)}
                  alt={`${title} - Miniatura ${index + 1}`}
                  skipSkeleton
                  className="size-full object-cover"
                />

                {isLastWithOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">
                    +{remainingCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
