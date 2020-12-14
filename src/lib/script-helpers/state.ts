import uiState, { Dialogs, UIState } from "src/state/ui";
import { Queue } from "../events/types";
import { callbackQ, isPreloading } from "../events";
import { loadGameQ } from "../events/load";

const screenHelpers = (queue: Queue) => {
  const callback = callbackQ(queue);
  const loadGame = loadGameQ(queue);

  return {
    debug: (message: string) => {
      callback(store => {
        if (isPreloading(store.getState)) {
          return;
        }
        console.log(message);
      });
    },
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
    settings: () => {
      callback(async store => {
        if (isPreloading(store.getState)) {
          return;
        }
        store.dispatch(uiState.actions.settings());
        const result = await new Promise<UIState["dialogResult"]>(resolve => {
          const unsubscribe = store.subscribe(() => {
            const state = store.getState();
            if (state.ui.dialogOpen === Dialogs.None) {
              unsubscribe();
              resolve(state.ui.dialogResult);
            }
          });
        });

        if (result === "save") {
          store.dispatch(uiState.actions.saveGame());
          await new Promise<UIState["dialogResult"]>(resolve => {
            const unsubscribe = store.subscribe(() => {
              const state = store.getState();
              if (state.ui.dialogOpen === Dialogs.None) {
                unsubscribe();
                resolve(state.ui.dialogResult);
              }
            });
          });
        }
      });
    },
  };
};

export default screenHelpers;
