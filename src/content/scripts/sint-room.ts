import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import sintHotspot from "../assets/hotspots/sint-room-sint.png";
import bookHotspot from "../assets/hotspots/sint-room-book.png";

import backgroundTrack from "src/content/assets/sounds/background-sint.mp3";

const sintroom = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
    stopMusic,
    playMusic,
    onState,
    updateState,
    manageCharacter,
  } = scriptHelpers(queue);

  const { say: sint, pos: sintPos } = manageCharacter(
    "sint",
    "sint",
    "Sinterklaas",
    {
      x: 600,
      y: 30,
      visible: false,
      dollSettings: {},
    }
  );

  updateBackground({ image: "sintroom", frontLayer: undefined, blur: false });
  fadeIn();
  playMusic(backgroundTrack, { volume: 0.1 });
  onState(
    state => state.sint === "new",
    () => {
      sintPos({ visible: true });
      sint("Hey, Hiddo, wat gezellig dat je er bent!");

      sintPos({ visible: false });
      updateState(actions => actions.updateSint("visited"));
    }
  );
  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      coordinates: [78, -10, 263, 100, 260, 450, 70, 630],
      color: "black",
      onClick: ({ hide }) => {
        hide("sint");
        sintPos({ visible: true });
        sint("Dag hoor!");
        stopMusic();
        fadeOut();
        jump("hall");
      },
    },
    {
      id: "book",
      image: bookHotspot,
      position: [610, 360],
      onClick: ({ hide, show }) => {
        hide();
        show();
      },
    },
    {
      id: "sint",
      hoverEffect: "glow",
      image: sintHotspot,
      position: [783, 149],
      onClick: ({ hide, show }) => {
        hide();
        show();
      },
    },
  ]);
  hold();
};

export default sintroom;
