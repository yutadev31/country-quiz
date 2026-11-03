import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlay } from "react-icons/hi2";
import { LuBrain, LuGlobe, LuTimer } from "react-icons/lu";

import type { GameModeId } from "@/data/game-mode-types";
import {
  gameModeCategories,
  gameModeList,
  gameModes,
  getGameModeCategoryId,
} from "@/data/game-modes";

type Option = {
  label: string;
  hiragana?: string;
  value: string;
};

function RadioGroup({
  name,
  defaultValue,
  options,
  containerClassName,
  optionClassName,
  labelClassName,
}: {
  name: string;
  defaultValue?: string;
  options: Option[];
  containerClassName?: string;
  optionClassName?: string;
  labelClassName?: string;
}) {
  return (
    <div className={containerClassName ?? "grid grid-cols-2 gap-4 md:gap-5"}>
      {options.map(({ label, hiragana, value }) => (
        <label
          key={value}
          className={`flex min-h-11 min-w-0 cursor-pointer items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-sm wrap-anywhere transition has-checked:border-blue-400 has-checked:bg-blue-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-300 md:px-4 md:py-4 md:text-lg ${optionClassName ?? ""}`}
        >
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={value === defaultValue}
            className="sr-only"
          />
          <div className={`font-bold ${labelClassName ?? ""}`}>
            {label}
            {hiragana && <span className="ml-1 text-sm text-zinc-300">({hiragana})</span>}
          </div>
        </label>
      ))}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Icon className="text-xl text-zinc-300" />
      <div>
        <h2 className="text-base font-bold md:text-xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-400 md:text-base">{description}</p>}
      </div>
    </div>
  );
}

function ModeSection({
  mode,
  onModeChange,
}: {
  mode: GameModeId;
  onModeChange: (mode: GameModeId) => void;
}) {
  const { t } = useTranslation();
  const activeCategoryId = getGameModeCategoryId(mode);
  const activeCategory =
    gameModeCategories.find((category) => category.id === activeCategoryId) ??
    gameModeCategories[0];
  const visibleModes = gameModeList.filter((gameMode) =>
    activeCategory.modeIds.includes(gameMode.id),
  );

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 md:p-6">
      <SectionTitle icon={LuGlobe} title={t("heading.mode")} description={t("description.mode")} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
        {gameModeCategories.map((category) => (
          <label
            key={category.id}
            className={`min-h-11 min-w-0 cursor-pointer rounded-lg border px-3 py-3 text-sm wrap-anywhere transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-300 md:px-4 md:py-4 md:text-lg ${
              activeCategoryId === category.id
                ? "border-blue-400 bg-blue-600"
                : "border-zinc-700 bg-zinc-800"
            }`}
          >
            <input
              type="radio"
              name="modeCategory"
              value={category.id}
              checked={activeCategoryId === category.id}
              onChange={() => onModeChange(category.modeIds[0])}
              className="sr-only"
            />
            <div className="font-bold">{t(`mode-category.${category.id}`)}</div>
          </label>
        ))}
      </div>

      {activeCategoryId === "countries" ? (
        <input type="hidden" name="modeDetail" value={mode} />
      ) : (
        <div className="mt-6">
          <p className="mb-3 text-sm text-zinc-400 md:text-base">{t("label.mode-detail")}</p>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {visibleModes.map((gameMode) => (
              <label
                key={gameMode.id}
                className={`flex min-h-11 min-w-0 cursor-pointer items-center rounded-lg border px-3 py-3 text-sm wrap-anywhere transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-300 md:px-4 md:py-4 md:text-lg ${
                  mode === gameMode.id
                    ? "border-blue-400 bg-blue-600"
                    : "border-zinc-700 bg-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="modeDetail"
                  value={gameMode.id}
                  checked={mode === gameMode.id}
                  onChange={() => onModeChange(gameMode.id)}
                  className="sr-only"
                />
                <div className="font-bold">{t(gameMode.titleKey)}</div>
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function RuleSection() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [preset, setPreset] = useState("standard");
  const [count, setCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);
  const { t } = useTranslation();

  const rulePresets = [
    {
      id: "casual",
      label: t("rule-preset.casual"),
      count: 5,
      timeLimit: 15,
    },
    {
      id: "standard",
      label: t("rule-preset.standard"),
      count: 10,
      timeLimit: 10,
    },
    {
      id: "hard",
      label: t("rule-preset.hard"),
      count: 20,
      timeLimit: 5,
    },
    {
      id: "custom",
      label: t("rule-preset.custom"),
    },
  ];

  const handlePresetChange = (id: string) => {
    setPreset(id);
    if (id === "custom") setDetailsOpen(true);
    const selected = rulePresets.find((p) => p.id === id);
    if (selected?.count) {
      setCount(selected.count);
      setTimeLimit(selected.timeLimit);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 md:p-6">
      <SectionTitle icon={LuTimer} title={t("heading.rule")} />

      <div className="grid grid-cols-2 gap-4 md:gap-5">
        {rulePresets.map((p) => (
          <label
            key={p.id}
            className={`min-h-11 min-w-0 cursor-pointer rounded-lg border px-3 py-3 text-sm wrap-anywhere transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-300 md:px-4 md:py-4 md:text-lg ${
              preset === p.id ? "border-blue-400 bg-blue-600" : "border-zinc-700 bg-zinc-800"
            } `}
          >
            <input
              type="radio"
              name="rulePreset"
              value={p.id}
              checked={preset === p.id}
              onChange={() => handlePresetChange(p.id)}
              className="sr-only"
            />
            <div className="font-bold">{p.label}</div>
            <div className="mt-1 text-xs text-zinc-200 md:text-sm">
              {t("rule-preset.summary", {
                count: p.count ?? count,
                seconds: p.timeLimit ?? timeLimit,
              })}
            </div>
          </label>
        ))}
      </div>

      <details
        className="mt-6 border-t border-zinc-700 pt-5"
        open={detailsOpen}
        onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
      >
        <summary className="min-h-11 cursor-pointer rounded text-sm font-bold focus-visible:outline-2 focus-visible:outline-blue-300 md:text-base">
          {t("label.advanced-settings")}
        </summary>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          <div>
            <label htmlFor="count" className="text-sm md:text-base">
              {t("label.number-of-questions")}
            </label>
            <input
              type="number"
              name="count"
              id="count"
              value={count}
              onChange={(e) => {
                setPreset("custom");
                setCount(Number(e.target.value));
              }}
              className="mt-1 min-h-11 w-full min-w-0 rounded border border-zinc-700 bg-zinc-800 px-3 py-3 focus-visible:outline-2 focus-visible:outline-blue-300 md:px-4 md:py-4"
            />
          </div>

          <div>
            <label htmlFor="timeLimit" className="text-sm md:text-base">
              {t("label.time-limit")}
            </label>
            <input
              type="number"
              name="timeLimit"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => {
                setPreset("custom");
                setTimeLimit(Number(e.target.value));
              }}
              className="mt-1 min-h-11 w-full min-w-0 rounded border border-zinc-700 bg-zinc-800 px-3 py-3 focus-visible:outline-2 focus-visible:outline-blue-300 md:px-4 md:py-4"
            />
          </div>
        </div>
      </details>
      <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 border-t border-zinc-700 pt-5 text-sm md:text-base">
        <input type="checkbox" name="oneShotMode" className="size-5 shrink-0 accent-blue-500" />
        <span>
          <span className="block font-bold">{t("heading.one-shot-mode")}</span>
          <span className="text-zinc-400">{t("description.one-shot-mode")}</span>
        </span>
      </label>
    </section>
  );
}

export default function GameLauncher() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<GameModeId>("countries");
  const activeMode = gameModes[mode];
  const questionOptions = activeMode.questionOptions.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }));
  const answerOptions = activeMode.answerOptions.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }));

  return (
    <form action="/country-quiz" className="space-y-6 py-4 md:space-y-8 md:py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("title")}</h1>
      </header>

      <input type="hidden" name="page" value="game" />
      <input type="hidden" name="mode" value={mode} />

      <ModeSection mode={mode} onModeChange={setMode} />

      <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 md:p-6">
        <SectionTitle icon={LuBrain} title={t("heading.content")} />

        <p className="mb-3 text-sm md:text-base">{t("label.question-type")}</p>
        <RadioGroup
          key={`question-${mode}`}
          name="question"
          defaultValue={activeMode.defaultQuestionField}
          options={questionOptions}
        />

        <p className="mt-6 mb-3 text-sm md:text-base">{t("label.choice-type")}</p>
        <RadioGroup
          key={`choice-${mode}`}
          name="choice"
          defaultValue={activeMode.defaultAnswerField}
          options={answerOptions}
        />
      </section>

      <RuleSection />

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-700 bg-zinc-950 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="submit"
          className="mx-auto flex min-h-12 w-full max-w-lg items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 md:max-w-2xl md:text-xl"
        >
          <HiPlay className="text-xl" />
          {t("button.start")}
        </button>
      </div>
    </form>
  );
}
