import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import hoofdPiet from "src/content/assets/hotspots/hall-piet.png";
import carpet from "src/content/assets/hotspots/hall-carpet.png";

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
  } = scriptHelpers(queue);
  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 512,
      y: 130,
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
                piet("... Prikkelbaar", { expression: "grin" });
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
        fadeOut();
        jump("pietenhuis");
      },
    },
    {
      id: "topright",
      hoverEffect: "glow",
      coordinates: [730, 0, 919, 0, 890, 95, 730, 191],
      onClick: () => {
        fadeOut();
        jump("poemroom");
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
