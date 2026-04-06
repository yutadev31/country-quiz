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
    name: "text",
    nameNative: "text",
    capital: "text",
  },
  getItems: () => states,
};
