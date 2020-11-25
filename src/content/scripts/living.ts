import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import bakpietHotspot from "../assets/hotspots/living-bakpiet.png";
import bagHotspot from "../assets/hotspots/living-bag.png";

const living = (queue: Queue) => {
  const {
    fadeOut,
    fadeIn,
    updateBackground,
    hold,
    jump,
    buttons,
    manageCharacter,
  } = scriptHelpers(queue);

  const { say: bakpiet, pos: bakpietPos } = manageCharacter(
    "bakpiet",
    "piet",
    "Bakpiet",
    {
      x: 650,
      y: 110,
      visible: false,
      dollSettings: { color: "white" },
    }
  );

  updateBackground({ image: "living", frontLayer: undefined, blur: false });
  fadeIn();

  buttons([
    {
      id: "bag1",
      hoverEffect: "glow",
      image: bagHotspot,
      position: [570, 430],
      onClick: () => {
        bakpietPos({ visible: true });
        bakpiet("Hallo daar!");
        bakpietPos({ visible: false });
      },
    },
    {
      id: "bag2",
      hoverEffect: "glow",
      image: bagHotspot,
      position: [410, 430],
      onClick: () => {
        bakpietPos({ visible: true });
        bakpiet("Hallo daar!");
        bakpietPos({ visible: false });
      },
    },
    {
      id: "bag3",
      hoverEffect: "glow",
      image: bagHotspot,
      position: [680, 430],
      onClick: () => {
        bakpietPos({ visible: true });
        bakpiet("Hallo daar!");
        bakpietPos({ visible: false });
      },
    },
    {
      id: "bakpiet",
      hoverEffect: "glow",
      image: bakpietHotspot,
      position: [970, 293],
      onClick: ({ hide }) => {
        hide();
        bakpietPos({ visible: true });
        bakpiet("Hallo daar!");
        bakpietPos({ visible: false });
      },
    },
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
