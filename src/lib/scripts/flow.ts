import menu from "src/state/menu";
import { dispatchQ, executionDelayQ } from "../events";
import { Queue } from "../types";
import { Button as ButtonProps } from "src/components/generic/ScreenButtons";
import { GameState } from "src/state/gameState";
import buttonsState from "src/state/buttons";

type ButtonSupport = {
  remove: () => void;
};

export type Button = {
  id: string;
  skip?: (state: GameState) => boolean;
  onClick: (buttonRef: ButtonSupport) => void;
} & ButtonProps;

const flowHelpers = (queue: Queue) => {
  const callback = executionDelayQ(queue);
  const dispatch = dispatchQ(queue);

  return {
    menu: (options: Record<string, () => void>) => {
      const choices = Object.keys(options);
      dispatch(menu.actions.show(choices));
      callback(async ({ subscribe, getState }) => {
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

        const commit = queue.collectToNewQueue();
        dispatch(menu.actions.hide());
        options[choices[result]](); // build up new queue items;
        commit();
      });
    },
    buttons: (buttons: Button[]) => {
      callback(async ({ dispatch: storeDispatch, subscribe, getState }) => {
        // Check which buttons to render.
        const renderButtons = buttons.filter(
          b => !b.skip || !b.skip(getState().gameState)
        );
        renderButtons.forEach(b => {
          const buttonProps = {
            ...b,
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
                const commit = queue.collectToNewQueue();
                selectedButton.onClick({
                  remove: () => {
                    dispatch(buttonsState.actions.remove(selectedButton.id));
                  },
                });
                dispatch(buttonsState.actions.deselect());
                commit();
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
