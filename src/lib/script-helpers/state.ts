import uiState from "src/state/ui";
import { dispatchQ } from "../events";
import { Queue } from "../events/types";

const screenHelpers = (queue: Queue) => {
  const dispatch = dispatchQ(queue);

  return {
    loadGame: () => dispatch(uiState.actions.loadGame()),
  };
};

export default screenHelpers;
