import states from "@/data/de-states/states.json";
import type { GameModeConfig } from "@/data/game-mode-types";

export interface FRRegion {
  id: string;
  name: string;
  capital: string;
}

export const deStatesMode: GameModeConfig = {
  id: "de-states",
  titleKey: "mode.de-states.title",
  descriptionKey: "mode.de-states.description",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.state-name", value: "name" },
    { labelKey: "content-type.state-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.state-name", value: "name" },
    { labelKey: "content-type.state-capital", value: "capital" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    capital: "text",
  },
  getItems: () =>
    states.map((region, index) => ({
      id: `${index}`,
      name: region.name,
      capital: region.capital,
    })),
  normalizeQuestionField: (value) => {
    if (value === "capital") {
      return value;
    }
    return "name";
  },
  normalizeAnswerField: (value) => {
    if (value === "name") {
      return value;
    }
    return "capital";
  },
};
