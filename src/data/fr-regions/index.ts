import regions from "@/data/fr-regions/fr-regions.json";
import type { GameModeConfig } from "@/data/game-mode-types";

export interface FRRegion {
  id: string;
  name: string;
  capital: string;
}

export const frRegionsMode: GameModeConfig = {
  id: "fr-regions",
  titleKey: "mode.fr-regions.title",
  descriptionKey: "mode.fr-regions.description",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.fr-region-name", value: "name" },
    { labelKey: "content-type.fr-region-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.fr-region-name", value: "name" },
    { labelKey: "content-type.fr-region-capital", value: "capital" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    capital: "text",
  },
  getItems: () =>
    regions.map((region) => {
      return {
        id: region.code,
        name: region.name,
        capital: region.capital,
      };
    }),
  normalizeQuestionField: (value) => {
    if (value === "capital") {
      return value;
    }
    return "name";
  },
  normalizeAnswerField: (value) => {
    if (value === "name") {
      return value;
    }
    return "capital";
  },
};
