import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { shuffleArray } from "@/utils/array";

type QuizItem<T extends Record<string, string | null>> = T & { id: string };

type AnswerRecord<T extends Record<string, string | null>> = {
  question: QuizItem<T>;
  selectedAnswer: QuizItem<T> | null;
  isCorrect: boolean;
};

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
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
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
          className={`object-contain drop-shadow-xl ${imageClassName}`}
        />
      );
    case "id":
      throw Error("");
  }
}

function QuestionContent<T extends Record<string, string | null>>({
  question,
  field,
  fieldDisplayTypes,
}: {
  question: QuizItem<T>;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
}) {
  return (
    <FieldContent
      item={question}
      field={field}
      fieldDisplayTypes={fieldDisplayTypes}
      imageClassName="mx-auto h-32"
      textClassName="font-bold text-3xl"
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
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
  onSelect: (option: QuizItem<T>) => void;
}) {
  const layout =
    fieldDisplayTypes[field] === "img"
      ? "grid grid-cols-2 gap-4"
      : "flex flex-col gap-3";

  return (
    <div className={`mt-6 w-full ${layout}`}>
      {options.map((option) => (
        <ChoiceContentItem
          option={option}
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
  field,
  fieldDisplayTypes,
  onSelect,
}: {
  option: QuizItem<T>;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
  onSelect: () => void;
}) {
  switch (fieldDisplayTypes[field]) {
    case "text":
      return (
        <button
          type="button"
          onClick={onSelect}
          className="rounded-xl bg-blue-600 p-4 font-semibold text-lg transition hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98]"
        >
          {`${option[field]}`}
        </button>
      );
    case "img":
      return (
        <button
          type="button"
          onClick={onSelect}
          className="aspect-4/3 rounded-xl bg-zinc-800 shadow-md transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.97]"
        >
          <img
            alt=""
            src={`${option[field]}`}
            className="h-full w-full object-contain p-2"
          />
        </button>
      );
    case "id":
      throw Error("");
  }
}

function CorrectContent<T extends Record<string, string | null>>({
  correctAnswer,
  field,
  fieldDisplayTypes,
}: {
  correctAnswer: QuizItem<T>;
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
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
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
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

  const [current, setCurrent] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState<QuizItem<T> | null>(null);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord<T>[]>([]);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds ?? null);

  const { t } = useTranslation();

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
  }, [
    current,
    questions,
    choices,
    questionField,
    answerField,
    fieldDisplayTypes,
  ]);

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
      setIncorrectCount((c) => c + 1);
      setIsCorrect(false);
      setCorrect(currentQuestion);
      setAnswerRecords((records) => [
        ...records,
        {
          question: currentQuestion,
          selectedAnswer: null,
          isCorrect: false,
        },
      ]);
      setShowResult(true);

      if (stopOnMistake) {
        setCurrent(questions.length);
      } else {
        setCurrent((c) => c + 1);
        setTimeLeft(timeLimitSeconds || null);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => (t === null ? null : t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimitSeconds, timeLeft, current, questions, stopOnMistake]);

  useEffect(() => {
    if (!showResult) return;

    const timer = setTimeout(
      () => {
        setShowResult(false);
        setIsCorrect(null);
      },
      isCorrect ? 400 : 1500,
    );

    return () => clearTimeout(timer);
  }, [showResult, isCorrect]);

  return (
    <div className="relative flex w-full flex-col items-center gap-4 p-2">
      <div className="flex w-full rounded-lg bg-slate-800 px-4 py-2 text-center">
        <div className="flex w-full justify-center gap-4 py-2">
          <p className="font-bold">{t("title")}</p>
          {current >= 0 && current < questions.length && (
            <>
              <p>
                {current + 1}/{questions.length}
              </p>
              {timeLeft !== null && (
                <p
                  className={`font-bold ${timeLeft <= 3 ? "text-red-400" : ""}`}
                >
                  残り {timeLeft} 秒
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className={`fixed right-0 bottom-0 left-0 z-20 flex h-28 items-center justify-center backdrop-blur-sm ${isCorrect ? "bg-green-500/80" : "bg-red-500/80"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              {isCorrect ? (
                <p className="font-bold text-4xl">{t("message.correct")}</p>
              ) : (
                correct && (
                  <>
                    <p className="mb-2 text-3xl">{t("message.incorrect")}</p>
                    <p>
                      正解：
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

      {/* Main */}
      {current === -1 ? (
        <div className="mt-12 flex w-full flex-col items-center gap-6">
          <div className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-5 shadow-xl">
            <p className="mb-4 font-bold text-xl">{t("game.ready-title")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3"
                >
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <p className="mt-1 font-semibold text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrent(0);
              setTimeLeft(timeLimitSeconds || null);
            }}
            className="rounded-xl bg-blue-600 px-10 py-4 text-white text-xl hover:bg-blue-500"
          >
            {t("button.start")}
          </button>
          <a href="/country-quiz" className="text-blue-500 underline">
            {t("button.back-to-mode-selection")}
          </a>
        </div>
      ) : current >= questions.length ? (
        <>
          <div className="mt-12 w-full rounded-xl bg-zinc-800 p-6 shadow-xl">
            <p className="mb-4 font-bold text-2xl">{t("result.title")}</p>
            <p className="text-green-500">正解: {correctCount}</p>
            <p className="text-red-500">不正解: {incorrectCount}</p>
            <details className="mt-6 rounded-lg bg-zinc-900/80 p-4">
              <summary className="cursor-pointer font-semibold">
                {t("result.details-summary")}
              </summary>
              <div className="mt-4 space-y-3">
                {answerRecords.map((record, index) => (
                  <div
                    key={`${record.question.id}-${index}`}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 p-4"
                  >
                    <p
                      className={`font-bold ${record.isCorrect ? "text-green-400" : "text-red-400"}`}
                    >
                      {index + 1}.{" "}
                      {record.isCorrect
                        ? t("result.correct-label")
                        : t("result.incorrect-label")}
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div>
                        <p className="text-zinc-400">
                          {t("result.question-label")}
                        </p>
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
                        <p className="text-zinc-400">
                          {t("result.your-answer-label")}
                        </p>
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
                            <span className="text-zinc-300">
                              {t("result.no-answer")}
                            </span>
                          )}
                        </div>
                      </div>
                      {!record.isCorrect && (
                        <div>
                          <p className="text-zinc-400">
                            {t("result.correct-answer-label")}
                          </p>
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
            className="w-full rounded-xl bg-blue-600 p-4 font-semibold text-lg text-white transition hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98]"
            onClick={() => {
              onRestart();
            }}
          >
            {t("button.restart")}
          </button>
        </>
      ) : (
        <div className="w-full">
          <div className="overflow-clip rounded-xl bg-zinc-800 p-6 text-center shadow-xl">
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

              if (isCorrect) {
                setCorrectCount((c) => c + 1);
              } else {
                setIncorrectCount((c) => c + 1);
              }

              setIsCorrect(isCorrect);
              setCorrect(currentQuestion);
              setAnswerRecords((records) => [
                ...records,
                {
                  question: currentQuestion,
                  selectedAnswer: choice,
                  isCorrect,
                },
              ]);
              setShowResult(true);

              if (stopOnMistake && !isCorrect) {
                setCurrent(questions.length);
              } else {
                setCurrent((c) => c + 1);
                setTimeLeft(timeLimitSeconds || null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
