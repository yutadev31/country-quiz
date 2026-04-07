import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { HiOutlineInformationCircle, HiOutlineTableCells } from "react-icons/hi2";
import GameLauncher from "@/components/GameLauncher";

export default function HomePage() {
  const { t } = useTranslation();
  const [, setPage] = useQueryState("page");

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2 px-4 pt-2 pb-8">
      <GameLauncher />
      <a
        href="/country-quiz?page=study"
        onClick={(e) => {
          setPage("study");
          e.preventDefault();
        }}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-sm text-zinc-100 transition hover:border-blue-400 hover:bg-zinc-800"
      >
        <HiOutlineTableCells className="text-base" />
        {t("button.open-study-list")}
      </a>
      <a
        href="/country-quiz?page=notes"
        onClick={(e) => {
          setPage("notes");
          e.preventDefault();
        }}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-sm text-zinc-100 transition hover:border-blue-400 hover:bg-zinc-800"
      >
        <HiOutlineInformationCircle className="text-base" />
        {t("button.open-notes")}
      </a>
    </div>
  );
}
