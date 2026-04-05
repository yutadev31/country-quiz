import type { GameModeConfig } from "@/data/game-mode-types";
import states from "./states.json";

export interface DEState {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
}

export const deStatesMode: GameModeConfig = {
  id: "de-states",
  titleKey: "mode.de-states.title",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.de-state-name", value: "name" },
    { labelKey: "content-type.de-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.de-state-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.de-state-name", value: "name" },
    { labelKey: "content-type.de-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.de-state-capital", value: "capital" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    nameNative: "text",
    capital: "text",
  },
  getItems: () => states,
  normalizeQuestionField: (value) => {
    if (value === "nameNative" || value === "capital") {
      return value;
    }
    return "name";
  },
  normalizeAnswerField: (value) => {
    if (value === "name" || value === "nameNative") {
      return value;
    }
    return "capital";
  },
};
