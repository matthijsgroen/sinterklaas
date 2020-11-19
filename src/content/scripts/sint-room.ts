import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

const sintroom = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
  } = scriptHelpers(queue);

  updateBackground({ image: "sintroom", frontLayer: undefined, blur: false });
  fadeIn();
  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      coordinates: [78, -10, 263, 100, 260, 450, 70, 630],
      color: "black",
      onClick: () => {
        fadeOut();
        jump("hall");
      },
    },
  ]);
  hold();
};

export default sintroom;
