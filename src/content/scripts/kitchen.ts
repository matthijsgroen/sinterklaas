import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import bakpietHotspot from "../assets/hotspots/kitchen-bakpiet.png";

const keuken = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    updateBackground,
    manageCharacter,
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

  const { say: bakpiet, pos: bakpietPos } = manageCharacter(
    "bakpiet",
    "piet",
    "Bakpiet",
    {
      x: 650,
      y: 110,
      visible: false,
      dollSettings: { color: "white", body: "cooking" },
    }
  );

  updateBackground({ image: "kitchen", frontLayer: undefined, blur: false });
  fadeIn();

  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      color: "black",
      coordinates: [0, 86, 189, 80, 204, 470, 0, 531],
      onClick: () => {
        fadeOut();
        jump("hall");
      },
    },
    {
      id: "bakpiet",
      hoverEffect: "glow",
      image: bakpietHotspot,
      position: [610, 113],
      onClick: ({ hide }) => {
        hide();
        bakpietPos({ visible: true });
        bakpiet("Ah heerlijk om weer pepernoten te kunnen maken!");
        bakpietPos({ visible: false });
      },
    },
  ]);

  hold();
};

export default keuken;
