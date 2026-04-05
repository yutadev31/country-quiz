import { caStateMode } from "@/data/ca-provinces";
import { countriesMode, getCountryAreaById } from "@/data/countries";
import areas from "@/data/countries/areas.json";
import { deStatesMode } from "@/data/de-states";
import { frRegionsMode } from "@/data/fr-regions";
import type {
  GameModeCategory,
  GameModeCategoryId,
  GameModeConfig,
  GameModeId,
} from "@/data/game-mode-types";
import { usStatesMode } from "@/data/us-states";
import { mxStatesMode } from "./mx-states";

const gameModeAreaIds = areas as Exclude<GameModeCategoryId, "countries">[];

function createCountryAreaMode(
  area: Exclude<GameModeCategoryId, "countries">,
): GameModeConfig {
  return {
    ...countriesMode,
    id: `countries-${area}` as GameModeId,
    titleKey: `mode.countries-${area}.title`,
    hasAreaSelection: false,
    fixedArea: area,
  };
}

export const gameModes: Record<GameModeId, GameModeConfig> = {
  countries: countriesMode,
  "countries-asia": createCountryAreaMode("asia"),
  "countries-europe": createCountryAreaMode("europe"),
  "countries-africa": createCountryAreaMode("africa"),
  "countries-north-america": createCountryAreaMode("north-america"),
  "countries-south-america": createCountryAreaMode("south-america"),
  "countries-oceania": createCountryAreaMode("oceania"),
  "us-states": usStatesMode,
  "ca-provinces": caStateMode,
  "mx-states": mxStatesMode,
  "fr-regions": frRegionsMode,
  "de-states": deStatesMode,
};

export const gameModeList = Object.values(gameModes);

export const gameModeCategories: GameModeCategory[] = [
  {
    id: "countries",
    modeIds: [
      "countries",
      ...gameModeAreaIds.map((area) => `countries-${area}` as GameModeId),
    ],
  },
  ...gameModeAreaIds.flatMap((area) => {
    const modeIds = gameModeList
      .filter((gameMode) => {
        if (
          gameMode.id === "countries" ||
          gameMode.id.startsWith("countries-")
        ) {
          return false;
        }
        return getCountryAreaById(gameMode.id.slice(0, 2)) === area;
      })
      .map((gameMode) => gameMode.id);
    return modeIds.length > 0 ? [{ id: area, modeIds }] : [];
  }),
];

export function getGameModeCategoryId(mode: GameModeId) {
  return (
    gameModeCategories.find((category) => category.modeIds.includes(mode))
      ?.id ?? "countries"
  );
}

export function isGameModeId(value: string | null): value is GameModeId {
  return value ? Object.keys(gameModes).includes(value) : false;
}
