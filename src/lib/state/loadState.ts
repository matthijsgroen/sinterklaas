import { GameState } from "src/content/gameState";

export type SaveGame = {
  script: string;
  gameState: GameState;
};

export const loadState = (slotId: string): SaveGame | null => {
  if (!window.localStorage) {
    return null;
  }
  try {
    const saveStates = JSON.parse(
      localStorage.getItem("saveGames") || "{}"
    ) as Record<string, SaveGame>;

    return saveStates[slotId] || null;
  } catch {
    return null;
  }
};

export const getSaveSlots = (): string[] => {
  if (!window.localStorage) {
    return [];
  }
  try {
    return Object.keys(JSON.parse(localStorage.getItem("saveGames") || "{}"));
  } catch {
    return [];
  }
};
