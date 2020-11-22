import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import hoofdPiet from "src/content/assets/hotspots/hall-piet.png";
import carpet from "src/content/assets/hotspots/hall-carpet.png";

import backgroundTrack from "src/content/assets/sounds/background.mp3";

const pietenhuis = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    onState,
    updateState,
    updateBackground,
    manageCharacter,
    jump,
    hold,
    buttons,
    menu,
    playMusic,
    stopMusic,
  } = scriptHelpers(queue);
  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 512,
      y: 130,
      visible: false,
      dollSettings: {},
    }
  );
  const { say: piet, pos: pietPos } = manageCharacter(
    "piet",
    "piet",
    "Hoofdpiet",
    {
      x: -50,
      y: 100,
      flipped: true,
      visible: false,
      dollSettings: {},
    }
  );

  updateBackground({ image: "hall", frontLayer: undefined, blur: false });
  fadeIn();
  playMusic(backgroundTrack, { volume: 0.1 });

  buttons([
    {
      id: "hoofdPiet",
      hoverEffect: "glow",
      image: hoofdPiet,
      position: [50, 260],
      onClick({ show, hide }) {
        hide();
        piet("Welkom! Leuk dat je ons wilt komen helpen!", {
          expression: "happy",
        });
        hiddoPos({ x: 700, y: 130, visible: true });
        menu({
          "Waarmee kan ik helpen?": () => {
            piet("Goede vraag! even nadenken...", {
              expression: "sip",
              body: "think",
            });

            onState(
              state => state.poemPiet !== "helped",
              () => {
                piet("Oh ja! Rijmpiet boven heeft hulp nodig.", {
                  expression: "happy",
                  body: "pointUp",
                });
                piet("Maar pas op, hij is een beetje...", {
                  expression: "hmm",
                  body: "default",
                });
                piet("... Prikkelbaar.", { expression: "grin" });
              },
              () => {
                piet(
                  "Rijmpiet heb je al geholpen, die is weer helemaal blij...",
                  {
                    expression: "happy",
                    body: "think",
                  }
                );
              }
            );

            onState(
              state => state.sint !== "helped",
              () => {
                piet("Sinterklaas heeft wat problemen met zijn boek.", {
                  expression: "hmm",
                  body: "think",
                });
                piet("Ik denk dat je hem wel goed kan helpen!", {
                  expression: "happy",
                  body: "pointUp",
                });
              },
              () => {
                piet("Sinterklaas was erg blij met alle hulp die je gaf.", {
                  expression: "happy",
                  body: "think",
                });
              }
            );

            pietPos({ visible: false });
            hiddoPos({ visible: false });
          },
          "Waar is Sinterklaas?": () => {
            piet("Sinterklaas is boven in zijn werkkamer.", {
              expression: "sip",
            });
            piet("Hier de trap op en dan naar links.", { expression: "sip" });
            pietPos({ visible: false });
            hiddoPos({ visible: false });
          },
          "Ik kijk nog even rond": () => {
            piet("Ok.", { expression: "sip" });
            pietPos({ visible: false });
            hiddoPos({ visible: false });
          },
        });
        show();
      },
    },
    {
      id: "carpet",
      hoverEffect: "glow",
      image: carpet,
      position: [230, 640],
      onClick: () => {
        stopMusic();
        fadeOut();
        jump("pietenhuis");
      },
    },
    {
      id: "topright",
      hoverEffect: "glow",
      coordinates: [730, 0, 919, 0, 890, 95, 730, 191],
      onClick: () => {
        stopMusic();
        fadeOut();
        jump("poemroom");
      },
    },
    {
      id: "topleft",
      hoverEffect: "glow",
      coordinates: [370, 0, 550, 0, 550, 195, 400, 100],
      onClick: () => {
        stopMusic();
        fadeOut();
        jump("sintroom");
      },
    },
  ]);

  onState(
    s => !s.mansionAccess,
    () => {
      hiddo("Wow!");
      updateState(a => a.hasMansionAccess());
    }
  );
  hiddoPos({ visible: false });
  hold();
};

export default pietenhuis;
