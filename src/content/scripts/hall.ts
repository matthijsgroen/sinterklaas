import { Queue } from "src/lib/types";
import sceneHelpers from "src/lib/scripts/scene";
import screenHelpers from "src/lib/scripts/screen";
import gameHelpers from "src/lib/scripts/game";
import flowHelpers from "src/lib/scripts/flow";

import hoofdPiet from "src/content/assets/hotspots/hall-piet.png";
import carpet from "src/content/assets/hotspots/hall-carpet.png";

const pietenhuis = (queue: Queue) => {
  const { fadeIn, fadeOut } = screenHelpers(queue);
  const { onState, updateState } = gameHelpers(queue);
  const { updateBackground, manageCharacter, jump, hold } = sceneHelpers(queue);
  const { buttons, menu } = flowHelpers(queue);
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
            piet("Goede vraag! even nadenken...", { expression: "sip" });
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
