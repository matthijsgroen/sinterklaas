import uiState, { Dialogs, UIState } from "src/state/ui";
import { callbackQ, isPreloading } from "../events";
import { loadGameQ } from "../events/load";

import { Queue } from "../events/types";

const screenHelpers = (queue: Queue) => {
  const callback = callbackQ(queue);
  const loadGame = loadGameQ(queue);

  return {
    loadGame: () => {
      callback(async store => {
        if (isPreloading(store.getState)) {
          return;
        }
        store.dispatch(uiState.actions.loadGame());
        const result = await new Promise<UIState["dialogResult"]>(resolve => {
          const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.ui.dialogOpen === Dialogs.None) {
              unsubscribe();
              resolve(state.ui.dialogResult);
            }
          });
        });
        if (result !== null) {
          const commit = queue.collectToNewQueue();
          loadGame(result);
          commit();
        }
      });
    },
  };
};

export default screenHelpers;
