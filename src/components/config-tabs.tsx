"use client";

import type { Brand, Model, Location, Tag } from "@prisma/client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BrandsConfig } from "./brands-config";
import { DepositConfig } from "./deposit-config";
import { LocationsConfig } from "./locations-config";
import { ModelsConfig } from "./models-config";
import { TagsConfig } from "./tags-config";

type BrandWithModels = Brand & {
  models: Model[];
};

interface ConfigTabsProps {
  initialBrands: BrandWithModels[];
  initialLocations: Location[];
  initialTags: Tag[];
  initialDepositPercentage: number;
}

export function ConfigTabs({
  initialBrands,
  initialLocations,
  initialTags,
  initialDepositPercentage,
}: ConfigTabsProps) {
  const [brands, setBrands] = useState<BrandWithModels[]>(initialBrands);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  return (
    <Tabs defaultValue="brands" className="w-full">
      <TabsList className="grid size-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="brands">Marcas</TabsTrigger>
        <TabsTrigger value="models">Modelos</TabsTrigger>
        <TabsTrigger value="tags">Etiquetas</TabsTrigger>
        <TabsTrigger value="locations">Sucursales</TabsTrigger>
        <TabsTrigger value="deposit">Seña</TabsTrigger>
      </TabsList>

      <TabsContent value="brands" className="mt-6">
        <BrandsConfig brands={brands} onBrandsChange={setBrands} />
      </TabsContent>

      <TabsContent value="models" className="mt-6">
        <ModelsConfig brands={brands} />
      </TabsContent>

      <TabsContent value="tags" className="mt-6">
        <TagsConfig tags={tags} onTagsChange={setTags} />
      </TabsContent>

      <TabsContent value="locations" className="mt-6">
        <LocationsConfig locations={locations} onLocationsChange={setLocations} />
      </TabsContent>

      <TabsContent value="deposit" className="mt-6">
        <DepositConfig initialPercentage={initialDepositPercentage} />
      </TabsContent>
    </Tabs>
  );
}
