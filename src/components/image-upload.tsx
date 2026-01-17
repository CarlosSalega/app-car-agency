"use client";

import { useState, useRef, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import cloudinaryEs from "@/config/cloudinary-es.json";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MAX_IMAGES = 10;

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const valueRef = useRef(value);
  const pendingUploadsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleRemoveClick = (url: string) => {
    setImageToDelete(url);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    const url = imageToDelete;
    const previousValue = [...valueRef.current];

    const newValue = valueRef.current.filter((item) => item !== url);
    valueRef.current = newValue;
    onChange(newValue);
    setDeleteDialogOpen(false);

    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        valueRef.current = previousValue;
        onChange(previousValue);
        toast.error(
          errorData.error || "Error al eliminar la imagen. Intenta nuevamente.",
        );
      } else {
        toast.success("Imagen eliminada correctamente");
      }
    } catch (err) {
      valueRef.current = previousValue;
      onChange(previousValue);
      console.error("Delete error:", err);
      toast.error(
        "Error de conexión al eliminar la imagen. Intenta nuevamente.",
      );
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    console.log("Cloudinary upload success result:", result);

    if (result.info && typeof result.info !== "string") {
      if (Array.isArray(result.info)) {
        result.info.forEach((info) => {
          if (info.secure_url) {
            pendingUploadsRef.current.add(info.secure_url);
          }
        });
      } else if (result.info.secure_url) {
        pendingUploadsRef.current.add(result.info.secure_url);
      }
    }
  };

  const handleQueuesEnd = (result: CloudinaryUploadWidgetResults) => {
    console.log("Cloudinary upload queue ended:", result);

    let allNewUrls: string[] = [];

    if (result.info && typeof result.info !== "string") {
      if (Array.isArray(result.info)) {
        allNewUrls = result.info
          .map((info: any) => info.secure_url)
          .filter(Boolean);
      } else if (result.info.secure_url) {
        allNewUrls = [result.info.secure_url];
      }
    }

    if (allNewUrls.length === 0 && pendingUploadsRef.current.size > 0) {
      allNewUrls = Array.from(pendingUploadsRef.current);
    }

    if (allNewUrls.length > 0) {
      console.log(
        `[ImageUpload] Procesando ${allNewUrls.length} imágenes subidas:`,
        allNewUrls,
      );

      const uniqueNewUrls = allNewUrls.filter(
        (url) => !valueRef.current.includes(url),
      );

      if (uniqueNewUrls.length > 0) {
        const updatedValue = [...valueRef.current, ...uniqueNewUrls];
        valueRef.current = updatedValue;
        onChange(updatedValue);
        toast.success(
          `${uniqueNewUrls.length} imagen${uniqueNewUrls.length > 1 ? "es" : ""} subida${uniqueNewUrls.length > 1 ? "s" : ""} correctamente`,
        );
      }
    }

    pendingUploadsRef.current.clear();
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          sources: ["local", "url", "camera", "image_search", "google_drive"],
          multiple: true,
          maxFiles: Math.max(1, MAX_IMAGES - value.length),
          maxFileSize: 10000000,
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          resourceType: "image",
          language: "es",
          text: cloudinaryEs,
        }}
        onSuccess={handleSuccess}
        onQueuesEnd={handleQueuesEnd}
        onError={(err) => {
          console.error("Cloudinary Widget Error:", err);
          setIsUploading(false);
          toast.error(
            "Error al subir las imágenes. Verifica tu conexión e intenta nuevamente.",
          );
        }}
        onOpen={() => {
          console.log("Cloudinary widget opened");
          setIsUploading(true);
        }}
        onClose={() => {
          console.log("Cloudinary widget closed");
          setIsUploading(false);
        }}
      >
        {({ open }) => {
          const currentCount = value.length;
          const canAddMore = currentCount < MAX_IMAGES;
          const remaining = MAX_IMAGES - currentCount;

          const handleOpen = () => {
            if (!canAddMore) {
              toast.error(
                `Ya has alcanzado el límite de ${MAX_IMAGES} imágenes. Elimina algunas antes de agregar más.`,
              );
              return;
            }
            if (open) {
              open();
            }
          };

          return (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                className="xs:max-w-48 inline-flex w-full items-center gap-2 bg-yellow-400 font-medium text-black hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUploading || !canAddMore}
                onClick={handleOpen}
              >
                <ImagePlus className="size-4" />
                <span>{isUploading ? "Subiendo..." : "Subir imágenes"}</span>
              </Button>
              {canAddMore && (
                <p className="text-muted-foreground text-sm">
                  {remaining}{" "}
                  {remaining === 1 ? "imagen restante" : "imágenes restantes"}
                </p>
              )}
              {!canAddMore && (
                <p className="text-muted-foreground text-sm">
                  Límite alcanzado ({MAX_IMAGES}/{MAX_IMAGES}). Máximo{" "}
                  {MAX_IMAGES} imágenes permitidas
                </p>
              )}
            </div>
          );
        }}
      </CldUploadWidget>

      <div className="flex flex-wrap gap-2">
        {value.map((url, idx) => {
          const name = url.split("/").pop() || url;
          return (
            <span
              key={url}
              className="bg-muted-foreground xs:max-w-40 inline-flex h-10 w-full cursor-grab items-center gap-2 rounded-md px-2 py-1 text-white"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(idx));
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData("text/plain"));
                const to = idx;
                if (from >= 0 && from < value.length && from !== to) {
                  const copy = [...value];
                  const [moved] = copy.splice(from, 1);
                  copy.splice(to, 0, moved);
                  onChange(copy);
                }
              }}
            >
              <img
                src={url}
                alt={name}
                className="size-8 rounded object-cover"
              />
              <span className="xs:max-w-40 w-full truncate">{name}</span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleRemoveClick(url)}
                  disabled={isDeleting}
                  className="hover:bg-destructive bg-background ml-2 rounded-full p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  title="Eliminar imagen"
                >
                  <X className="text-foreground hover:text-background size-4" />
                </button>
              </div>
            </span>
          );
        })}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {imageToDelete && (
            <div className="bg-muted flex items-center gap-2 rounded p-2">
              <img
                src={imageToDelete}
                alt="Preview"
                className="size-12 rounded object-cover"
              />
              <span className="text-muted-foreground flex-1 truncate text-sm">
                {imageToDelete.split("/").pop() || "Imagen"}
              </span>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setImageToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
