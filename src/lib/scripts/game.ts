import game, { GameState } from "src/state/gameState";
import { Action } from "redux";
import { executionDelayQ } from "../events";
import { Queue } from "../types";

type StateTest<T> = (state: T) => boolean;

const gameHelpers = (queue: Queue) => {
  const callback = executionDelayQ(queue);

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
