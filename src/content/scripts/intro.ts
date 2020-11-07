import sceneHelpers from "../../lib/scripts/scene";
import screenHelpers from "../../lib/scripts/screen";
import { Queue } from "../../lib/types";
import characterHelpers from "./helpers/characters";

const intro = (queue: Queue) => {
  const { fadeIn, fadeOut } = screenHelpers(queue);
  const { updateBackground, manageCharacter, pause } = sceneHelpers(queue);
  // const { playMusic, playSound, stopMusic } = audioHelpers(queue);
  const { silhouette } = characterHelpers(queue);

  updateBackground({
    image: "livingRoom",
  });

  const hiddoP = silhouette("hiddo", "Hiddo");
  const jinteP = silhouette("jinte", "Jinte");
  const reporterP = silhouette("reporter", "Verslaggever");

  fadeIn();
  // playSound(tvSound);
  hiddoP("Mam, het gaat beginnen!");
  // tv aan
  updateBackground({
    image: "livingRoom",
    tv: true,
    kids: false,
  });

  jinteP("Zwarte Piet is op de TV!");

  updateBackground({
    image: "livingRoom",
    tv: true,
    kids: true,
  });

  pause();
  fadeOut();
  pause(500);
  updateBackground({ image: "pietenhuis", frontLayer: "news" });

  const { say: piet, pos: pietPos } = manageCharacter(
    "piet",
    "piet",
    "Zwarte piet",
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
  piet("Maar helaa, niet alles gaat zoals we dat zouden willen.", {
    expression: "hmm",
  });
  piet("Er is nog van alles wat we moeten regelen voor pakjes avond.");
  piet("En ik weet niet of we *alles* op tijd geregeld kunnen krijgen...");
  reporterP("Wat voor dingen moeten er dan nog geregeld worden?");
  piet("Nou, van alles...");
  piet("Maar ik weet wat!");
  piet("Misschien kunnen de kinderen ons helpen!");
  piet("Dan komt het vast wel goed!");
  fadeOut();
  pietPos({ visible: false });

  updateBackground({
    image: "livingRoom",
    tv: true,
    kids: true,
  });
  pause(300);
  fadeIn();
  jinteP("Mam! We moeten Sinterklaas helpen!");
  hiddoP("Ze zoeken kinderen om te helpen voorbereiden!");
  hiddoP("Onze... *slik* kadootjes staan op het spel!");
  fadeOut();
};

export default intro;
