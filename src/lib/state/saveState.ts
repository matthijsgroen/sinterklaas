import { GameState } from "src/content/gameState";
import { SAVE_KEY } from "./constants";

export const saveState = (
  slotId: string,
  script: string,
  name: string,
  gameState: GameState
) => {
  if (!window.localStorage) {
    return;
  }

  const state = JSON.parse(window.localStorage.getItem(SAVE_KEY) || "{}");
  state[slotId] = {
    script,
    gameState,
    name,
    time: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
};
