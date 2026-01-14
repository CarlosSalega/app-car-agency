import { useState, useEffect } from "react";
import type { Location, Tag } from "@prisma/client";
import type { BrandWithModels } from "@/types/car-form";

interface UseCarFormDataReturn {
  brands: BrandWithModels[];
  locations: Location[];
  tags: Tag[];
  loading: boolean;
}

export function useCarFormData(initialBrandId?: string): UseCarFormDataReturn {
  const [brands, setBrands] = useState<BrandWithModels[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [brandsRes, locationsRes, tagsRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/locations"),
          fetch("/api/tags"),
        ]);

        const [brandsData, locationsData, tagsData] = await Promise.all([
          brandsRes.json(),
          locationsRes.ok ? locationsRes.json() : [],
          tagsRes.ok ? tagsRes.json() : [],
        ]);

        setBrands(brandsData);
        setLocations(locationsData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching form data:", error);
        setLocations([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { brands, locations, tags, loading };
}
