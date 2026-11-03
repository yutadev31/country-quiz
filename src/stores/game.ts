import { createStore } from "zustand/vanilla";

export type QuizItem<T extends Record<string, string | null>> = T & { id: string };

type AnswerRecord<T extends Record<string, string | null>> = {
  question: QuizItem<T>;
  selectedAnswer: QuizItem<T> | null;
  isCorrect: boolean;
};

type GameState<T extends Record<string, string | null>> = {
  current: number;
  showResult: boolean;
  isCorrect: boolean | null;
  correct: QuizItem<T> | null;
  answerRecords: AnswerRecord<T>[];
  correctCount: number;
  incorrectCount: number;
  timeLeft: number | null;
};

type GameAction<T extends Record<string, string | null>> =
  | { type: "start"; timeLimitSeconds: number | null }
  | { type: "tick" }
  | {
      type: "answer";
      question: QuizItem<T>;
      selectedAnswer: QuizItem<T>;
      isCorrect: boolean;
      stopOnMistake: boolean;
      questionCount: number;
      timeLimitSeconds: number | null;
    }
  | {
      type: "timeout";
      question: QuizItem<T>;
      stopOnMistake: boolean;
      questionCount: number;
      timeLimitSeconds: number | null;
    }
  | { type: "clearResult" };

function createInitialGameState<T extends Record<string, string | null>>(
  timeLimitSeconds: number | null,
): GameState<T> {
  return {
    current: -1,
    showResult: false,
    isCorrect: null,
    correct: null,
    answerRecords: [],
    correctCount: 0,
    incorrectCount: 0,
    timeLeft: timeLimitSeconds,
  };
}

function gameReducer<T extends Record<string, string | null>>(
  state: GameState<T>,
  action: GameAction<T>,
): GameState<T> {
  switch (action.type) {
    case "start":
      return { ...state, current: 0, timeLeft: action.timeLimitSeconds };
    case "tick":
      return state.timeLeft === null ? state : { ...state, timeLeft: state.timeLeft - 1 };
    case "answer":
    case "timeout": {
      const isCorrect = action.type === "answer" && action.isCorrect;
      const selectedAnswer = action.type === "answer" ? action.selectedAnswer : null;
      return {
        ...state,
        current: action.stopOnMistake && !isCorrect ? action.questionCount : state.current + 1,
        showResult: true,
        isCorrect,
        correct: action.question,
        answerRecords: [
          ...state.answerRecords,
          { question: action.question, selectedAnswer, isCorrect },
        ],
        correctCount: state.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: state.incorrectCount + (isCorrect ? 0 : 1),
        timeLeft:
          action.stopOnMistake && !isCorrect ? state.timeLeft : action.timeLimitSeconds || null,
      };
    }
    case "clearResult":
      return { ...state, showResult: false, isCorrect: null };
  }
}

export function createGameStore<T extends Record<string, string | null>>(
  timeLimitSeconds: number | null,
) {
  return createStore<GameState<T> & { dispatch: (action: GameAction<T>) => void }>()((set) => ({
    ...createInitialGameState<T>(timeLimitSeconds),
    dispatch: (action) => set((state) => gameReducer(state, action)),
  }));
}
