export type GameModeId =
  | "countries"
  | "countries-asia"
  | "countries-europe"
  | "countries-africa"
  | "countries-north-america"
  | "countries-south-america"
  | "countries-oceania"
  | "us-states"
  | "ca-provinces"
  | "mx-states"
  | "br-states"
  | "fr-regions"
  | "de-states"
  | "ru-subjects"
  | "jp-prefectures";

export type GameModeCategoryId =
  | "countries"
  | "asia"
  | "europe"
  | "africa"
  | "north-america"
  | "south-america"
  | "oceania";

export type FieldDisplayType = "text" | "img";

export type QuizItem = Record<string, string | string[] | null> & {
  id: string;
};

export type FieldOption = {
  labelKey: string;
  value: string;
};

export type GetItemsArgs = {
  area: string;
};

export type GameModeConfig = {
  id: GameModeId;
  titleKey: string;
  fixedArea?: string;
  categoryId?: Exclude<GameModeCategoryId, "countries">;
  questionOptions: FieldOption[];
  answerOptions: FieldOption[];
  defaultQuestionField: string;
  defaultAnswerField: string;
  fieldDisplayTypes: Record<string, FieldDisplayType>;
  getItems: (args: GetItemsArgs) => Promise<QuizItem[]>;
};

export type GameModeCategory = {
  id: GameModeCategoryId;
  modeIds: GameModeId[];
};
