import { useEffect, useState } from "react";
import type { Location, Tag } from "@prisma/client";
import type { BrandWithModels } from "@/types/car-form";

interface UseCarFormDataReturn {
  brands: BrandWithModels[];
  locations: Location[];
  tags: Tag[];
  loading: boolean;
}

const safeJson = async <T>(res: Response, fallback: T): Promise<T> =>
  res.ok ? res.json() : fallback;

export function useCarFormData(): UseCarFormDataReturn {
  const [brands, setBrands] = useState<BrandWithModels[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const [brandsRes, locationsRes, tagsRes] = await Promise.all([
          fetch("/api/brands", { signal: controller.signal }),
          fetch("/api/locations", { signal: controller.signal }),
          fetch("/api/tags", { signal: controller.signal }),
        ]);

        const [brandsData, locationsData, tagsData] = await Promise.all([
          safeJson(brandsRes, []),
          safeJson(locationsRes, []),
          safeJson(tagsRes, []),
        ]);

        setBrands(brandsData);
        setLocations(locationsData);
        setTags(tagsData);
      } catch (error) {
        if (!(error instanceof DOMException)) {
          console.error("Error fetching form data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  return { brands, locations, tags, loading };
}
