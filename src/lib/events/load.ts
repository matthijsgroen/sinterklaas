import { Store } from "redux";
import gameState from "src/content/gameState";
import scripts from "src/content/scripts";
import { playEvent } from "../events";
import { loadState } from "../state/loadState";
import { LoadGameItem, Queue } from "./types";

export const handleLoadGame = async (
  item: LoadGameItem,
  queue: Queue,
  store: Store
) => {
  const game = loadState(item.gameSlotId);
  if (game) {
    store.dispatch(gameState.actions.restore(game.gameState));
    queue.closeQueue();

    await playEvent(store, scripts, game.script);
  }
};

export const loadGameQ = (queue: Queue) => (gameSlotId: string): void =>
  queue.addItem({ type: "LOAD_GAME", gameSlotId } as LoadGameItem);
