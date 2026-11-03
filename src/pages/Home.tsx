import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { HiOutlineInformationCircle, HiOutlineTableCells } from "react-icons/hi2";

import GameLauncher from "@/components/GameLauncher";

export default function HomePage() {
  const { t } = useTranslation();
  const [, setPage] = useQueryState("page");

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 pt-4 pb-[calc(8rem+env(safe-area-inset-bottom))] md:max-w-2xl md:gap-6 md:pt-8">
      <GameLauncher />
      <nav aria-label={t("label.resources")} className="grid grid-cols-2 gap-5 md:gap-6">
        <a
          href="/country-quiz?page=study"
          onClick={(e) => {
            setPage("study");
            e.preventDefault();
          }}
          className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-4 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-blue-300 md:text-base"
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
          className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-4 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-blue-300 md:text-base"
        >
          <HiOutlineInformationCircle className="text-base" />
          {t("button.open-notes")}
        </a>
      </nav>
    </div>
  );
}
