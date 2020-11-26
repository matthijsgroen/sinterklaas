import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import packageHotspot from "src/content/assets/hotspots/bag-gina.png";
import paperRipping from "src/content/assets/sounds/535361__eminyildirim__paper-ripping.mp3";

const bag = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    updateState,
    updateBackground,
    manageCharacter,
    jump,
    hold,
    buttons,
    playSound,
  } = scriptHelpers(queue);

  const { say: hiddo } = manageCharacter("hiddo", "hiddo", "Hiddo", {
    x: 512,
    y: 130,
    visible: false,
    dollSettings: {},
  });

  updateBackground({ image: "bag", frontLayer: undefined, blur: false });
  fadeIn();
  buttons([
    {
      id: "package",
      hoverEffect: "glow",
      image: packageHotspot,
      position: [460, 290],
      skip: s => s.glasses !== "location",
      onClick({ hide }) {
        hiddo("Hmm een pakje voor Oma, daar zit vast een leesbril in.");
        hiddo("Die vraagt ze immers zo vaak omdat ze die altijd kwijt raakt.");
        hide();
        hiddo("Ik ben benieuwd...");
        playSound(paperRipping, { wait: true });
        hiddo("Ik wist het!");
        hiddo("Nu maar hopen dat het de goede sterkte is...");
        updateState(a => a.updateGlasses("inventory"));
      },
    },
    {
      id: "exit",
      coordinates: [0, 0, 1280, 0, 1280, 720, 0, 720],
      skip: s => s.glasses === "location",
      onClick() {
        fadeOut();
        jump("living");
      },
    },
  ]);

  hold();
};

export default bag;
