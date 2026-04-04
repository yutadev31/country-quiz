export type GameModeId =
  | "countries"
  | "us-states"
  | "ca-provinces"
  | "fr-regions"
  | "de-states";

export type FieldDisplayType = "text" | "img" | "id";

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
  descriptionKey: string;
  hasAreaSelection: boolean;
  questionOptions: FieldOption[];
  answerOptions: FieldOption[];
  defaultQuestionField: string;
  defaultAnswerField: string;
  fieldDisplayTypes: Record<string, FieldDisplayType>;
  getItems: (args: GetItemsArgs) => QuizItem[];
  normalizeQuestionField: (value: string | null) => string;
  normalizeAnswerField: (value: string | null) => string;
};
