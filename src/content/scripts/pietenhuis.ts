import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";
import characterHelpers from "./helpers/characters";

import keyButton from "src/content/assets/hotspots/mansion-key.png";
import chickenButton from "src/content/assets/hotspots/mansion-chickens.png";
import doorKnock from "src/content/assets/sounds/540770__subwaysandwitch420__door-knock.mp3";
import birdsTrack from "src/content/assets/sounds/345852__hargissssound__spring-birds-loop-with-low-cut-new-jersey.mp3";
import chickenAlarm from "src/content/assets/sounds/316920__rudmer-rotteveel__chicken-single-alarm-call.mp3";
import { hud } from "./hud";

const pietenhuis = (queue: Queue) => {
  const {
    playSound,
    playMusic,
    pause,
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
  hud(queue);

  const { pietP } = characterHelpers(queue);
  const piet = pietP({});
  const { say: hiddo, pos: hiddoPos, doll: hiddoDoll } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 512,
      y: 130,
      dollSettings: {},
    }
  );

  updateBackground({ image: "pietenhuis", frontLayer: undefined, blur: true });
  fadeIn();
  playMusic(birdsTrack, { fadeIn: true });
  onState(
    s => !s.mansionAccess,
    () => {
      hiddo("We zijn er!");
    }
  );
  hiddoPos({ visible: false });
  updateBackground({ blur: false });

  buttons([
    {
      id: "key",
      skip: state => state.mansionKey,
      hoverEffect: "glow",
      image: keyButton,
      position: [1060, 654],
      onClick: () => {
        updateState(a => a.getKey());
        updateBackground({ blur: true });
        hiddoPos({
          x: 412,
          y: 130,
          flipped: true,
          visible: true,
          dollSettings: { expression: "happy" },
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
        updateBackground({ blur: false });
      },
    },
    {
      id: "chickensInactive",
      image: chickenButton,
      position: [110, 632],
      skip: s => s.gingerbreadButtonPie === "ingredients",
      onClick: () => {
        // No action yet
      },
    },
    {
      id: "chickens",
      image: chickenButton,
      position: [110, 632],
      hoverEffect: "glow",
      condition: s => s.gingerbreadButtonPie === "ingredients",
      onClick: () => {
        hiddoPos({ visible: true });
        updateBackground({ blur: true });
        onState(
          s => s.neededIngriedients.includes("eggs"),
          () => {
            hiddo("Hee kippetjes, hebben jullie misschien ook eieren?");
            playSound(chickenAlarm);
            hiddo("... ... ...");
            hiddoPos({
              x: 412,
              y: 330,
              visible: true,
            });
            hiddo("Dank je wel!", { expression: "very-enthusiastic" });
            hiddoPos({
              x: 512,
              y: 130,
              visible: true,
            });
            pause(200);
            updateState(a => a.findIngredient("eggs"));
          },
          () => {
            hiddo("Nog bedankt voor de eitjes!");
          }
        );
        updateBackground({ blur: false });
        hiddoPos({ visible: false });
      },
    },
    {
      id: "door",
      hoverEffect: "glow",
      coordinates: [680, 495, 735, 495, 737, 596, 680, 596],
      onClick: () => {
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
              dollSettings: { expression: "mouth-closed" },
            });
            updateBackground({ blur: true });
            playSound(doorKnock, { wait: true });
            hiddo("Hallo?", { expression: "happy" });
            piet("Hallo! Wat fijn dat je ons wilt helpen!", {
              expression: "happy",
            });
            hiddo("Zeker, zou je de deur open willen doen?");
            hiddoDoll({ expression: "mouth-closed" });
            piet("Ja graag! Maar ik ben de sleutel kwijtgeraakt.", {
              expression: "sip",
            });
            updateBackground({ blur: false });
            hiddoPos({ visible: false });
          }
        );
      },
    },
  ]);

  hold();
};

export default pietenhuis;
