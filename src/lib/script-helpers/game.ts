import game, { GameState } from "src/content/gameState";
import { Action } from "redux";
import { callbackQ, isPreloading } from "../events";
import { Queue } from "../events/types";

type StateTest<T> = (state: T) => boolean;

const gameHelpers = (queue: Queue) => {
  const callback = callbackQ(queue);

  return {
    updateState: (getAction: (actions: typeof game.actions) => Action) => {
      callback(store => {
        store.dispatch(getAction(game.actions));
      });
    },
    onState: (
      stateTest: StateTest<GameState>,
      onTrue: () => void,
      onFalse?: () => void
    ) => {
      callback(store => {
        if (isPreloading(store.getState)) {
          onTrue();
          onFalse && onFalse();
          return;
        }
        const gameState = store.getState().gameState;
        if (stateTest(gameState)) {
          const commit = queue.collectToNewQueue();
          onTrue();
          commit();
        } else if (onFalse) {
          const commit = queue.collectToNewQueue();
          onFalse();
          commit();
        }
      });
    },
  };
};

export default gameHelpers;
