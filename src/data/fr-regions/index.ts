import type { GameModeConfig } from "@/data/game-mode-types";
import regions from "./regions.json";

export interface FRRegion {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
}

export const frRegionsMode: GameModeConfig = {
  id: "fr-regions",
  titleKey: "mode.fr-regions.title",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.fr-region-name", value: "name" },
    { labelKey: "content-type.fr-region-nameNative", value: "nameNative" },
    { labelKey: "content-type.fr-region-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.fr-region-name", value: "name" },
    { labelKey: "content-type.fr-region-nameNative", value: "nameNative" },
    { labelKey: "content-type.fr-region-capital", value: "capital" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    nameNative: "text",
    capital: "text",
  },
  getItems: () => regions,
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
