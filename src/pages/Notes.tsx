import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { LuArrowLeft, LuFileText } from "react-icons/lu";

const excludedRuSubjects = [
  "ドネツク州",
  "ルガンスク州",
  "ザポリージャ州",
  "ヘルソン州",
  "セヴァストポリ",
  "クリミア共和国",
] as const;

export default function NotesPage() {
  const { t } = useTranslation();
  const [, setPage] = useQueryState("page");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4 rounded-4xl border border-zinc-800 bg-radial-[at_top] from-blue-500/20 via-zinc-950 to-zinc-950 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-[0.3em]">
              <LuFileText />
              {t("notes.title")}
            </p>
            <h1 className="font-semibold text-3xl text-zinc-50">{t("notes.heading")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">{t("description.notes")}</p>
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
      </div>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl shadow-zinc-950/30">
        <h2 className="font-semibold text-xl text-zinc-50">{t("notes.general.heading")}</h2>
        <div className="mt-3 grid gap-3 text-sm leading-7 text-zinc-300">
          <p>{t("notes.general.source")}</p>
          <p>{t("notes.general.naming")}</p>
          <p>{t("notes.general.definition")}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl shadow-zinc-950/30">
        <h2 className="font-semibold text-xl text-zinc-50">{t("notes.ru-subjects.heading")}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300">{t("notes.ru-subjects.body")}</p>
        <ul className="mt-4 grid gap-2 text-sm text-zinc-200 sm:grid-cols-2">
          {excludedRuSubjects.map((subject) => (
            <li key={subject} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
              {subject}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
