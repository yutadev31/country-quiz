import regions from "@/data/fr-regions/fr-regions.json";

export interface FRRegion {
  id: string;
  name: string;
  capital: string;
}

export default function getFRRegions() {
  return regions.map((region) => {
    return {
      id: region.code,
      name: region.name,
      capital: region.capital,
    };
  });
}
