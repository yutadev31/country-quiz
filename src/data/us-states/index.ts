import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const usStatesMode: GameModeConfig = {
  id: "us-states",
  titleKey: "mode.us-states.title",
  categoryId: "north-america",
  questionOptions: [
    { labelKey: "content-type.us-state-name", value: "name" },
    { labelKey: "content-type.us-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.us-state-capital", value: "capital" },
    { labelKey: "content-type.us-state-capitalNative", value: "capitalNative" },
    { labelKey: "content-type.us-state-flag", value: "flag" },
  ],
  answerOptions: [
    { labelKey: "content-type.us-state-name", value: "name" },
    { labelKey: "content-type.us-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.us-state-capital", value: "capital" },
    { labelKey: "content-type.us-state-capitalNative", value: "capitalNative" },
    { labelKey: "content-type.us-state-flag", value: "flag" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "flag",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
    flag: "img",
  },
  getItems: () => loadQuizItems("us-states.json"),
};
