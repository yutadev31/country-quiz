import type { GameModeConfig } from "@/data/game-mode-types";
import states from "./states.json";

export interface USState {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
  flag: string;
}

export const usStatesMode: GameModeConfig = {
  id: "us-states",
  titleKey: "mode.us-states.title",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.us-state-name", value: "name" },
    { labelKey: "content-type.us-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.us-state-capital", value: "capital" },
    { labelKey: "content-type.us-state-flag", value: "flag" },
  ],
  answerOptions: [
    { labelKey: "content-type.us-state-name", value: "name" },
    { labelKey: "content-type.us-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.us-state-capital", value: "capital" },
    { labelKey: "content-type.us-state-flag", value: "flag" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "flag",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    flag: "img",
  },
  getItems: () => states,
};
