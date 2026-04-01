import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { shuffleArray } from "@/utils/array";

function QuestionContent<T extends Record<string, string | null>>({
  question,
  field,
  fieldDisplayTypes,
}: {
  question: T & { id: string };
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
}) {
  switch (fieldDisplayTypes[field]) {
    case "text":
      return <p className="font-bold text-3xl">{`${question[field]}`}</p>;
    case "img":
      return (
        <img
          alt=""
          src={`${question[field]}`}
          className="mx-auto h-32 object-contain drop-shadow-xl"
        />
      );
    case "id":
      throw Error("");
  }
}

function ChoiceContent<T extends Record<string, string | null>>({
  options,
  field,
  fieldDisplayTypes,
  onSelect,
}: {
  options: (T & { id: string })[];
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
  onSelect: (option: T & { id: string }) => void;
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
  option: T & { id: string };
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
  correctAnswer: T & { id: string };
  field: keyof T;
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
}) {
  switch (fieldDisplayTypes[field]) {
    case "text":
      return <span>{`${correctAnswer[field]}`}</span>;
    case "img":
      return (
        <img
          alt=""
          src={`${correctAnswer[field]}`}
          className="inline h-6 object-contain align-middle"
        />
      );
    case "id":
      throw Error("");
  }
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
}: {
  fieldDisplayTypes: { [K in keyof T]: "text" | "img" | "id" };
  items: (T & { id: string })[];
  questionField: keyof T;
  answerField: keyof T;
  questionCount: number;
  stopOnMistake: boolean;
  timeLimitSeconds: number | null;
  randomSeed: number;
  onRestart: () => void;
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
  const [correct, setCorrect] = useState<(T & { id: string }) | null>(null);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIncorrectCount((c) => c + 1);
      setIsCorrect(false);
      setCorrect(questions[current]);
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
        <div className="mt-16 flex flex-col items-center gap-6">
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
              const isCorrect = questions[current].id === choice.id;

              if (isCorrect) {
                setCorrectCount((c) => c + 1);
              } else {
                setIncorrectCount((c) => c + 1);
              }

              setIsCorrect(isCorrect);
              setCorrect(questions[current]);
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
