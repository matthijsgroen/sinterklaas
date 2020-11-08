import { DollSettings } from "../../dolls/types";
import { dispatchQ, pauseQ } from "src/lib/events";
import { Queue } from "src/lib/types";
import dialog from "src/state/dialog";
import characters from "src/state/characters";

const characterHelpers = (queue: Queue) => {
  const dispatch = dispatchQ(queue);
  const pause = pauseQ(queue);

  const hiddoP = (defaults: DollSettings["hiddo"] = {}) => (
    contents: string,
    pose: DollSettings["hiddo"] = {}
  ) => {
    dispatch(
      characters.actions.add("hiddoPortrait", "hiddo", {
        x: 810,
        y: 330,
        flipped: false,
        portrait: true,
        dollSettings: { ...defaults, ...pose },
      })
    );
    dispatch(dialog.actions.say("Hiddo", contents, { paddingRight: 370 }));
    pause();
    dispatch(characters.actions.remove("hiddoPortrait"));
    dispatch(dialog.actions.hide());
  };

  const jinteP = (defaults: DollSettings["jinte"] = {}) => (
    contents: string,
    pose: DollSettings["jinte"] = {}
  ) => {
    dispatch(
      characters.actions.add("jintePortrait", "jinte", {
        x: 810,
        y: 330,
        flipped: false,
        portrait: true,
        dollSettings: { ...defaults, ...pose },
      })
    );
    dispatch(dialog.actions.say("Jinte", contents, { paddingRight: 370 }));
    pause();
    dispatch(characters.actions.remove("jintePortrait"));
    dispatch(dialog.actions.hide());
  };

  const reporter = (contents: string) => {
    dispatch(
      characters.actions.add("reporter", "silhouette", {
        x: 30,
        y: 440,
        portrait: true,
        flipped: true,
        dollSettings: { sil: "reporter" },
      })
    );
    dispatch(dialog.actions.say(null, contents, { paddingLeft: 240 }));
    pause();
    dispatch(characters.actions.remove("reporter"));
    dispatch(dialog.actions.hide());
  };

  const pietP = (defaults: DollSettings["piet"] = {}) => (
    contents: string,
    pose: DollSettings["piet"] = {}
  ) => {
    dispatch(
      characters.actions.add("pietPortrait", "piet", {
        x: 820,
        y: 410,
        flipped: false,
        portrait: true,
        dollSettings: { ...defaults, ...pose },
      })
    );
    dispatch(dialog.actions.say("Hoofdpiet", contents, { paddingRight: 370 }));
    pause();
    dispatch(characters.actions.remove("pietPortrait"));
    dispatch(dialog.actions.hide());
  };

  return {
    hiddoP,
    jinteP,
    pietP,
    reporter,
  };
};

export default characterHelpers;
