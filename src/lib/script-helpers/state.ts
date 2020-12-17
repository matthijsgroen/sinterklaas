import uiState, { Dialogs, UIState } from "src/state/ui";
import { Queue } from "../events/types";
import { callbackQ, getActiveScript, isPreloading } from "../events";
import { loadGameQ } from "../events/load";
import { saveState } from "../state/saveState";

const screenHelpers = (queue: Queue) => {
  const callback = callbackQ(queue);
  const loadGame = loadGameQ(queue);

  const load = () => {
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
  };

  const save = () => {
    callback(async store => {
      if (isPreloading(store.getState)) {
        return;
      }
      store.dispatch(uiState.actions.saveGame());
      const saveSlot = await new Promise<UIState["dialogResult"]>(resolve => {
        const unsubscribe = store.subscribe(() => {
          const state = store.getState();
          if (state.ui.dialogOpen === Dialogs.None) {
            unsubscribe();
            resolve(state.ui.dialogResult);
          }
        });
      });
      if (saveSlot !== null) {
        const activeScript = getActiveScript();
        saveState(
          saveSlot,
          activeScript,
          activeScript,
          store.getState().gameState
        );
      }
    });
  };

  return {
    debug: (message: string) => {
      callback(store => {
        if (isPreloading(store.getState)) {
          return;
        }
        console.log(message);
      });
    },
    loadGame: load,
    saveGame: save,
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
          const commit = queue.collectToNewQueue();
          save();
          commit();
        }
        if (result === "load") {
          const commit = queue.collectToNewQueue();
          load();
          commit();
        }
      });
    },
  };
};

export default screenHelpers;
