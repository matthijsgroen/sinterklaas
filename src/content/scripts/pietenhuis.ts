import sceneHelpers from "src/lib/scripts/scene";
// import screenHelpers from "src/lib/scripts/screen";
import gameHelpers from "src/lib/scripts/game";
import { Queue } from "src/lib/types";
import flowHelpers from "src/lib/scripts/flow";
import { holdQ } from "src/lib/events";

const pietenhuis = (queue: Queue) => {
  const hold = holdQ(queue);
  // const { fadeIn } = screenHelpers(queue);
  const { updateBackground } = sceneHelpers(queue);
  const { onState, updateState } = gameHelpers(queue);
  const { buttons } = flowHelpers(queue);

  updateBackground({ image: "pietenhuis", frontLayer: undefined, blur: false });

  buttons([
    {
      id: "key",
      skip: state => state.mansionKey,
      hoverEffect: "glow",
      image: "",
      position: [0, 0],
      onClick(button) {
        updateState(a => a.getKey());
        button.remove();
      },
    },
    {
      id: "door",
      hoverEffect: "glow",
      image: "",
      position: [0, 0],
      onClick() {
        onState(
          state => state.mansionKey,
          () => {
            // Open de deur
          },
          () => {
            // Praat met piet dat deur op slot zit, en hij je heeel graag binnen wil laten maar het niet lukt
          }
        );
      },
    },
  ]);

  hold();
};

export default pietenhuis;
