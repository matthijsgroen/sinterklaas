import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

const living = (queue: Queue) => {
  const {
    fadeOut,
    fadeIn,
    updateBackground,
    hold,
    jump,
    buttons,
  } = scriptHelpers(queue);

  updateBackground({ image: "living", frontLayer: undefined, blur: false });
  fadeIn();

  buttons([
    {
      id: "left",
      hoverEffect: "glow",
      color: "black",
      // prettier-ignore
      coordinates: [
        85, 195, 85, 476, 95, 477,
        100, 539, 260, 475, 262, 245,
      ],
      onClick(button) {
        fadeOut();
        jump("hall");
      },
    },
  ]);

  hold();
};

export default living;
