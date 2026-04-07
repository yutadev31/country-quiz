import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const deStatesMode: GameModeConfig = {
  id: "de-states",
  titleKey: "mode.de-states.title",
  categoryId: "europe",
  questionOptions: [
    { labelKey: "content-type.de-state.name", value: "name" },
    { labelKey: "content-type.de-state.nameNative", value: "nameNative" },
    { labelKey: "content-type.de-state.capital", value: "capital" },
    { labelKey: "content-type.de-state.capitalNative", value: "capitalNative" },
  ],
  answerOptions: [
    { labelKey: "content-type.de-state.name", value: "name" },
    { labelKey: "content-type.de-state.nameNative", value: "nameNative" },
    { labelKey: "content-type.de-state.capital", value: "capital" },
    { labelKey: "content-type.de-state.capitalNative", value: "capitalNative" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
  },
  getItems: () => loadQuizItems("de-states.json"),
};
