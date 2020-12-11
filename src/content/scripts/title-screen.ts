import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import startButton from "src/content/assets/hotspots/title-screen-start.png";
import loadButton from "src/content/assets/hotspots/title-screen-load.png";
import { getSaveSlots } from "src/lib/state/loadState";

const titleScreen = (queue: Queue) => {
  const {
    buttons,
    fadeIn,
    fadeOut,
    hold,
    jump,
    updateBackground,
    loadGame,
  } = scriptHelpers(queue);

  updateBackground({
    image: "title",
  });

  fadeIn();
  buttons([
    {
      id: "start",
      hoverEffect: "shadow",
      image: startButton,
      position: [850, 260],
      onClick: () => {
        fadeOut();
        jump("intro");
      },
    },
    {
      id: "load",
      hoverEffect: "shadow",
      image: loadButton,
      position: [850, 360],
      condition: () => getSaveSlots().length > 0,
      onClick: loadGame,
    },
    // add option to continue
  ]);
  hold();
};

export default titleScreen;
