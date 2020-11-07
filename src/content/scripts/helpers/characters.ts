import { DollSettings } from "../../dolls/types";
import { dispatchQ, pauseQ } from "src/lib/events";
import { Queue } from "src/lib/types";
import dialog from "src/state/dialog";
import characters from "src/state/characters";

const characterHelpers = (queue: Queue) => {
  const dispatch = dispatchQ(queue);
  const pause = pauseQ(queue);

  const silhouette = (sil: DollSettings["silhouette"]["sil"], name: string) => (
    contents: string
  ) => {
    dispatch(
      characters.actions.add(sil, "silhouette", {
        x: 800,
        y: 330,
        portrait: true,
        dollSettings: { sil },
      })
    );
    dispatch(dialog.actions.say(name, contents, { paddingRight: 300 }));
    pause();
    dispatch(characters.actions.remove(sil));
    dispatch(dialog.actions.hide());
  };

  return {
    silhouette,
  };
};

export default characterHelpers;
