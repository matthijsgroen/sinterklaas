import sceneHelpers from "../../lib/scripts/scene";
import screenHelpers from "../../lib/scripts/screen";
import { Queue } from "../../lib/types";
import characterHelpers from "./helpers/characters";

const event = (queue: Queue) => {
  const { fadeIn, fadeOut } = screenHelpers(queue);
  const { updateBackground, manageCharacter, pause } = sceneHelpers(queue);
  // const { playMusic, playSound, stopMusic } = audioHelpers(queue);
  const { silhouette } = characterHelpers(queue);

  updateBackground({
    image: "livingRoom",
  });

  const hiddoP = silhouette("hiddo", "Hiddo");
  const jinteP = silhouette("jinte", "Jinte");

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
};

export default event;
