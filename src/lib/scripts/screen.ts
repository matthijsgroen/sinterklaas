import screenState from "src/state/screen";
import { dispatchQ, pauseQ } from "../events";
import { Queue } from "../types";

const screenHelpers = (queue: Queue) => {
  const dispatch = dispatchQ(queue);
  const pause = pauseQ(queue);

  return {
    hpunch: () => dispatch(screenState.actions.punch(true)),
    vpunch: () => dispatch(screenState.actions.punch(false)),
    fadeOut: (amount: boolean | number = true) => {
      dispatch(screenState.actions.fade(amount));
      pause(500);
    },
    fadeWhite: () => {
      dispatch(screenState.actions.fade(true, "white"));
      pause(500);
    },
    fadeIn: () => dispatch(screenState.actions.fade(false)),
  };
};

export default screenHelpers;
