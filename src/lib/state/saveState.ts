import { GameState } from "src/content/gameState";

export const saveState = (
  slotId: string,
  script: string,
  gameState: GameState
) => {
  if (!window.localStorage) {
    return;
  }

  const state = JSON.parse(window.localStorage.getItem("saveGames") || "{}");
  state[slotId] = {
    script,
    gameState,
  };
  localStorage.setItem("saveGames", JSON.stringify(state));
};
