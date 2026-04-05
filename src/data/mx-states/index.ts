import type { GameModeConfig } from "@/data/game-mode-types";
import states from "./states.json";

export interface MXState {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
}

export const mxStatesMode: GameModeConfig = {
  id: "mx-states",
  titleKey: "mode.mx-states.title",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.mx-state-name", value: "name" },
    { labelKey: "content-type.mx-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.mx-state-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.mx-state-name", value: "name" },
    { labelKey: "content-type.mx-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.mx-state-capital", value: "capital" },
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
