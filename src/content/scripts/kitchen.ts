import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

const keuken = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    updateBackground,
    // manageCharacter,
    jump,
    hold,
    buttons,
  } = scriptHelpers(queue);

  //   const { say: hiddo, pos: hiddoPos } = manageCharacter(
  //     "hiddo",
  //     "hiddo",
  //     "Hiddo",
  //     {
  //       x: 512,
  //       y: 130,
  //       visible: false,
  //       dollSettings: {},
  //     }
  //   );

  //   const { say: bakpiet, pos: bakpietPos } = manageCharacter(
  //     "bakpiet",
  //     "piet",
  //     "Bakpiet",
  //     {
  //       x: 650,
  //       y: 110,
  //       visible: false,
  //       dollSettings: { color: "white" },
  //     }
  //   );

  updateBackground({ image: "kitchen", frontLayer: undefined, blur: false });
  fadeIn();

  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      color: "black",
      coordinates: [0, 100, 189, 80, 200, 475, 0, 531],
      onClick: () => {
        fadeOut();
        jump("hall");
      },
    },
  ]);

  hold();
};

export default keuken;
