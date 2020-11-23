import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";
import characterHelpers from "./helpers/characters";

import keyButton from "src/content/assets/hotspots/mansion-key.png";
import doorKnock from "src/content/assets/sounds/540770__subwaysandwitch420__door-knock.mp3";
import birdsTrack from "src/content/assets/sounds/345852__hargissssound__spring-birds-loop-with-low-cut-new-jersey.mp3";

const pietenhuis = (queue: Queue) => {
  const {
    playSound,
    playMusic,
    stopMusic,
    fadeOut,
    fadeIn,
    updateBackground,
    say,
    manageCharacter,
    hold,
    jump,
    onState,
    updateState,
    buttons,
  } = scriptHelpers(queue);

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
  playMusic(birdsTrack, { fadeIn: true });
  onState(
    s => !s.mansionAccess,
    () => {
      hiddo("We zijn er!");
    }
  );
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
      coordinates: [680, 495, 735, 495, 737, 596, 680, 596],
      onClick() {
        onState(
          s => s.mansionAccess,
          () => {
            stopMusic();
            fadeOut();
            jump("hall");
          }
        );
        onState(
          state => state.mansionKey,
          () => {
            say(null, "> Probeert de sleutel in het slot.");

            piet("Welkom!", {
              expression: "happy",
            });
            stopMusic();
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
