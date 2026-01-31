import type { Country } from "@/types/country";
import { shuffleArray } from "@/utils/array";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type ContentType = "name" | "capital" | "domain" | "flag";

function QuestionContent({
  country,
  content,
}: {
  country: Country;
  content: ContentType;
}) {
  switch (content) {
    case "name":
      return <p className="text-3xl font-bold">{country.name}</p>;
    case "capital":
      return <p className="text-3xl font-bold">{country.capital}</p>;
    case "domain":
      return <p className="text-3xl font-bold">{country.tld}</p>;
    case "flag":
      return (
        <img
          src={`https://flagcdn.com/${country.code}.svg`}
          className="mx-auto h-32 object-contain drop-shadow-xl"
        />
      );
  }
}

function ChoiceContent({
  choices,
  content,
  onClick,
}: {
  choices: Country[];
  content: ContentType;
  onClick: (choice: Country) => void;
}) {
  const layout =
    content === "flag" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3";

  return (
    <div className={`mt-6 w-full ${layout}`}>
      {choices.map((choice) => (
        <ChoiceContentItem
          key={choice.code}
          country={choice}
          content={content}
          onClick={() => onClick(choice)}
        />
      ))}
    </div>
  );
}

function ChoiceContentItem({
  country,
  content,
  onClick,
}: {
  country: Country;
  content: ContentType;
  onClick: () => void;
}) {
  if (content === "flag") {
    return (
      <button
        onClick={onClick}
        className="aspect-4/3 rounded-xl bg-zinc-800 shadow-md transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.97]"
      >
        <img
          src={`https://flagcdn.com/${country.code}.svg`}
          className="h-full w-full object-contain p-2"
        />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-blue-600 p-4 text-lg font-semibold transition hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98]"
    >
      {content === "name" && country.name}
      {content === "capital" && country.capital}
      {content === "domain" && country.tld}
    </button>
  );
}

function CorrectContent({
  country,
  content,
}: {
  country: Country;
  content: ContentType;
}) {
  switch (content) {
    case "name":
      return <span>{country.name}</span>;
    case "capital":
      return <span>{country.capital}</span>;
    case "domain":
      return <span>{country.tld}</span>;
    case "flag":
      return (
        <img
          src={`https://flagcdn.com/${country.code}.svg`}
          className="inline h-6 object-contain align-middle"
        />
      );
  }
}

export default function Game({
  countries,
  questionKind,
  choiceKind,
  count,
  oneShotMode,
  timeLimit,
  seed,
  next,
}: {
  countries: Country[];
  questionKind: ContentType;
  choiceKind: ContentType;
  count: number;
  oneShotMode: boolean;
  timeLimit: number | null;
  seed: number;
  next: () => void;
}) {
  const questions = useMemo(() => {
    return shuffleArray(countries, seed).slice(0, count);
  }, [countries, count, seed]);

  const choices = useMemo(() => {
    return questions.map((q, index) =>
      shuffleArray(
        [
          q,
          ...shuffleArray(
            countries.filter((c) => c.code !== q.code),
            seed + index + 1024,
          ).slice(0, 3),
        ],
        seed + index,
      ),
    );
  }, [questions, countries, seed]);

  const [current, setCurrent] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState<Country | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? null);

  const { t } = useTranslation();

  useEffect(() => {
    if (questionKind === "flag") {
      const next = questions[current + 1];
      if (!next) return;

      const img = new Image();
      img.src = `https://flagcdn.com/${next.code}.svg`;
    }

    if (choiceKind === "flag") {
      const next = choices[current + 1];
      if (!next) return;

      next.forEach((choice) => {
        if (!choice) return;

        const img = new Image();
        img.src = `https://flagcdn.com/${choice.code}.svg`;
      });
    }
  }, [current, questions, choices, questionKind, choiceKind, timeLimit]);

  useEffect(() => {
    if (
      current === -1 ||
      current === questions.length ||
      timeLimit === null ||
      timeLeft === null
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setIncorrectCount((c) => c + 1);
      setIsCorrect(false);
      setCorrect(questions[current]);
      setShowResult(true);

      if (oneShotMode) {
        setCurrent(questions.length);
      } else {
        setCurrent((c) => c + 1);
        setTimeLeft(timeLimit || null);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => (t === null ? null : t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, timeLeft, current, questions, oneShotMode, showResult]);

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
  }, [showResult]);

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
                <p className="text-4xl font-bold">{t("message.correct")}</p>
              ) : (
                <>
                  <p className="mb-2 text-3xl">{t("message.incorrect")}</p>
                  <p>
                    正解：
                    <CorrectContent content={choiceKind} country={correct!} />
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      {current === -1 ? (
        <div className="mt-16 flex flex-col items-center gap-6">
          <button
            onClick={() => {
              setCurrent(0);
              setTimeLeft(timeLimit || null);
            }}
            className="rounded-xl bg-blue-600 px-10 py-4 text-xl text-white hover:bg-blue-500"
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
            <p className="mb-4 text-2xl font-bold">{t("result.title")}</p>
            <p className="text-green-500">正解: {correctCount}</p>
            <p className="text-red-500">不正解: {incorrectCount}</p>
          </div>
          <button
            className="w-full rounded-xl bg-blue-600 p-4 text-lg font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-500 active:scale-[0.98]"
            onClick={() => {
              next();
            }}
          >
            {t("button.restart")}
          </button>
        </>
      ) : (
        <div className="w-full">
          <div className="overflow-clip rounded-xl bg-zinc-800 p-6 text-center shadow-xl">
            <QuestionContent
              country={questions[current]}
              content={questionKind}
            />
          </div>

          <ChoiceContent
            choices={choices[current]}
            content={choiceKind}
            onClick={(choice) => {
              const isCorrect = questions[current].code === choice.code;

              if (isCorrect) {
                setCorrectCount((c) => c + 1);
              } else {
                setIncorrectCount((c) => c + 1);
              }

              setIsCorrect(isCorrect);
              setCorrect(questions[current]);
              setShowResult(true);

              if (oneShotMode && !isCorrect) {
                setCurrent(questions.length);
              } else {
                setCurrent((c) => c + 1);
                setTimeLeft(timeLimit || null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
