import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";
import characterHelpers from "./helpers/characters";

import carStoppingSound from "../assets/sounds/352744__rosebugg__car-stopping.wav";
import carDoorClose from "../assets/sounds/208695__monotraum__car-door-close.wav";

const intro = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    updateBackground,
    manageCharacter,
    pause,
    jump,
    playSound,
  } = scriptHelpers(queue);
  const { reporter, hiddoP, jinteP } = characterHelpers(queue);
  const hiddo = hiddoP({});
  const jinte = jinteP({});

  updateBackground({
    image: "livingRoom",
    kids: false,
    tv: false,
  });

  fadeIn();
  pause();
  hiddo("Mam, het gaat beginnen!");
  updateBackground({ image: "livingRoom", tv: true, kids: false });
  jinte("Hoofdpiet is op de TV!");
  updateBackground({ image: "livingRoom", tv: true, kids: true });

  pause();
  fadeOut();
  pause(500);
  updateBackground({ image: "pietenhuis", frontLayer: "news", blur: true });

  const { say: piet, pos: pietPos } = manageCharacter(
    "piet",
    "piet",
    "Hoofdpiet",
    {
      x: 350,
      y: 20,
      dollSettings: {},
    }
  );
  pietPos({ x: 550, y: 85, scale: 1.0 });
  fadeIn();
  pause();

  piet("Hallo kinderen.", { expression: "hmm" });
  piet("We zijn weer in het land!", { expression: "happy" });
  piet("Maar helaas, niet alles gaat zoals we dat zouden willen.", {
    expression: "hmm",
  });
  piet("Er is nog van alles wat we moeten regelen voor pakjes avond.", {
    expression: "sip",
  });
  piet("En ik weet niet of we *alles* op tijd geregeld kunnen krijgen...", {
    expression: "hmm",
  });
  reporter("Wat voor dingen moeten er dan nog geregeld worden?");
  piet("Nou, van alles...", { expression: "sip" });
  piet("Maar ik weet wat!", { expression: "happy", body: "pointUp" });
  piet("Misschien kunnen de kinderen ons helpen!", { expression: "happy" });
  piet("Dan komt het vast wel goed!", { body: "default" });
  fadeOut();
  pietPos({ visible: false });

  updateBackground({
    image: "livingRoom",
    tv: true,
    kids: true,
    frontLayer: undefined,
    blur: false,
  });
  pause(300);
  fadeIn();
  jinte("Mam! We moeten Sinterklaas helpen!");
  hiddo("Ze zoeken kinderen om te helpen voorbereiden!");
  hiddo("Onze... *slik* kadootjes staan op het spel!", {
    expression: "shocked",
  });
  fadeOut();
  playSound(carStoppingSound, { wait: true });
  playSound(carDoorClose);
  jump("pietenhuis");
};

export default intro;
