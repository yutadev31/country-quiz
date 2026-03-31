import { countriesMode } from "@/data/countries";
import { frRegionsMode } from "@/data/fr-regions";
import type { GameModeConfig, GameModeId } from "@/data/game-mode-types";
import { usStatesMode } from "@/data/us-states";

export const gameModeList = [countriesMode, usStatesMode, frRegionsMode];

export const gameModes: Record<GameModeId, GameModeConfig> = {
  countries: countriesMode,
  "us-states": usStatesMode,
  "fr-regions": frRegionsMode,
};

export function isGameModeId(value: string | null): value is GameModeId {
  return (
    value === "countries" || value === "us-states" || value === "fr-regions"
  );
}
