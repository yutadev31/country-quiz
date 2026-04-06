import type { GameModeConfig } from "@/data/game-mode-types";
import states from "./states.json";

export interface MXState {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
  capitalNative: string;
}

export const mxStatesMode: GameModeConfig = {
  id: "mx-states",
  titleKey: "mode.mx-states.title",
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
  getItems: () => states,
};
