import sceneHelpers from "src/lib/scripts/scene";
import screenHelpers from "src/lib/scripts/screen";
import { Queue } from "src/lib/types";

const pietenhuis = (queue: Queue) => {
  const { fadeIn } = screenHelpers(queue);
  const { updateBackground, pause } = sceneHelpers(queue);

  updateBackground({ image: "pietenhuis", frontLayer: undefined, blur: false });

  fadeIn();
  pause();
};

export default pietenhuis;
