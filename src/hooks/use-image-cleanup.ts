"use client";

import { useState, useEffect, useRef } from "react";

interface UseImageCleanupReturn {
  tempUploaded: string[];
  setTempUploaded: React.Dispatch<React.SetStateAction<string[]>>;
  cleanupUsedImages: (usedImages: string[]) => void;
}

export function useImageCleanup(): UseImageCleanupReturn {
  const [tempUploaded, setTempUploaded] = useState<string[]>([]);
  const usedImagesRef = useRef<Set<string>>(new Set());
  const isCleaningUpRef = useRef(false);

  useEffect(() => {
    const normalizeUrl = (url: string) => {
      try {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      } catch {
        return url.trim();
      }
    };

    const cleanupImages = (urls: string[]) => {
      const toDelete = urls.filter((url) => {
        const normalized = normalizeUrl(url);
        return (
          !usedImagesRef.current.has(url) &&
          !usedImagesRef.current.has(normalized)
        );
      });
      if (toDelete.length > 0) {
        console.log(
          `[use-image-cleanup] Eliminando ${toDelete.length} imágenes no usadas en cleanup del useEffect`,
        );
        toDelete.forEach((url) => {
          fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          }).catch((err) => {
            console.error("Error al eliminar imagen en cleanup:", err);
          });
        });
      } else if (urls.length > 0) {
        console.log(
          `[use-image-cleanup] Todas las ${urls.length} imágenes en cleanup ya fueron usadas, no se eliminan`,
        );
      }
    };

    const handleBeforeUnload = () => {
      if (tempUploaded.length && !isCleaningUpRef.current) {
        cleanupImages(tempUploaded);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (tempUploaded.length && !isCleaningUpRef.current) {
        cleanupImages(tempUploaded);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [tempUploaded]);

  const cleanupUsedImages = (usedImages: string[]) => {
    isCleaningUpRef.current = true;

    const normalizeUrl = (url: string) => {
      try {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      } catch {
        return url.trim();
      }
    };

    usedImages.forEach((url) => {
      usedImagesRef.current.add(url);
      usedImagesRef.current.add(normalizeUrl(url));
    });

    const normalizedUsed = usedImages.map(normalizeUrl);
    const unused = tempUploaded.filter(
      (url) => !normalizedUsed.includes(normalizeUrl(url)),
    );

    if (unused.length) {
      console.log(
        `[use-image-cleanup] Limpiando ${unused.length} imágenes no utilizadas de ${tempUploaded.length} temporales`,
      );
      unused.forEach((url) => {
        fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }).catch((err) => {
          console.error("Error al eliminar imagen temporal:", err);
        });
      });
    } else {
      console.log(
        `[use-image-cleanup] Todas las ${tempUploaded.length} imágenes temporales se utilizaron correctamente`,
      );
    }

    setTempUploaded([]);
    setTimeout(() => {
      isCleaningUpRef.current = false;
      usedImagesRef.current.clear();
    }, 1000);
  };

  return { tempUploaded, setTempUploaded, cleanupUsedImages };
}
