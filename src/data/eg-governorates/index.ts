import type { GameModeConfig } from "@/data/game-mode-types";
import { loadQuizItems } from "@/data/public-data";

export const egGovernoratesMode: GameModeConfig = {
  id: "eg-governorates",
  titleKey: "mode.eg-governorates.title",
  categoryId: "africa",
  questionOptions: [
    { labelKey: "content-type.eg-governorate.name", value: "name" },
    { labelKey: "content-type.eg-governorate.nameNative", value: "nameNative" },
    { labelKey: "content-type.eg-governorate.capital", value: "capital" },
    {
      labelKey: "content-type.eg-governorate.capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.eg-governorate.name", value: "name" },
    { labelKey: "content-type.eg-governorate.nameNative", value: "nameNative" },
    { labelKey: "content-type.eg-governorate.capital", value: "capital" },
    {
      labelKey: "content-type.eg-governorate.capitalNative",
      value: "capitalNative",
    },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    nameNative: "text",
    capital: "text",
    capitalNative: "text",
  },
  getItems: () => loadQuizItems("eg-governorates.json"),
};
