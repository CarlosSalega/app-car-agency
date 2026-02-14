"use client";

import { X, ImagePlus, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { resolveImageUrl } from "@/lib/images/resolve-image-url";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    if (value.length + files.length > MAX_IMAGES) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas`);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} no es una imagen válida`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} supera el tamaño máximo de 10MB`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedKeys: string[] = [];

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const currentFile = files[fileIndex];
        const formData = new FormData();
        formData.append("file", currentFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al subir imagen");
        }

        const uploadResult = await response.json();
        uploadedKeys.push(uploadResult.key);

        const progressPercentage = Math.round(((fileIndex + 1) / files.length) * 100);
        setUploadProgress(progressPercentage);
      }

      onChange([...value, ...uploadedKeys]);

      const imageWord = uploadedKeys.length > 1 ? "imágenes subidas" : "imagen subida";
      toast.success(`${uploadedKeys.length} ${imageWord}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error al subir imágenes");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (imageKey: string) => {
    const newValue = value.filter((key) => key !== imageKey);
    onChange(newValue);

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: imageKey }),
      });

      if (!response.ok) {
        onChange(value);
        toast.error("Error al eliminar la imagen");
      }
    } catch (error) {
      onChange(value);
      toast.error("Error de conexión");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || value.length >= MAX_IMAGES}
      />

      <Button type="button" onClick={handleButtonClick} disabled={isUploading || value.length >= MAX_IMAGES}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Subiendo... {uploadProgress}%
          </>
        ) : (
          <>
            <ImagePlus className="mr-2 size-4" />
            Subir imágenes ({value.length}/{MAX_IMAGES})
          </>
        )}
      </Button>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {value.map((imageKey, imageIndex) => (
            <div
              key={imageKey}
              className="group bg-muted relative aspect-4/3 max-w-20 overflow-hidden rounded-lg border"
            >
              <img
                src={resolveImageUrl(imageKey)}
                alt={`Imagen ${imageIndex + 1}`}
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemove(imageKey)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-1 right-1 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Eliminar imagen"
              >
                <X className="size-4" />
              </button>
              <div className="absolute right-0 bottom-0 left-0 bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {imageKey.split("/").pop()}
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="bg-muted/50 flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground text-sm">No hay imágenes. Haz clic en "Subir imágenes" para agregar.</p>
        </div>
      )}
    </div>
  );
}
