import menu from "src/state/menu";
import { dispatchQ, callbackQ, isPreloading } from "../events";
import { Queue } from "../events/types";
import {
  Button as ButtonProps,
  Highlight as HighlightProps,
} from "src/components/generic/ScreenButtons";
import { GameState } from "src/content/gameState";
import buttonsState from "src/state/buttons";

type ButtonSupport = {
  remove: () => void;
  hide: (id?: string) => void;
  show: (id?: string) => void;
};

export type Button = {
  skip?: (state: GameState) => boolean;
  onClick: (buttonRef: ButtonSupport) => void;
} & ButtonProps;

export type Highlight = {
  skip?: (state: GameState) => boolean;
  onClick: (buttonRef: ButtonSupport) => void;
} & HighlightProps;

const flowHelpers = (queue: Queue) => {
  const callback = callbackQ(queue);
  const dispatch = dispatchQ(queue);

  return {
    menu: (options: Record<string, () => void>) => {
      const choices = Object.keys(options);
      dispatch(menu.actions.show(choices));
      callback(async ({ subscribe, getState }) => {
        if (isPreloading(getState)) {
          Object.values(options).forEach(option => option());
          return;
        }

        const result = await new Promise<number>(resolve => {
          const unsub = subscribe(() => {
            const state = getState();
            const currSelected = state.menu.selected;
            if (currSelected !== null) {
              unsub();
              resolve(currSelected);
            }
          });
        });

        await new Promise<number>(resolve => {
          setTimeout(() => {
            const commit = queue.collectToNewQueue();
            dispatch(menu.actions.hide());
            options[choices[result]](); // build up new queue items;
            commit();
            resolve();
          });
        });
      });
    },
    buttons: (buttons: (Button | Highlight)[]) => {
      callback(async ({ dispatch: storeDispatch, subscribe, getState }) => {
        if (isPreloading(getState)) {
          const noop = () => {
            // Dummy
          };
          // preloading data
          buttons.forEach(button => {
            button.onClick({
              remove: noop,
              hide: noop,
              show: noop,
            });
          });
          return;
        }
        buttons.forEach(b => {
          const visible = !b.skip || !b.skip(getState().gameState);
          const buttonProps = {
            ...b,
            visible,
          } as Partial<Button> & ButtonProps;
          delete buttonProps["onClick"];
          delete buttonProps["skip"];

          storeDispatch(buttonsState.actions.add(buttonProps));
        });

        let prevSelected = getState().buttons.selected;

        const unsub = subscribe(() => {
          const state = getState();
          const currSelected = state.buttons.selected;
          if (currSelected !== prevSelected) {
            prevSelected = currSelected;
            if (currSelected !== null) {
              const selectedButton = buttons.find(b => b.id === currSelected);
              if (selectedButton) {
                setTimeout(() => {
                  const commit = queue.collectToNewQueue();
                  const { remove, hide, show } = buttonsState.actions;
                  selectedButton.onClick({
                    remove: () => {
                      dispatch(remove(selectedButton.id));
                    },
                    hide: (id?: string) => {
                      dispatch(hide(id || selectedButton.id));
                    },
                    show: (id?: string) => {
                      dispatch(show(id || selectedButton.id));
                    },
                  });
                  dispatch(buttonsState.actions.deselect());
                  callback(({ getState, dispatch: storeDispatch }) => {
                    buttons.forEach(b => {
                      const visible = !b.skip || !b.skip(getState().gameState);
                      storeDispatch(
                        visible
                          ? buttonsState.actions.show(b.id)
                          : buttonsState.actions.hide(b.id)
                      );
                    });
                  });
                  commit();
                });
              }
            }
          }
        });
        queue.onQueueEnded(() => unsub());
      });
    },
  };
};

export default flowHelpers;
