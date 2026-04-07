import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Game from "@/components/Game";
import type { FieldDisplayType, QuizItem } from "@/data/game-mode-types";
import { gameModes, isGameModeId } from "@/data/game-modes";
import { shuffleArray } from "@/utils/array";

function normalizeField(
  value: string | null,
  defaultField: string,
  fieldDisplayTypes: Record<string, FieldDisplayType>,
) {
  if (value && fieldDisplayTypes[value]) {
    return value;
  }

  return defaultField;
}

export default function GamePage() {
  const { t } = useTranslation();
  const [modeParam] = useQueryState("mode");
  const [questionFieldParam] = useQueryState("question");
  const [answerFieldParam] = useQueryState("choice");
  const [countParam] = useQueryState("count");
  const [stopOnMistakeParam] = useQueryState("oneShotMode");
  const [timeLimitParam] = useQueryState("timeLimit");

  const [randomSeed, setRandomSeed] = useState(
    // eslint-disable-next-line react-hooks/purity
    Math.floor(Math.random() * 4096),
  );

  const parseCount = <T,>(items: T[], count: string | undefined) => {
    if (count === undefined) {
      return 10;
    } else if (count === "all") {
      return items.length;
    } else {
      return parseInt(count, 10);
    }
  };

  const parseTimeLimit = (timeLimit: string | null) => {
    if (timeLimit === null) {
      return null;
    } else {
      return parseInt(timeLimit, 10);
    }
  };

  const mode = isGameModeId(modeParam) ? modeParam : "countries";
  const modeConfig = gameModes[mode];
  const area = modeConfig.fixedArea ?? "all";
  const questionField = normalizeField(
    questionFieldParam,
    modeConfig.defaultQuestionField,
    modeConfig.fieldDisplayTypes,
  );
  const answerField = normalizeField(
    answerFieldParam,
    modeConfig.defaultAnswerField,
    modeConfig.fieldDisplayTypes,
  );
  const questionType = modeConfig.questionOptions.find(
    (option) => option.value === questionField,
  );
  const choiceType = modeConfig.answerOptions.find(
    (option) => option.value === answerField,
  );
  const timeLimitSeconds = parseTimeLimit(timeLimitParam);
  const stopOnMistake = stopOnMistakeParam === "on";
  const [items, setItems] = useState<(Record<string, string | null> & {
    id: string;
  })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setLoadError(null);

    modeConfig
      .getItems({ area })
      .then((loadedItems) => {
        if (cancelled) {
          return;
        }

        const normalizedItems = loadedItems
          .filter((item) => item[questionField] && item[answerField])
          .map((item: QuizItem) => {
            const result: Record<string, string | null> & { id: string } = {
              id: item.id,
            };

            for (const key in item) {
              result[key] = Array.isArray(item[key])
                ? shuffleArray(item[key]).find((candidate) => candidate) || null
                : item[key];
            }

            return result;
          });

        setItems(normalizedItems);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setItems([]);
        setIsLoading(false);
        setLoadError(error instanceof Error ? error.message : "Failed to load");
      });

    return () => {
      cancelled = true;
    };
  }, [modeConfig, area, questionField, answerField]);
  const questionCount = parseCount(items, countParam || "10");
  const summaryItems = [
    {
      label: t("heading.mode"),
      value: t(modeConfig.titleKey),
    },
    {
      label: t("label.question-type"),
      value: questionType ? t(questionType.labelKey) : String(questionField),
    },
    {
      label: t("label.choice-type"),
      value: choiceType ? t(choiceType.labelKey) : String(answerField),
    },
    {
      label: t("label.number-of-questions"),
      value: `${questionCount}`,
    },
    {
      label: t("label.time-limit"),
      value:
        timeLimitSeconds === null
          ? t("game.no-time-limit")
          : `${timeLimitSeconds}`,
    },
    {
      label: t("heading.one-shot-mode"),
      value: stopOnMistake ? t("game.enabled") : t("game.disabled"),
    },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-zinc-800 px-6 py-12 text-center text-zinc-400">
        {t("loading")}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-900/60 bg-red-950/20 px-6 py-12 text-center text-red-200">
        {loadError}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Game
        key={randomSeed}
        randomSeed={randomSeed}
        onRestart={() => {
          setRandomSeed(Math.floor(Math.random() * 4096));
        }}
        items={items}
        questionField={questionField}
        answerField={answerField}
        questionCount={questionCount}
        timeLimitSeconds={timeLimitSeconds}
        stopOnMistake={stopOnMistake}
        fieldDisplayTypes={modeConfig.fieldDisplayTypes}
        summaryItems={summaryItems}
      />
    </div>
  );
}
