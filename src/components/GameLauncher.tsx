import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlay } from "react-icons/hi2";
import { LuBrain, LuFlame, LuGlobe, LuTimer } from "react-icons/lu";
import { getCountryAreaById } from "@/data/countries";
import areas from "@/data/countries/areas.json";
import type { GameModeId } from "@/data/game-mode-types";
import { gameModeList, gameModes } from "@/data/game-modes";

type AreaId = (typeof areas)[number];
type ModeCategoryId = "countries" | AreaId;

type Option = {
  label: string;
  hiragana?: string;
  value: string;
};

const modeCategories: {
  id: ModeCategoryId;
  modeIds: GameModeId[];
}[] = [
  {
    id: "countries",
    modeIds: ["countries"],
  },
  ...areas.flatMap((area) => {
    const modeIds = gameModeList
      .filter((gameMode) => {
        if (gameMode.id === "countries") return false;
        return getCountryAreaById(gameMode.id.slice(0, 2)) === area;
      })
      .map((gameMode) => gameMode.id);
    return modeIds.length > 0 ? [{ id: area, modeIds }] : [];
  }),
];

function getModeCategory(mode: GameModeId): ModeCategoryId {
  return (
    modeCategories.find((category) => category.modeIds.includes(mode))?.id ??
    "countries"
  );
}

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
    <div className={containerClassName ?? "grid grid-cols-2 gap-4"}>
      {options.map(({ label, hiragana, value }) => (
        <label
          key={value}
          className={`cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 p-4 transition has-checked:border-blue-400 has-checked:bg-blue-600 ${optionClassName ?? ""}`}
        >
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={value === defaultValue}
            className="hidden"
          />
          <div className={`font-bold ${labelClassName ?? ""}`}>
            {label}
            {hiragana && (
              <span className="ml-1 text-sm text-zinc-300">({hiragana})</span>
            )}
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
    <div className="mb-3 flex items-center gap-2">
      <Icon className="text-xl text-zinc-300" />
      <div>
        <h2 className="font-bold text-lg">{title}</h2>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
    </div>
  );
}

function ModeSection({
  mode,
  area,
  onModeChange,
  onAreaChange,
}: {
  mode: GameModeId;
  area: string;
  onModeChange: (mode: GameModeId) => void;
  onAreaChange: (area: string) => void;
}) {
  const { t } = useTranslation();
  const activeCategoryId = getModeCategory(mode);
  const activeCategory =
    modeCategories.find((category) => category.id === activeCategoryId) ??
    modeCategories[0];
  const visibleModes = gameModeList.filter((gameMode) =>
    activeCategory.modeIds.includes(gameMode.id),
  );

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <SectionTitle
        icon={LuGlobe}
        title={t("heading.mode")}
        description={t("description.mode")}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {modeCategories.map((category) => (
          <label
            key={category.id}
            className={`cursor-pointer rounded-xl border p-3 transition ${
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
              className="hidden"
            />
            <div className="font-bold">
              {category.id === "countries"
                ? t("mode-category.countries.title")
                : t(`area.${category.id}`)}
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm text-zinc-400">{t("label.mode-detail")}</p>

        <div className="grid grid-cols-1 gap-3">
          {activeCategoryId === "countries"
            ? ["all", ...areas].map((areaId) => (
                <label
                  key={areaId}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    area === areaId
                      ? "border-blue-400 bg-blue-600"
                      : "border-zinc-700 bg-zinc-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="countryArea"
                    value={areaId}
                    checked={area === areaId}
                    onChange={() => {
                      onModeChange("countries");
                      onAreaChange(areaId);
                    }}
                    className="hidden"
                  />
                  <div className="font-bold text-lg">
                    {areaId === "all"
                      ? t("mode.countries.all-title")
                      : t(`area.${areaId}`)}
                  </div>
                </label>
              ))
            : visibleModes.map((gameMode) => (
                <label
                  key={gameMode.id}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
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
                    className="hidden"
                  />
                  <div className="font-bold text-lg">{t(gameMode.titleKey)}</div>
                  <p
                    className={`mt-1 text-sm ${
                      mode === gameMode.id ? "text-blue-100" : "text-zinc-300"
                    }`}
                  >
                    {t(gameMode.descriptionKey)}
                  </p>
                </label>
              ))}
        </div>
      </div>
    </section>
  );
}

function RuleSection() {
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
    const selected = rulePresets.find((p) => p.id === id);
    if (selected?.count) {
      setCount(selected.count);
      setTimeLimit(selected.timeLimit);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <SectionTitle icon={LuTimer} title={t("heading.rule")} />

      <div className="grid grid-cols-2 gap-3">
        {rulePresets.map((p) => (
          <label
            key={p.id}
            className={`cursor-pointer rounded-xl border p-3 transition ${
              preset === p.id
                ? "border-blue-400 bg-blue-600"
                : "border-zinc-700 bg-zinc-800"
            } `}
          >
            <input
              type="radio"
              name="rulePreset"
              value={p.id}
              checked={preset === p.id}
              onChange={() => handlePresetChange(p.id)}
              className="hidden"
            />
            <div className="font-bold">{p.label}</div>
            {"count" in p && (
              <div className="mt-1 text-xs text-zinc-400">
                {p.count}問 / {p.timeLimit}秒
              </div>
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="count" className="text-sm">
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
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="timeLimit" className="text-sm">
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
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1"
          />
        </div>
      </div>
    </section>
  );
}

export default function GameLauncher() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<GameModeId>("countries");
  const [area, setArea] = useState("all");
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
    <form action="/country-quiz" className="space-y-6 py-4">
      <h2 className="text-center text-2xl">{t("title")}</h2>

      <input type="hidden" name="page" value="game" />
      <input type="hidden" name="mode" value={mode} />
      <input
        type="hidden"
        name="area"
        value={activeMode.hasAreaSelection ? area : "all"}
      />

      <ModeSection
        mode={mode}
        area={area}
        onModeChange={setMode}
        onAreaChange={setArea}
      />

      <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <SectionTitle icon={LuBrain} title={t("heading.content")} />

        <p className="mb-2 text-sm">{t("label.question-type")}</p>
        <RadioGroup
          key={`question-${mode}`}
          name="question"
          defaultValue={activeMode.defaultQuestionField}
          options={questionOptions}
        />

        <p className="mt-4 mb-2 text-sm">{t("label.choice-type")}</p>
        <RadioGroup
          key={`choice-${mode}`}
          name="choice"
          defaultValue={activeMode.defaultAnswerField}
          options={answerOptions}
        />
      </section>

      <RuleSection />

      <section className="rounded-xl border border-red-800 bg-red-950 p-4">
        <div className="flex items-center gap-2">
          <LuFlame className="text-red-400 text-xl" />
          <span className="font-bold text-red-300">
            {t("heading.one-shot-mode")}
          </span>
        </div>
        <label className="mt-3 flex items-center gap-3">
          <input type="checkbox" name="oneShotMode" className="scale-125" />
          <span className="text-red-200 text-sm">
            {t("description.one-shot-mode")}
          </span>
        </label>
      </section>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-3 font-bold text-lg transition hover:scale-[1.02] active:scale-[0.98]"
      >
        <HiPlay className="text-xl" />
        {t("button.start")}
      </button>
    </form>
  );
}
