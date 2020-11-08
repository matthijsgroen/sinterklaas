import { Queue } from "src/lib/types";
import { holdQ } from "src/lib/events";
import sceneHelpers from "src/lib/scripts/scene";
import gameHelpers from "src/lib/scripts/game";
import flowHelpers from "src/lib/scripts/flow";
import characterHelpers from "./helpers/characters";
import screenHelpers from "src/lib/scripts/screen";

import doorButton from "src/content/assets/hotspots/mansion-door.png";
import keyButton from "src/content/assets/hotspots/mansion-key.png";

const pietenhuis = (queue: Queue) => {
  const hold = holdQ(queue);
  const { fadeIn } = screenHelpers(queue);
  const { updateBackground, say } = sceneHelpers(queue);
  const { onState, updateState } = gameHelpers(queue);
  const { buttons } = flowHelpers(queue);
  const { hiddoP, pietP } = characterHelpers(queue);
  const hiddo = hiddoP({});
  const piet = pietP({});

  updateBackground({ image: "pietenhuis", frontLayer: undefined, blur: false });
  fadeIn();
  hiddo("We zijn er!");

  buttons([
    {
      id: "key",
      skip: state => state.mansionKey,
      hoverEffect: "glow",
      image: keyButton,
      position: [1060, 654],
      onClick(button) {
        updateState(a => a.getKey());
        hiddo("Hey, hier ligt volgens mij een sleutel!");
        say(null, "> Je raapt de sleutel op.");

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

            // Open de deur
            piet("Welkom!", {
              expression: "happy",
            });
          },
          () => {
            hiddo("*klop, klop* Hallo?");
            piet("Hallo! Wat fijn dat je ons wil helpen!", {
              expression: "happy",
            });
            hiddo("Zeker, zou je de deur open willen doen?");
            piet("Ja graag! Maar ik ben de sleutel kwijtgeraakt.", {
              expression: "sip",
            });
          }
        );
      },
    },
  ]);

  hold();
};

export default pietenhuis;
