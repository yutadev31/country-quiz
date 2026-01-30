import areas from "@/data/areas.json";

import { LuBrain, LuGlobe, LuTimer, LuFlame } from "react-icons/lu";
import { HiPlay } from "react-icons/hi2";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Option = {
  label: string;
  hiragana?: string;
  value: string;
};

function RadioGroup({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue?: string;
  options: Option[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map(({ label, hiragana, value }) => (
        <label
          key={value}
          className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 p-4 transition has-checked:border-blue-400 has-checked:bg-blue-600"
        >
          <input
            type="radio"
            name={name}
            value={value}
            defaultChecked={value === defaultValue}
            className="hidden"
          />
          <div className="font-bold">
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
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>
    </div>
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
      setTimeLimit(selected.timeLimit!);
    }
  };

  const isCustom = preset === "custom";

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

      <div
        className={`mt-4 grid grid-cols-2 gap-4 ${
          isCustom ? "opacity-100" : "opacity-40"
        }`}
      >
        <div>
          <label className="text-sm">{t("label.number-of-questions")}</label>
          <input
            type="number"
            name="count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={!isCustom}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1"
          />
        </div>

        <div>
          <label className="text-sm">{t("label.time-limit")}</label>
          <input
            type="number"
            name="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            disabled={!isCustom}
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1"
          />
        </div>
      </div>

      {!isCustom && (
        <>
          <input type="hidden" name="count" value={count} />
          <input type="hidden" name="timeLimit" value={timeLimit} />
        </>
      )}
    </section>
  );
}

export default function GameLauncher() {
  const { t } = useTranslation();

  return (
    <form action="/country-quiz" className="space-y-6 py-4">
      <h2 className="text-center text-2xl">{t("title")}</h2>

      <input type="hidden" name="page" value="game" />

      <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <SectionTitle icon={LuBrain} title={t("heading.content")} />

        <p className="mb-2 text-sm">{t("label.question-type")}</p>
        <RadioGroup
          name="question"
          defaultValue="name"
          options={[
            { label: t("content-type.name"), value: "name" },
            { label: t("content-type.capital"), value: "capital" },
            { label: t("content-type.flag"), value: "flag" },
            { label: t("content-type.domain"), value: "domain" },
          ]}
        />

        <p className="mt-4 mb-2 text-sm">{t("label.choice-type")}</p>
        <RadioGroup
          name="choice"
          defaultValue="flag"
          options={[
            { label: t("content-type.name"), value: "name" },
            { label: t("content-type.capital"), value: "capital" },
            { label: t("content-type.flag"), value: "flag" },
            { label: t("content-type.domain"), value: "domain" },
          ]}
        />
      </section>

      <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <SectionTitle icon={LuGlobe} title={t("heading.area")} />
        <RadioGroup
          name="area"
          defaultValue=""
          options={areas.map((key) => ({
            label: t(`area.${key}`),
            value: key,
          }))}
        />
      </section>

      <RuleSection />

      <section className="rounded-xl border border-red-800 bg-red-950 p-4">
        <div className="flex items-center gap-2">
          <LuFlame className="text-xl text-red-400" />
          <span className="font-bold text-red-300">
            {t("heading.one-shot-mode")}
          </span>
        </div>
        <label className="mt-3 flex items-center gap-3">
          <input type="checkbox" name="oneShotMode" className="scale-125" />
          <span className="text-sm text-red-200">
            {t("description.one-shot-mode")}
          </span>
        </label>
      </section>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-3 text-lg font-bold transition hover:scale-[1.02] active:scale-[0.98]"
      >
        <HiPlay className="text-xl" />
        {t("button.start")}
      </button>
    </form>
  );
}
