import { Queue } from "src/lib/types";
import sceneHelpers from "src/lib/scripts/scene";
import gameHelpers from "src/lib/scripts/game";
import flowHelpers from "src/lib/scripts/flow";
import characterHelpers from "./helpers/characters";
import screenHelpers from "src/lib/scripts/screen";

import doorButton from "src/content/assets/hotspots/mansion-door.png";
import keyButton from "src/content/assets/hotspots/mansion-key.png";
import doorKnock from "src/content/assets/sounds/540770__subwaysandwitch420__door-knock.mp3";
import audioHelpers from "src/lib/scripts/audio";

const pietenhuis = (queue: Queue) => {
  const { playSound } = audioHelpers(queue);
  const { fadeIn, fadeOut } = screenHelpers(queue);
  const { updateBackground, say, manageCharacter } = sceneHelpers(queue);
  const { onState, updateState } = gameHelpers(queue);
  const { buttons, jump, hold } = flowHelpers(queue);
  const { pietP } = characterHelpers(queue);
  const piet = pietP({});
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

  updateBackground({ image: "pietenhuis", frontLayer: undefined, blur: false });
  fadeIn();
  hiddo("We zijn er!");
  hiddoPos({ visible: false });

  buttons([
    {
      id: "key",
      skip: state => state.mansionKey,
      hoverEffect: "glow",
      image: keyButton,
      position: [1060, 654],
      onClick(button) {
        updateState(a => a.getKey());
        hiddoPos({
          x: 412,
          y: 130,
          flipped: true,
          visible: true,
        });
        hiddo("Hey, hier ligt volgens mij een sleutel!");
        hiddoPos({
          x: 412,
          y: 330,
          flipped: true,
          visible: true,
        });
        say(null, "> Je raapt de sleutel op.");
        hiddoPos({
          visible: false,
        });

        button.remove();
      },
    },
    {
      id: "door",
      hoverEffect: "glow",
      image: doorButton,
      position: [679, 493],
      onClick() {
        onState(
          state => state.mansionKey,
          () => {
            say(null, "> Probeert de sleutel in het slot.");

            piet("Welkom!", {
              expression: "happy",
            });
            updateState(a => a.hasMansionAccess());
            fadeOut();
            jump("hall");
          },
          () => {
            hiddoPos({
              x: 212,
              y: 130,
              flipped: true,
              visible: true,
            });
            playSound(doorKnock, { wait: true });
            hiddo("Hallo?");
            piet("Hallo! Wat fijn dat je ons wil helpen!", {
              expression: "happy",
            });
            hiddo("Zeker, zou je de deur open willen doen?");
            piet("Ja graag! Maar ik ben de sleutel kwijtgeraakt.", {
              expression: "sip",
            });
            hiddoPos({ visible: false });
          }
        );
      },
    },
  ]);

  hold();
};

export default pietenhuis;
