import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const esCommunitiesMode: GameModeConfig = {
  id: "es-communities",
  titleKey: "mode.es-communities.title",
  categoryId: "europe",
  questionOptions: [
    { labelKey: "content-type.es-community.name", value: "name" },
    { labelKey: "content-type.es-community.nameNative", value: "nameNative" },
    { labelKey: "content-type.es-community.capital", value: "capital" },
    {
      labelKey: "content-type.es-community.capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.es-community.name", value: "name" },
    { labelKey: "content-type.es-community.nameNative", value: "nameNative" },
    { labelKey: "content-type.es-community.capital", value: "capital" },
    {
      labelKey: "content-type.es-community.capitalNative",
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
  getItems: () => loadQuizItems("es-communities.json"),
};
