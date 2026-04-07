import type { GameModeConfig } from "@/data/game-mode-types";
import subjects from "./subjects.json";

export const ruSubjectsMode: GameModeConfig = {
  id: "ru-subjects",
  titleKey: "mode.ru-subjects.title",
  questionOptions: [
    { labelKey: "content-type.ru-subject-name", value: "name" },
    { labelKey: "content-type.ru-subject-nameNative", value: "nameNative" },
    { labelKey: "content-type.ru-subject-capital", value: "capital" },
    {
      labelKey: "content-type.ru-subject-capitalNative",
      value: "capitalNative",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.ru-subject-name", value: "name" },
    { labelKey: "content-type.ru-subject-nameNative", value: "nameNative" },
    { labelKey: "content-type.ru-subject-capital", value: "capital" },
    {
      labelKey: "content-type.ru-subject-capitalNative",
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
  getItems: () => subjects,
};
