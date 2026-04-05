import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { LuArrowLeft, LuGlobe } from "react-icons/lu";
import type { FieldOption, GameModeId, QuizItem } from "@/data/game-mode-types";
import { gameModeList, gameModes, isGameModeId } from "@/data/game-modes";

function getListFields(options: FieldOption[]) {
  return options.filter(
    (option, index, array) =>
      option.value !== "id" &&
      array.findIndex((candidate) => candidate.value === option.value) ===
        index,
  );
}

function StudyCell({
  value,
  displayType,
}: {
  value: string | string[] | null;
  displayType: "text" | "img" | "id";
}) {
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item) => {
          return (
            <StudyCell key={item} value={item} displayType={displayType} />
          );
        })}
      </>
    );
  }

  if (!value) {
    return <span className="text-zinc-500">-</span>;
  }

  if (displayType === "img") {
    return <img alt="" src={value} className="h-10 min-w-14 object-contain" />;
  }

  return <p className="text-nowrap">{value}</p>;
}

function StudyTable({
  items,
  fields,
  mode,
}: {
  items: QuizItem[];
  fields: FieldOption[];
  mode: GameModeId;
}) {
  const { t } = useTranslation();
  const fieldDisplayTypes = gameModes[mode].fieldDisplayTypes;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-zinc-950/30">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-200">
            <tr>
              {fields.map((field) => (
                <th key={field.value} className="px-4 py-3 font-semibold">
                  {t(field.labelKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={
                  index % 2 === 0
                    ? "bg-zinc-950 text-zinc-100"
                    : "bg-zinc-900/80 text-zinc-100"
                }
              >
                {fields.map((field) => (
                  <td
                    key={field.value}
                    className="border-zinc-800 border-t px-4 py-3 align-middle"
                  >
                    <StudyCell
                      value={item[field.value]}
                      displayType={fieldDisplayTypes[field.value]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StudyPage() {
  const { t } = useTranslation();
  const [, setPage] = useQueryState("page");
  const [modeParam] = useQueryState("mode");
  const mode = isGameModeId(modeParam) ? modeParam : "countries";
  const activeMode = gameModes[mode];
  const area = activeMode.fixedArea ?? "all";
  const items = activeMode.getItems({ area });
  const fields = getListFields([
    ...activeMode.questionOptions,
    ...activeMode.answerOptions,
  ]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4 rounded-4xl border border-zinc-800 bg-radial-[at_top] from-blue-500/20 via-zinc-950 to-zinc-950 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-[0.3em]">
              <LuGlobe />
              {t("study.title")}
            </p>
            <h1 className="font-semibold text-3xl text-zinc-50">
              {t(activeMode.titleKey)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              {t("description.study")}
            </p>
          </div>

          <a
            href="/country-quiz"
            onClick={(e) => {
              setPage("");
              e.preventDefault();
            }}
            className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-100 transition hover:border-blue-400 hover:bg-zinc-800"
          >
            <LuArrowLeft className="text-base" />
            {t("study.back-home")}
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {gameModeList.map((gameMode) => (
            <a
              key={gameMode.id}
              href={`/country-quiz?page=study&mode=${gameMode.id}`}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                mode === gameMode.id
                  ? "border-blue-400 bg-blue-500 text-white"
                  : "border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800"
              }`}
            >
              {t(gameMode.titleKey)}
            </a>
          ))}
        </div>

        <p className="text-sm text-zinc-400">
          {t("study.count", { count: items.length })}
        </p>
      </div>

      {items.length > 0 ? (
        <StudyTable items={items} fields={fields} mode={mode} />
      ) : (
        <div className="rounded-2xl border border-zinc-700 border-dashed px-6 py-12 text-center text-zinc-400">
          {t("study.empty")}
        </div>
      )}
    </div>
  );
}
