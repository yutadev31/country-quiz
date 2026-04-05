import type { GameModeConfig } from "@/data/game-mode-types";
import provinces from "./provinces.json";

export interface CAProvinces {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
}

export const caStateMode: GameModeConfig = {
  id: "ca-provinces",
  titleKey: "mode.ca-provinces.title",
  hasAreaSelection: false,
  questionOptions: [
    { labelKey: "content-type.ca-province-name", value: "name" },
    { labelKey: "content-type.ca-province-nameNative", value: "nameNative" },
    { labelKey: "content-type.ca-province-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.ca-province-name", value: "name" },
    { labelKey: "content-type.ca-province-nameNative", value: "nameNative" },
    { labelKey: "content-type.ca-province-capital", value: "capital" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    id: "id",
    name: "text",
    nameNative: "text",
    capital: "text",
  },
  getItems: () =>
    provinces.map((province) => ({
      id: province.code,
      name: province.name,
      nameNative: province.nameNative,
      capital: province.capital,
    })),
  normalizeQuestionField: (value) => {
    if (value === "capital" || value === "nameNative") {
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
