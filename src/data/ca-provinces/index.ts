import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const caProvincesMode: GameModeConfig = {
  id: "ca-provinces",
  titleKey: "mode.ca-provinces.title",
  categoryId: "north-america",
  questionOptions: [
    { labelKey: "content-type.ca-province.name", value: "name" },
    { labelKey: "content-type.ca-province.nameNative", value: "nameNative" },
    { labelKey: "content-type.ca-province.capital", value: "capital" },
    {
      labelKey: "content-type.ca-province.capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.ca-province.name", value: "name" },
    { labelKey: "content-type.ca-province.nameNative", value: "nameNative" },
    { labelKey: "content-type.ca-province.capital", value: "capital" },
    {
      labelKey: "content-type.ca-province.capitalNative",
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
  getItems: () => loadQuizItems("ca-provinces.json"),
};
