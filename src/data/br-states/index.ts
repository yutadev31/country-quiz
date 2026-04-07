import type { GameModeConfig } from "@/data/game-mode-types";
import states from "./states.json";

export const brStatesMode: GameModeConfig = {
  id: "br-states",
  titleKey: "mode.br-states.title",
  questionOptions: [
    { labelKey: "content-type.br-state-name", value: "name" },
    { labelKey: "content-type.br-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.br-state-capital", value: "capital" },
    { labelKey: "content-type.br-state-capitalNative", value: "capitalNative" },
  ],
  answerOptions: [
    { labelKey: "content-type.br-state-name", value: "name" },
    { labelKey: "content-type.br-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.br-state-capital", value: "capital" },
    { labelKey: "content-type.br-state-capitalNative", value: "capitalNative" },
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
