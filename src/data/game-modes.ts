import { caStateMode } from "@/data/ca-provinces";
import { countriesMode } from "@/data/countries";
import { deStatesMode } from "@/data/de-states";
import { frRegionsMode } from "@/data/fr-regions";
import type { GameModeConfig, GameModeId } from "@/data/game-mode-types";
import { usStatesMode } from "@/data/us-states";
import { mxStatesMode } from "./mx-states";

export const gameModes: Record<GameModeId, GameModeConfig> = {
  countries: countriesMode,
  "us-states": usStatesMode,
  "ca-provinces": caStateMode,
  "mx-states": mxStatesMode,
  "fr-regions": frRegionsMode,
  "de-states": deStatesMode,
};

export const gameModeList = Object.values(gameModes);

export function isGameModeId(value: string | null): value is GameModeId {
  return value ? Object.keys(gameModes).includes(value) : false;
}
