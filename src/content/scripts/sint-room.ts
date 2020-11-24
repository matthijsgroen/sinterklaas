import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import sintHotspot from "../assets/hotspots/sint-room-sint.png";
import bookHotspot from "../assets/hotspots/sint-room-book.png";
import drawing1Hotspot from "../assets/hotspots/sint-room-drawing1.png";
import drawing2Hotspot from "../assets/hotspots/sint-room-drawing2.png";

import backgroundTrack from "src/content/assets/sounds/background-sint.mp3";

const sintroom = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
    pause,
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

  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 100,
      y: 70,
      flipped: true,
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
      id: "drawing1",
      hoverEffect: "glow",
      image: drawing1Hotspot,
      position: [300, 70],
      onClick: () => {
        fadeOut();
        updateBackground({ image: "sintroom", frontLayer: "drawing1" });
        pause(100);
        fadeIn();
        sint("Och, ik heb zulke prachtige tekeningen gehad!");
        sint("Deze zijn gemaakt door Jinte en Catootje.");
        pause();
        fadeOut();
        pause(100);
        updateBackground({ image: "sintroom", frontLayer: undefined });
        fadeIn();
      },
    },
    {
      id: "drawing2",
      hoverEffect: "glow",
      image: drawing2Hotspot,
      position: [760, 90],
      onClick: () => {
        fadeOut();
        updateBackground({ image: "sintroom", frontLayer: "drawing2" });
        pause(100);
        fadeIn();
        sint("Ik vindt deze kunstwerken echt prachtig!");
        sint("Deze zijn gemaakt door Catootje en Jinte.");
        pause();
        fadeOut();
        pause(100);
        updateBackground({ image: "sintroom", frontLayer: undefined });
        fadeIn();
      },
    },
    {
      id: "sint",
      hoverEffect: "glow",
      image: sintHotspot,
      position: [783, 149],
      onClick: ({ hide, show }) => {
        hide();
        sintPos({ visible: true });
        hiddoPos({
          visible: true,
          dollSettings: { expression: "mouth-closed" },
        });
        sint("Hiddo, zou je me willen helpen met mijn boek?");
        hiddo("Ja, natuurlijk!", { expression: "happy" });
        hiddoPos({ dollSettings: { expression: "mouth-closed" } });
        sint("Er zijn wat dingen die ik lijk te missen.");
        sint(
          "Ik zou je graag willen vertellen wat, maar ik ben mijn leesbril kwijt."
        );
        hiddo("Geen probleem, ik vind wel een goede leesbril voor je.", {
          expression: "enthusiastic",
        });
        hiddoPos({ dollSettings: { expression: "mouth-closed" } });

        sint("Oh, dat zou echt geweldig zijn. Dank je.");
        sintPos({ visible: false });
        hiddoPos({ visible: false });
        updateState(state => state.updateSint("glasses"));
        show();
      },
    },
  ]);
  hold();
};

export default sintroom;
