import menu from "../../state/menu";
import { dispatchQ, executionDelayQ } from "../events";
import { Queue } from "../types";
import { RootState } from "../../state/store";

const flowHelpers = (queue: Queue) => {
  const callback = executionDelayQ(queue);
  const dispatch = dispatchQ(queue);

  return {
    menu: (options: Record<string, () => void>) => {
      const choices = Object.keys(options);
      dispatch(menu.actions.show(choices));
      callback(async ({ subscribe, getState }) => {
        const result = await new Promise<number>((resolve) => {
          subscribe(() => {
            const state: RootState = getState();
            const currSelected = state.menu.selected;
            if (currSelected !== null) {
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
  };
};

export default flowHelpers;
