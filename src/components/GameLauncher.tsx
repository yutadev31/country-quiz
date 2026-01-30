import areas from "@/data/areas.json";

import { LuBrain, LuGlobe, LuTimer, LuFlame } from "react-icons/lu";
import { HiPlay } from "react-icons/hi2";
import { useState } from "react";

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

const rulePresets = [
  {
    id: "casual",
    label: "カジュアル",
    count: 5,
    timeLimit: 15,
  },
  {
    id: "standard",
    label: "スタンダード",
    count: 10,
    timeLimit: 10,
  },
  {
    id: "hardcore",
    label: "ハード",
    count: 20,
    timeLimit: 5,
  },
  {
    id: "custom",
    label: "カスタム",
  },
];

function RuleSection() {
  const [preset, setPreset] = useState("standard");
  const [count, setCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);

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
      <SectionTitle icon={LuTimer} title="ルール設定" />

      {/* プリセット */}
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

      {/* カスタム入力 */}
      <div
        className={`mt-4 grid grid-cols-2 gap-4 ${
          isCustom ? "opacity-100" : "opacity-40"
        }`}
      >
        <div>
          <label className="text-sm">問題数</label>
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
          <label className="text-sm">制限時間（秒）</label>
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

      {/* hidden values for non-custom */}
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
  return (
    <form action="/country-quiz" className="space-y-6 py-4">
      <h2 className="text-center text-2xl">国クイズ</h2>

      <input type="hidden" name="page" value="game" />

      {/* クイズ内容 */}
      <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <SectionTitle icon={LuBrain} title="クイズ内容" />

        <p className="mb-2 text-sm">問題の種類</p>
        <RadioGroup
          name="question"
          defaultValue="name"
          options={[
            { label: "国名", value: "name" },
            { label: "首都", value: "capital" },
            { label: "国旗", value: "flag" },
            { label: "ドメイン", value: "domain" },
          ]}
        />

        <p className="mt-4 mb-2 text-sm">選択肢の種類</p>
        <RadioGroup
          name="choice"
          defaultValue="flag"
          options={[
            { label: "国名", value: "name" },
            { label: "首都", value: "capital" },
            { label: "国旗", value: "flag" },
            { label: "ドメイン", value: "domain" },
          ]}
        />
      </section>

      {/* 出題地域 */}
      <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
        <SectionTitle icon={LuGlobe} title="出題地域" />
        <RadioGroup
          name="area"
          defaultValue=""
          options={Object.keys(areas).map((key) => ({
            label: areas[key as keyof typeof areas],
            value: key,
          }))}
        />
      </section>

      {/* ルール */}
      <RuleSection />

      {/* 一発勝負 */}
      <section className="rounded-xl border border-red-800 bg-red-950 p-4">
        <div className="flex items-center gap-2">
          <LuFlame className="text-xl text-red-400" />
          <span className="font-bold text-red-300">一発勝負モード</span>
        </div>
        <label className="mt-3 flex items-center gap-3">
          <input type="checkbox" name="oneShotMode" className="scale-125" />
          <span className="text-sm text-red-200">1問でも間違えたら即終了</span>
        </label>
      </section>

      {/* 開始 */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-3 text-lg font-bold transition hover:scale-[1.02] active:scale-[0.98]"
      >
        <HiPlay className="text-xl" />
        ゲーム開始
      </button>
    </form>
  );
}
