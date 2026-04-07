import type { GameModeConfig } from "@/data/game-mode-types";
import regions from "./regions.json";

export const frRegionsMode: GameModeConfig = {
  id: "fr-regions",
  titleKey: "mode.fr-regions.title",
  questionOptions: [
    { labelKey: "content-type.fr-region-name", value: "name" },
    { labelKey: "content-type.fr-region-nameNative", value: "nameNative" },
    { labelKey: "content-type.fr-region-capital", value: "capital" },
    {
      labelKey: "content-type.fr-region-capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.fr-region-name", value: "name" },
    { labelKey: "content-type.fr-region-nameNative", value: "nameNative" },
    { labelKey: "content-type.fr-region-capital", value: "capital" },
    {
      labelKey: "content-type.fr-region-capitalNative",
      value: "capitalNative",
    },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
  },
  getItems: () => regions,
};
