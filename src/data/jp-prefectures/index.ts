import type { GameModeConfig } from "@/data/game-mode-types";
import prefectures from "./prefectures.json";

export interface JPPrefecture {
  id: string;
  name: string;
  nameNative: string;
  capital: string;
}

export const jpPrefecturesMode: GameModeConfig = {
  id: "jp-prefectures",
  titleKey: "mode.jp-prefectures.title",
  questionOptions: [
    { labelKey: "content-type.jp-prefecture-name", value: "name" },
    { labelKey: "content-type.jp-prefecture-capital", value: "capital" },
  ],
  answerOptions: [
    { labelKey: "content-type.jp-prefecture-name", value: "name" },
    { labelKey: "content-type.jp-prefecture-capital", value: "capital" },
  ],
  defaultQuestionField: "name",
  defaultAnswerField: "capital",
  fieldDisplayTypes: {
    name: "text",
    capital: "text",
  },
  getItems: () => prefectures,
};
