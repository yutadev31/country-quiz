import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const frRegionsMode: GameModeConfig = {
  id: "fr-regions",
  titleKey: "mode.fr-regions.title",
  categoryId: "europe",
  questionOptions: [
    { labelKey: "content-type.fr-region.name", value: "name" },
    { labelKey: "content-type.fr-region.nameNative", value: "nameNative" },
    { labelKey: "content-type.fr-region.capital", value: "capital" },
    {
      labelKey: "content-type.fr-region.capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.fr-region.name", value: "name" },
    { labelKey: "content-type.fr-region.nameNative", value: "nameNative" },
    { labelKey: "content-type.fr-region.capital", value: "capital" },
    {
      labelKey: "content-type.fr-region.capitalNative",
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
  getItems: () => loadQuizItems("fr-regions.json"),
};
