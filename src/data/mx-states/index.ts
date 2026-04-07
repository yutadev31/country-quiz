import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const mxStatesMode: GameModeConfig = {
  id: "mx-states",
  titleKey: "mode.mx-states.title",
  categoryId: "north-america",
  questionOptions: [
    { labelKey: "content-type.mx-state-name", value: "name" },
    { labelKey: "content-type.mx-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.mx-state-capital", value: "capital" },
    { labelKey: "content-type.mx-state-capitalNative", value: "capitalNative" },
  ],
  answerOptions: [
    { labelKey: "content-type.mx-state-name", value: "name" },
    { labelKey: "content-type.mx-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.mx-state-capital", value: "capital" },
    { labelKey: "content-type.mx-state-capitalNative", value: "capitalNative" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
  },
  getItems: () => loadQuizItems("mx-states.json"),
};
