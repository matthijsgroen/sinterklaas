import menuState from "src/state/menu";
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
  hideAll: () => void;
  show: (id?: string) => void;
};

type ButtonActions = {
  role?: "hud";
  skip?: (state: GameState) => boolean;
  condition?: (state: GameState) => boolean;
  onClick: (buttonRef: ButtonSupport) => void;
};

export type Button = ButtonActions & ButtonProps;
export type Highlight = ButtonActions & HighlightProps;

type MenuOptionHandler = (dialogHandlers: { endDialog: () => void }) => void;

interface MenuOptions {
  [key: string]:
    | MenuOptionHandler
    | {
        skip?: (state: GameState) => boolean;
        condition?: (state: GameState) => boolean;
        onClick: MenuOptionHandler;
      };
}

export enum MenuType {
  SingleOption,
  Dialog,
}

const noop = () => {
  // Dummy
};

const flowHelpers = (queue: Queue) => {
  const callback = callbackQ(queue);
  const dispatch = dispatchQ(queue);

  const menu = (
    options: MenuOptions,
    menuType: MenuType = MenuType.SingleOption
  ) => {
    callback(async ({ subscribe, getState, dispatch: storeDispatch }) => {
      if (isPreloading(getState)) {
        Object.values(options).forEach(option =>
          "onClick" in option
            ? option.onClick({ endDialog: noop })
            : option({ endDialog: noop })
        );
        return;
      }
      const choices = Object.entries(options)
        .filter(
          ([, handler]) =>
            !("onClick" in handler
              ? (handler.skip && handler.skip(getState().gameState)) ||
                (handler.condition && !handler.condition(getState().gameState))
              : false)
        )
        .map(([option]) => option);
      storeDispatch(menuState.actions.show(choices));

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

      let dialogEnded = false;
      const dialogHandlers = {
        endDialog: () => {
          dialogEnded = true;
        },
      };

      await new Promise<number>(resolve => {
        setTimeout(() => {
          const commit = queue.collectToNewQueue();
          dispatch(menuState.actions.hide());
          const handler = options[choices[result]];
          "onClick" in handler
            ? handler.onClick(dialogHandlers)
            : handler(dialogHandlers);

          callback(() => {
            if (menuType === MenuType.Dialog && !dialogEnded) {
              const commit = queue.collectToNewQueue();
              menu(options, menuType);
              commit();
            }
          });
          commit();
          resolve();
        });
      });
    });
  };

  return {
    menu,
    buttons: (buttons: (Button | Highlight)[]) => {
      callback(async ({ dispatch: storeDispatch, subscribe, getState }) => {
        if (isPreloading(getState)) {
          // preloading data
          buttons.forEach(button => {
            button.onClick({
              remove: noop,
              hide: noop,
              hideAll: noop,
              show: noop,
            });
          });
          return;
        }
        buttons.forEach(b => {
          const visible =
            (!b.skip || !b.skip(getState().gameState)) &&
            (!b.condition || b.condition(getState().gameState));

          const buttonProps = {
            ...b,
            visible,
          } as Partial<Button> & ButtonProps;
          delete buttonProps["onClick"];
          delete buttonProps["skip"];
          delete buttonProps["condition"];

          storeDispatch(buttonsState.actions.add(buttonProps));
        });

        let prevSelected = getState().buttons.selected;

        const unsub = subscribe(() => {
          const state = getState();
          const currSelected = state.buttons.selected;

          if (currSelected !== prevSelected && currSelected !== null) {
            prevSelected = currSelected;
            const selectedButton = buttons.find(b => b.id === currSelected);
            if (selectedButton) {
              setTimeout(() => {
                const commit = queue.collectToNewQueue();
                const { remove, hide, show, hideAll } = buttonsState.actions;
                selectedButton.onClick({
                  remove: () => {
                    dispatch(remove(selectedButton.id));
                  },
                  hide: (id?: string) => {
                    dispatch(hide(id || selectedButton.id));
                  },
                  hideAll: () => {
                    dispatch(hideAll());
                  },
                  show: (id?: string) => {
                    dispatch(show(id || selectedButton.id));
                  },
                });
                dispatch(buttonsState.actions.deselect());
                callback(({ getState, dispatch: storeDispatch }) => {
                  buttons.forEach(b => {
                    const visible =
                      (!b.skip || !b.skip(getState().gameState)) &&
                      (!b.condition || b.condition(getState().gameState));

                    storeDispatch(
                      visible
                        ? buttonsState.actions.show(b.id)
                        : buttonsState.actions.hide(b.id)
                    );
                  });
                  prevSelected = null;
                });
                commit();
              });
            }
          }
        });
        queue.onQueueEnded(() => unsub());
      });
    },
  };
};

export default flowHelpers;
