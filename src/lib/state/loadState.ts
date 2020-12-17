import { GameState } from "src/content/gameState";
import { SAVE_KEY } from "./constants";

export type SaveGame = {
  script: string;
  gameState: GameState;
  time: number;
  name?: string;
};

export const loadState = (slotId: string): SaveGame | null => {
  if (!window.localStorage) {
    return null;
  }
  try {
    const saveStates = JSON.parse(
      localStorage.getItem(SAVE_KEY) || "{}"
    ) as Record<string, SaveGame>;

    return saveStates[slotId] || null;
  } catch {
    return null;
  }
};

export type SlotInfo = {
  time: Date;
  slotId: string;
  name: string;
};

export const getSaveSlots = (): SlotInfo[] => {
  if (!window.localStorage) {
    return [];
  }
  try {
    return Object.entries(
      JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") as Record<
        string,
        SaveGame
      >
    ).map(([key, value]) => ({
      time: new Date(value.time),
      name: value.name || value.script,
      slotId: key,
    }));
  } catch {
    return [];
  }
};
