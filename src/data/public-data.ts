import type { GameModeCategoryId, QuizItem } from "@/data/game-mode-types";

function getDataUrl(fileName: string) {
  return `${import.meta.env.BASE_URL}/data/${fileName}`;
}

async function fetchJson<T>(fileName: string): Promise<T> {
  const response = await fetch(getDataUrl(fileName));

  if (!response.ok) {
    throw new Error(`Failed to load ${fileName}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function loadQuizItems<T extends QuizItem = QuizItem>(fileName: string) {
  return fetchJson<T[]>(fileName);
}

export function loadCountryAreaIds() {
  return fetchJson<Exclude<GameModeCategoryId, "countries">[]>(
    "countries-areas.json",
  );
}
