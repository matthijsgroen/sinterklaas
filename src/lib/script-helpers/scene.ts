import characters, { Character, CharacterSetup } from "src/state/characters";
import background from "src/state/background";
import dialog from "src/state/dialog";
import { dispatchQ, holdQ, pauseQ, jumpQ } from "../events";
import { Queue } from "../events/types";
import { DialogProps } from "src/components/Dialog";
import { DollSettings } from "src/content/dolls/types";

const character = (queue: Queue) => <TDoll extends keyof DollSettings>(
  id: string,
  dollType: TDoll,
  name: string,
  settings: CharacterSetup<TDoll>,
  portraitSettings?: Partial<Omit<Character<TDoll>, "id" | "doll">>,
  dialogSettings?: Partial<Omit<DialogProps, "name" | "text">>
) => {
  const dispatch = dispatchQ(queue);
  const pause = pauseQ(queue);

  dispatch(characters.actions.add(id, dollType, settings));

  return {
    pos: (pos: Partial<Omit<Character<TDoll>, "id" | "doll">>) => {
      dispatch(characters.actions.update(id, pos));
    },
    doll: (pose: DollSettings[TDoll]) => {
      dispatch(characters.actions.dollUpdate(id, pose));
    },
    say: (contents: string, pose?: DollSettings[TDoll]) => {
      if (pose) {
        dispatch(characters.actions.dollUpdate(id, pose));
      }
      dispatch(dialog.actions.say(name, contents));
      pause();
      dispatch(dialog.actions.hide());
    },
    portrait: (contents: string, pose?: DollSettings[TDoll]) => {
      dispatch(
        characters.actions.add(`${id}Portrait`, dollType, {
          ...portraitSettings,
          dollSettings: { ...portraitSettings?.dollSettings, ...pose },
        })
      );
      dispatch(dialog.actions.say(null, contents, dialogSettings));
      pause();
      dispatch(characters.actions.remove(`${id}Portrait`));
      dispatch(dialog.actions.hide());
    },
    remove: () => {
      dispatch(characters.actions.remove(id));
    },
  };
};

const sceneHelpers = (queue: Queue) => {
  const dispatch = dispatchQ(queue);
  const pause = pauseQ(queue);
  const manageCharacter = character(queue);
  const hold = holdQ(queue);
  const jump = jumpQ(queue);

  return {
    manageCharacter,
    updateBackground: (...args: Parameters<typeof background.actions.update>) =>
      dispatch(background.actions.update(...args)),
    createCharacter: (...args: Parameters<typeof characters.actions.add>) =>
      dispatch(characters.actions.add(...args)),
    removeCharacter: (...args: Parameters<typeof characters.actions.remove>) =>
      dispatch(characters.actions.remove(...args)),
    pause: (delay?: number) => pause(delay),
    hold,
    jump,
    say: (...args: Parameters<typeof dialog.actions.say>) => {
      dispatch(dialog.actions.say(...args));
      pause();
      dispatch(dialog.actions.hide());
    },
  };
};

export default sceneHelpers;
