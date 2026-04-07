import type { GameModeConfig } from "@/data/game-mode-types";
import prefectures from "./prefectures.json";

export const jpPrefecturesMode: GameModeConfig = {
  id: "jp-prefectures",
  titleKey: "mode.jp-prefectures.title",
  questionOptions: [
    { labelKey: "content-type.jp-prefecture-name", value: "name" },
    { labelKey: "content-type.jp-prefecture-nameKana", value: "nameKana" },
    { labelKey: "content-type.jp-prefecture-capital", value: "capital" },
    {
      labelKey: "content-type.jp-prefecture-capitalKana",
      value: "capitalKana",
    },
  ],
  answerOptions: [
    { labelKey: "content-type.jp-prefecture-name", value: "name" },
    { labelKey: "content-type.jp-prefecture-nameKana", value: "nameKana" },
    { labelKey: "content-type.jp-prefecture-capital", value: "capital" },
    {
      labelKey: "content-type.jp-prefecture-capitalKana",
      value: "capitalKana",
    },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    nameKana: "text",
    capital: "text",
    capitalKana: "text",
  },
  getItems: () => prefectures,
};
