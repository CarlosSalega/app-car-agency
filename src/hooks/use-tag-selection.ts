import { useState, useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { Tag } from "@prisma/client";
import type { CarInput } from "@/lib/validations/car";

interface UseTagSelectionReturn {
  selectedTags: string[];
  addTag: (tagId: string) => void;
  removeTag: (tagId: string) => void;
}

export function useTagSelection(
  tagsList: Tag[],
  initialTags?: Tag[],
  setValue?: UseFormSetValue<CarInput>,
): UseTagSelectionReturn {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTags ? initialTags.map((tag) => tag.id) : [],
  );

  useEffect(() => {
    if (tagsList.length && selectedTags.length && setValue) {
      const names = selectedTags
        .map((id) => tagsList.find((tag) => tag.id === id)?.name)
        .filter(Boolean) as string[];
      setValue("tags", names.join(","));
    }
  }, [selectedTags, tagsList, setValue]);

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  return { selectedTags, addTag, removeTag };
}
