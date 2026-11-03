import { AnimatePresence, motion } from "motion/react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuCheck, LuTrophy, LuX } from "react-icons/lu";
import { useStore } from "zustand";

import type { FieldDisplayType } from "@/data/game-mode-types";
import { createGameStore, type QuizItem } from "@/stores/game";
import { shuffleArray } from "@/utils/array";

type GameSummaryItem = {
  label: string;
  value: string;
};

function FieldContent<T extends Record<string, string | null>>({
  item,
  field,
  fieldDisplayTypes,
  imageClassName = "h-32",
  textClassName = "",
}: {
  item: QuizItem<T>;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: FieldDisplayType };
  imageClassName?: string;
  textClassName?: string;
}) {
  switch (fieldDisplayTypes[field]) {
    case "text":
      return <span className={textClassName}>{`${item[field]}`}</span>;
    case "img":
      return (
        <img
          alt=""
          src={`${item[field]}`}
          className={`max-w-full object-contain drop-shadow-xl ${imageClassName}`}
        />
      );
  }
}

function QuestionContent<T extends Record<string, string | null>>({
  question,
  field,
  fieldDisplayTypes,
}: {
  question: QuizItem<T>;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: FieldDisplayType };
}) {
  return (
    <FieldContent
      item={question}
      field={field}
      fieldDisplayTypes={fieldDisplayTypes}
      imageClassName="mx-auto h-24 sm:h-32 max-w-full"
      textClassName="font-bold text-xl sm:text-3xl break-words"
    />
  );
}

function ChoiceContent<T extends Record<string, string | null>>({
  options,
  field,
  fieldDisplayTypes,
  onSelect,
}: {
  options: QuizItem<T>[];
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: FieldDisplayType };
  onSelect: (option: QuizItem<T>) => void;
}) {
  const layout =
    fieldDisplayTypes[field] === "img"
      ? "grid grid-cols-2 gap-2 sm:gap-4"
      : "flex flex-col gap-2 sm:gap-3";

  return (
    <div className={`game-choices mt-3 w-full sm:mt-6 ${layout}`}>
      {options.map((option, index) => (
        <ChoiceContentItem
          option={option}
          index={index}
          key={option.id}
          field={field}
          fieldDisplayTypes={fieldDisplayTypes}
          onSelect={() => onSelect(option)}
        />
      ))}
    </div>
  );
}

function ChoiceContentItem<T extends Record<string, string | null>>({
  option,
  index,
  field,
  fieldDisplayTypes,
  onSelect,
}: {
  option: QuizItem<T>;
  index: number;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: FieldDisplayType };
  onSelect: () => void;
}) {
  switch (fieldDisplayTypes[field]) {
    case "text":
      return (
        <button
          type="button"
          onClick={onSelect}
          className="relative min-h-12 rounded-2xl border border-blue-400/30 bg-blue-600/20 p-3 text-left text-base font-semibold break-words transition hover:border-blue-400 hover:bg-blue-600/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 active:scale-[0.98] motion-reduce:transform-none sm:min-h-16 sm:p-4 sm:text-lg"
        >
          {`${option[field]}`}
        </button>
      );
    case "img":
      return (
        <button
          type="button"
          onClick={onSelect}
          aria-label={`選択肢 ${index + 1}`}
          className="relative aspect-4/3 rounded-2xl border border-zinc-700 bg-zinc-800 shadow-md transition hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 active:scale-[0.97] motion-reduce:transform-none"
        >
          <img
            alt=""
            src={`${option[field]}`}
            draggable={false}
            className="h-full w-full object-contain p-2"
          />
        </button>
      );
  }
}

function CorrectContent<T extends Record<string, string | null>>({
  correctAnswer,
  field,
  fieldDisplayTypes,
}: {
  correctAnswer: QuizItem<T>;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: FieldDisplayType };
}) {
  return (
    <FieldContent
      item={correctAnswer}
      field={field}
      fieldDisplayTypes={fieldDisplayTypes}
      imageClassName="inline h-6 align-middle"
    />
  );
}

export default function Game<T extends Record<string, string | null>>({
  fieldDisplayTypes,
  items,
  questionField,
  answerField,
  questionCount,
  stopOnMistake,
  timeLimitSeconds,
  randomSeed,
  onRestart,
  summaryItems,
}: {
  fieldDisplayTypes: { [K in keyof T]: FieldDisplayType };
  items: QuizItem<T>[];
  questionField: keyof T;
  answerField: keyof T;
  questionCount: number;
  stopOnMistake: boolean;
  timeLimitSeconds: number | null;
  randomSeed: number;
  onRestart: () => void;
  summaryItems: GameSummaryItem[];
}) {
  const questions = useMemo(() => {
    return shuffleArray(items, randomSeed).slice(0, questionCount);
  }, [questionCount, randomSeed, items]);

  const choices = useMemo(() => {
    return questions.map((q, index) => {
      const usedAnswerValues = new Set<string>();
      const questionAnswerValue = q[answerField];

      if (questionAnswerValue !== null) {
        usedAnswerValues.add(questionAnswerValue);
      }

      const distractors = shuffleArray(
        items.filter(
          (c) =>
            c.id !== q.id &&
            c[questionField] !== q[questionField] &&
            c[answerField] !== q[answerField],
        ),
        randomSeed + index + 1024,
      )
        .filter((choice) => {
          const answerValue = choice[answerField];
          if (answerValue === null || usedAnswerValues.has(answerValue)) {
            return false;
          }

          usedAnswerValues.add(answerValue);
          return true;
        })
        .slice(0, 3);

      return shuffleArray([q, ...distractors], randomSeed + index);
    });
  }, [questions, randomSeed, items, answerField, questionField]);

  const [store] = useState(() => createGameStore<T>(timeLimitSeconds));
  const state = useStore(store);
  const dispatch = state.dispatch;
  const {
    current,
    showResult,
    isCorrect,
    correct,
    answerRecords,
    correctCount,
    incorrectCount,
    timeLeft,
  } = state;

  const { t } = useTranslation();
  const [, setPage] = useQueryState("page");

  useEffect(() => {
    if (fieldDisplayTypes[questionField] === "img") {
      const nextQuestion = questions[current + 1];
      if (!nextQuestion) return;

      const img = new Image();
      img.src = `${nextQuestion[questionField]}`;
    }

    if (fieldDisplayTypes[answerField] === "img") {
      const nextChoices = choices[current + 1];
      if (!nextChoices) return;

      nextChoices.forEach((choice) => {
        if (!choice) return;

        const img = new Image();
        img.src = `${choice[answerField]}`;
      });
    }
  }, [current, questions, choices, questionField, answerField, fieldDisplayTypes]);

  useEffect(() => {
    if (
      current === -1 ||
      current === questions.length ||
      timeLimitSeconds === null ||
      timeLeft === null
    ) {
      return;
    }

    if (timeLeft <= 0) {
      const currentQuestion = questions[current];

      // eslint-disable-next-line react-hooks/set-state-in-effect
      dispatch({
        type: "timeout",
        question: currentQuestion,
        stopOnMistake,
        questionCount: questions.length,
        timeLimitSeconds,
      });
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimitSeconds, timeLeft, current, questions, stopOnMistake, dispatch]);

  useEffect(() => {
    if (!showResult) return;

    const timer = setTimeout(() => {
      dispatch({ type: "clearResult" });
    }, 2000);

    return () => clearTimeout(timer);
  }, [showResult, isCorrect, dispatch]);

  return (
    <div className="game-layout relative flex w-full min-w-0 flex-col items-center gap-3 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:gap-5 sm:p-4 sm:pb-8">
      <div className="game-header flex w-full flex-col rounded-2xl border border-blue-400/20 bg-zinc-900 px-4 py-2 text-center shadow-lg">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2">
          <p className="font-bold">{t("title")}</p>
          {current >= 0 && current < questions.length && (
            <>
              <p>
                {current + 1}/{questions.length}
              </p>
              {timeLeft !== null && (
                <p className={`font-bold ${timeLeft <= 3 ? "text-red-400" : ""}`}>
                  {t("game.remaining", { count: timeLeft })}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {current >= 0 && (
        <div className="w-full">
          <div className="mb-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm text-zinc-400">
            <span>
              {t("game.progress", { count: answerRecords.length, total: questions.length })}
            </span>
            <span className="text-emerald-300">
              {t("game.correct-count", { count: correctCount })}
            </span>
          </div>
          <progress
            aria-label={t("game.progress-label")}
            max={Math.max(1, questions.length)}
            value={answerRecords.length}
            className="h-2 w-full overflow-hidden rounded-full accent-blue-500 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-blue-500 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-zinc-800 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-blue-500"
          />
        </div>
      )}

      {/* Main */}
      {current === -1 ? (
        <div className="mt-2 flex w-full flex-col items-center gap-6">
          <div className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 shadow-xl sm:p-5">
            <p className="mb-4 text-xl font-bold">{t("game.ready-title")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3"
                >
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <p className="mt-1 font-semibold text-zinc-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "start", timeLimitSeconds: timeLimitSeconds || null });
            }}
            className="w-full rounded-2xl bg-blue-600 px-10 py-4 text-xl font-bold text-white shadow-lg shadow-blue-600/20 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
          >
            {t("button.start")}
          </button>
          <a
            href="/country-quiz"
            onClick={(e) => {
              e.preventDefault();
              void setPage("");
            }}
            className="text-blue-500 underline"
          >
            {t("button.back-to-mode-selection")}
          </a>
        </div>
      ) : current >= questions.length ? (
        <>
          <div className="mt-2 w-full rounded-xl bg-zinc-800 p-4 shadow-xl sm:p-6">
            <p className="mb-4 text-2xl font-bold">{t("result.title")}</p>
            <LuTrophy aria-hidden="true" className="mx-auto mb-3 h-12 w-12 text-amber-300" />
            <p className="text-center text-5xl font-black text-blue-200">
              {correctCount}
              <span className="text-xl text-zinc-400"> / {answerRecords.length}</span>
            </p>
            <p className="mt-3 text-center text-amber-300">
              {t("game.accuracy", {
                value: answerRecords.length
                  ? Math.round((correctCount / answerRecords.length) * 100)
                  : 0,
              })}
            </p>
            <p className="mt-2 text-center text-zinc-400">
              {t("game.progress", { count: answerRecords.length, total: questions.length })}
            </p>
            <p className="mt-3 text-center text-red-300">
              {t("game.incorrect-count", { count: incorrectCount })}
            </p>
            <details className="mt-6 rounded-lg bg-zinc-900/80 p-2 sm:p-4">
              <summary className="cursor-pointer font-semibold">
                {t("result.details-summary")}
              </summary>
              <div className="mt-4 space-y-3">
                {answerRecords.map((record, index) => (
                  <div
                    key={`${record.question.id}-${index}`}
                    className="min-w-0 rounded-lg border border-zinc-700 bg-zinc-800 p-3 break-words sm:p-4"
                  >
                    <p
                      className={`font-bold ${record.isCorrect ? "text-green-400" : "text-red-400"}`}
                    >
                      {index + 1}.{" "}
                      {record.isCorrect ? t("result.correct-label") : t("result.incorrect-label")}
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div>
                        <p className="text-zinc-400">{t("result.question-label")}</p>
                        <div className="mt-1">
                          <FieldContent
                            item={record.question}
                            field={questionField}
                            fieldDisplayTypes={fieldDisplayTypes}
                            imageClassName="h-20"
                            textClassName="font-medium text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-zinc-400">{t("result.your-answer-label")}</p>
                        <div className="mt-1">
                          {record.selectedAnswer ? (
                            <FieldContent
                              item={record.selectedAnswer}
                              field={answerField}
                              fieldDisplayTypes={fieldDisplayTypes}
                              imageClassName="h-16"
                              textClassName="font-medium text-base"
                            />
                          ) : (
                            <span className="text-zinc-300">{t("result.no-answer")}</span>
                          )}
                        </div>
                      </div>
                      {!record.isCorrect && (
                        <div>
                          <p className="text-zinc-400">{t("result.correct-answer-label")}</p>
                          <div className="mt-1">
                            <FieldContent
                              item={record.question}
                              field={answerField}
                              fieldDisplayTypes={fieldDisplayTypes}
                              imageClassName="h-16"
                              textClassName="font-medium text-base"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 p-4 text-lg font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98]"
            onClick={() => {
              onRestart();
            }}
          >
            {t("button.restart")}
          </button>
          <a
            href="/country-quiz"
            onClick={(e) => {
              setPage("");
              e.preventDefault();
            }}
            className="text-blue-500 underline underline-offset-4"
          >
            {t("button.back-to-mode-selection")}
          </a>
        </>
      ) : (
        <div className="w-full">
          <div className="game-question flex min-h-36 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-center shadow-xl sm:min-h-52 sm:p-6">
            <QuestionContent
              question={questions[current]}
              field={questionField}
              fieldDisplayTypes={fieldDisplayTypes}
            />
          </div>

          <ChoiceContent
            options={choices[current]}
            field={answerField}
            fieldDisplayTypes={fieldDisplayTypes}
            onSelect={(choice) => {
              const currentQuestion = questions[current];
              const isCorrect = currentQuestion.id === choice.id;

              dispatch({
                type: "answer",
                question: currentQuestion,
                selectedAnswer: choice,
                isCorrect,
                stopOnMistake,
                questionCount: questions.length,
                timeLimitSeconds,
              });
            }}
          />
        </div>
      )}
      {/* Previous-answer feedback occupies its own space. */}
      <div className="game-feedback min-h-32 w-full" aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {showResult && (
            <motion.div
              className={`flex min-h-28 w-full items-center justify-center rounded-2xl border border-white/10 p-3 ${isCorrect ? "bg-green-500/80" : "bg-red-500/80"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="min-w-0 text-center break-words">
                <p className="mb-1 text-xs font-semibold">{t("game.previous-result")}</p>
                {isCorrect ? (
                  <LuCheck className="mx-auto h-6 w-6" aria-hidden="true" />
                ) : (
                  <LuX className="mx-auto h-6 w-6" aria-hidden="true" />
                )}
                {isCorrect ? (
                  <p className="text-4xl font-bold">{t("message.correct")}</p>
                ) : (
                  correct && (
                    <>
                      <p className="mb-2 text-3xl">{t("message.incorrect")}</p>
                      <p>
                        {t("result.correct-answer-label")}：
                        <CorrectContent
                          correctAnswer={correct}
                          field={answerField}
                          fieldDisplayTypes={fieldDisplayTypes}
                        />
                      </p>
                    </>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
