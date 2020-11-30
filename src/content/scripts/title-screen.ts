import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import startButton from "src/content/assets/hotspots/title-screen-start.png";

const titleScreen = (queue: Queue) => {
  const {
    buttons,
    fadeIn,
    fadeOut,
    hold,
    jump,
    updateBackground,
  } = scriptHelpers(queue);

  updateBackground({
    image: "title",
  });

  fadeIn();
  buttons([
    {
      id: "start",
      hoverEffect: "glow",
      image: startButton,
      position: [950, 260],
      onClick: () => {
        fadeOut();
        jump("intro");
      },
    },
  ]);
  hold();
};

export default titleScreen;
