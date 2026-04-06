import type { GameModeConfig } from "@/data/game-mode-types";
import provinces from "./provinces.json";

export interface CAProvinces {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
  capitalNative: string;
}

export const caProvincesMode: GameModeConfig = {
  id: "ca-provinces",
  titleKey: "mode.ca-provinces.title",
  questionOptions: [
    { labelKey: "content-type.ca-province-name", value: "name" },
    { labelKey: "content-type.ca-province-nameNative", value: "nameNative" },
    { labelKey: "content-type.ca-province-capital", value: "capital" },
    { labelKey: "content-type.ca-province-capitalNative", value: "capitalNative" },
  ],
  answerOptions: [
    { labelKey: "content-type.ca-province-name", value: "name" },
    { labelKey: "content-type.ca-province-nameNative", value: "nameNative" },
    { labelKey: "content-type.ca-province-capital", value: "capital" },
    { labelKey: "content-type.ca-province-capitalNative", value: "capitalNative" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
  },
  getItems: () => provinces,
};
