import { Queue } from "src/lib/events/types";
import { pause } from "src/lib/scene";
import scriptHelpers from "src/lib/script-helpers";

const pietenhuis = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
    hpunch,
    manageCharacter,
  } = scriptHelpers(queue);

  updateBackground({ image: "poemroom", frontLayer: undefined, blur: false });
  fadeIn();

  const { say: poem, pos: poemPos } = manageCharacter(
    "poem",
    "piet",
    "Rijmpiet",
    {
      x: 350,
      y: 100,
      dollSettings: {
        color: "red",
        body: "default",
        glasses: true,
      },
    }
  );
  pause(100);
  hpunch();
  poem("Hey! wat kom je hier doen??");
  poemPos({ visible: false });

  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      coordinates: [1190, 0, 1280, 0, 1280, 445, 1262, 550, 1120, 461],
      color: "black",
      onClick: () => {
        fadeOut();
        jump("hall");
      },
    },
  ]);
  hold();
};

export default pietenhuis;
