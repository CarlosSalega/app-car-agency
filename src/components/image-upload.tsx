"use client";

import { useState, useRef, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { resolveImageUrl } from "@/lib/images/resolve-image-url";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MAX_IMAGES = 10;

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const valueRef = useRef(value);
  const pendingKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (!result.info || typeof result.info === "string") return;

    const infos = Array.isArray(result.info) ? result.info : [result.info];

    infos.forEach((info: any) => {
      if (info.public_id) {
        pendingKeysRef.current.add(info.public_id);
      }
    });
  };

  const handleQueuesEnd = () => {
    const newKeys = Array.from(pendingKeysRef.current).filter(
      (key) => !valueRef.current.includes(key),
    );

    if (newKeys.length > 0) {
      const updated = [...valueRef.current, ...newKeys];
      valueRef.current = updated;
      onChange(updated);

      toast.success(
        `${newKeys.length} imagen${newKeys.length > 1 ? "es" : ""} subida${newKeys.length > 1 ? "s" : ""}`,
      );
    }

    pendingKeysRef.current.clear();
    setIsUploading(false);
  };

  const handleRemove = async (key: string) => {
    const prev = [...valueRef.current];
    const next = prev.filter((k) => k !== key);

    valueRef.current = next;
    onChange(next);

    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        valueRef.current = prev;
        onChange(prev);
        toast.error("Error al eliminar la imagen");
      }
    } catch {
      valueRef.current = prev;
      onChange(prev);
      toast.error("Error de conexión");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          multiple: true,
          maxFiles: MAX_IMAGES - value.length,
          resourceType: "image",
        }}
        onOpen={() => setIsUploading(true)}
        onSuccess={handleSuccess}
        onQueuesEnd={handleQueuesEnd}
      >
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open?.()}
            disabled={isUploading || value.length >= MAX_IMAGES}
          >
            <ImagePlus className="mr-2 size-4" />
            {isUploading ? "Subiendo..." : "Subir imágenes"}
          </Button>
        )}
      </CldUploadWidget>

      <div className="flex flex-wrap gap-2">
        {value.map((key) => (
          <div
            key={key}
            className="bg-muted flex items-center gap-2 rounded p-2"
          >
            <img
              src={resolveImageUrl(key, "thumb")}
              alt={key}
              className="size-10 rounded object-cover"
            />
            <span className="truncate text-sm">{key}</span>
            <button onClick={() => handleRemove(key)}>
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
