import sceneHelpers from "../../lib/scripts/scene";
import screenHelpers from "../../lib/scripts/screen";
import { Queue } from "../../lib/types";

const event = (queue: Queue) => {
  const { fadeIn, fadeOut } = screenHelpers(queue);
  const { updateBackground, manageCharacter, pause } = sceneHelpers(queue);
  // const { playMusic, playSound, stopMusic } = audioHelpers(queue);
  // const { caph, silhouette } = characterHelpers(queue);

  updateBackground({
    image: "livingRoom",
  });

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

  fadeIn();
  // playSound(tvSound);
  piet("Hee hallo lieve kinderen!", { expression: "05" });
  pause();

  updateBackground({ image: "livingRoomKids" });

  pietPos({ visible: false });

  pause();
  fadeOut();
  pause(500);
  updateBackground({ image: "pietenhuis" });
  fadeIn();
};

export default event;
