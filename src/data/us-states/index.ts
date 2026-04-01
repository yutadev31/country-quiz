import type { GameModeConfig } from "@/data/game-mode-types";
import states from "@/data/us-states/states.json";

export interface USState {
  id: string;
  name: string;
  capital: string;
  flag: string;
}

export const usStatesMode: GameModeConfig = {
  id: "us-states",
  titleKey: "mode.us-states.title",
  descriptionKey: "mode.us-states.description",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.state-name", value: "name" },
    { labelKey: "content-type.state-capital", value: "capital" },
    { labelKey: "content-type.state-flag", value: "flag" },
  ],
  answerOptions: [
    { labelKey: "content-type.state-name", value: "name" },
    { labelKey: "content-type.state-capital", value: "capital" },
    { labelKey: "content-type.state-flag", value: "flag" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "flag",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    capital: "text",
    flag: "img",
  },
  getItems: () =>
    states.map((state) => ({
      id: state.code,
      name: state.name,
      capital: state.capital,
      flag: `https://flagcdn.com/${state.code}.svg`,
    })),
  normalizeQuestionField: (value) => {
    if (value === "capital" || value === "flag") {
      return value;
    }
    return "name";
  },
  normalizeAnswerField: (value) => {
    if (value === "name" || value === "capital") {
      return value;
    }
    return "flag";
  },
};
