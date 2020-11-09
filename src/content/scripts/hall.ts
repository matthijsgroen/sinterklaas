import { Queue } from "src/lib/types";
import sceneHelpers from "src/lib/scripts/scene";
import screenHelpers from "src/lib/scripts/screen";

const pietenhuis = (queue: Queue) => {
  const { fadeIn } = screenHelpers(queue);
  const { updateBackground, manageCharacter } = sceneHelpers(queue);
  const { say: hiddo } = manageCharacter("hiddo", "hiddo", "Hiddo", {
    x: 512,
    y: 130,
    dollSettings: {},
  });

  updateBackground({ image: "hall", frontLayer: undefined, blur: false });
  fadeIn();
  hiddo("Wow!");
};

export default pietenhuis;
