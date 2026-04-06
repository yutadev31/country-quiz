import type { GameModeConfig } from "@/data/game-mode-types";
import states from "./states.json";

export interface BRProvinces {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
}

export const brStatesMode: GameModeConfig = {
  id: "br-states",
  titleKey: "mode.br-states.title",
  questionOptions: [
    { labelKey: "content-type.br-state-name", value: "name" },
    { labelKey: "content-type.br-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.br-state-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.br-state-name", value: "name" },
    { labelKey: "content-type.br-state-nameNative", value: "nameNative" },
    { labelKey: "content-type.br-state-capital", value: "capital" },
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
