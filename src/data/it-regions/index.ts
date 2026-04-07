import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const itRegionsMode: GameModeConfig = {
  id: "it-regions",
  titleKey: "mode.it-regions.title",
  categoryId: "europe",
  questionOptions: [
    { labelKey: "content-type.it-region.name", value: "name" },
    { labelKey: "content-type.it-region.nameNative", value: "nameNative" },
    { labelKey: "content-type.it-region.capital", value: "capital" },
    {
      labelKey: "content-type.it-region.capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.it-region.name", value: "name" },
    { labelKey: "content-type.it-region.nameNative", value: "nameNative" },
    { labelKey: "content-type.it-region.capital", value: "capital" },
    {
      labelKey: "content-type.it-region.capitalNative",
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
  getItems: () => loadQuizItems("it-regions.json"),
};
